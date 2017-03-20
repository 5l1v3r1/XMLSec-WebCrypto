class window.EncryptedXML

  constructor: () ->

  ###
  Performs the encryption of a XML Document
  doc: XML Document to encrypt
  encParams: The EncryptionParams object
  ###
  encrypt: (doc,encParams) ->
    encryptedDataNodes= [] # list holding encryptedData Elements
    nodes=[] # list holding all elements resulting from one xpath expression
    nodelist = [] #list holding Elements to encrypt
    #iterate trough all references in the encParams and evaluate the xpath
    for j in [0..encParams.references.length-1]
      nodes[j] = xpath.select(encParams.references[j].xpath, doc)
      if (nodes[j].length == 0)
        throw new Error "Node not found or invalid xPath:" + encParams.references[j].xpath
      #iterate trough the nodeset resulting from the references xpath
      for k in [0..nodes[j].length-1]
        nodelist.push(nodes[j][k]) #list with all node resulting from all xpath
    Promise.all(
      #encrypt all selected elements
      for i in [0..nodelist.length-1]
        CryptoWrapper.Encryption(nodelist[i],encParams.symKey,encParams.staticIV)
        .then((cipherValue) ->
          #if a keyInfo Element has to be created, do so.
          if(encParams.withKeyInfo)
            #generte a id for the EncryptedData Element to bind it to the keyInfo Element
            encKeyid = "Id_"+ encParams.asymKeyName+"_"+Helper.generateGUID()
            #Create the EncryptedData element
            encData = createEncryptedData(cipherValue[0],cipherValue[1],encParams,encKeyid)
            .then((result)->
              #parse the result
              encData= utils.parseXML(result)
              #and put it in the list with the encyptedData elements
              encryptedDataNodes.push([encData,encParams.keyName])
             )
          #if no KeyInfo is used
          else
            #create the encryptedData element without keyInfo
            encData = createEncryptedData(cipherValue[0],cipherValue[1],encParams,encKeyid)
            encData= utils.parseXML(encData)
            #and put it in the list
            encryptedDataNodes.push([encData,""])
            )
      )
      .then(()->
        # replace the original plaintext node with the encrypted node.
        for i in [0..encryptedDataNodes.length-1]
          nodelist[i].parentNode.replaceChild(encryptedDataNodes[i][0].firstChild, nodelist[i])
        return doc)

  ###
  creates the encryptedData element
  cipherValue: The CipherValue of the node
  nodeType: Content or element
  encParams: The EncryptionParams object
  id (optional) : The id used if an encryptedKey is uses
  ###
  createEncryptedData=(cipherValue,nodeType,encParams,id) ->
    # if the nodeType is 3, a content was encrypted
    if nodeType is 3
      #so set the URI to "Content"
      typeToEncrypt = XMLSecEnum.namespaceURIs.xmlEnc+XMLSecEnum.Type.Content
    else
      #else an element was encrypted. So set the URI to "Element"
      typeToEncrypt = XMLSecEnum.namespaceURIs.xmlEnc+XMLSecEnum.Type.Element
    # if an EncryptedKey Element is used
    if(encParams.withKeyInfo)
      #create the encryptedKey
      CryptoWrapper.WrapKey(encParams.symKey,encParams.asymKey)
      .then((encKey)->
        #create the encryptedKey Element
        encKeyEle = ElementBuilder.buildEncryptedKeyElement(encParams,encKey)
        #create the EncryptedData Element with the encryptedKey Element
        encDataElement = ElementBuilder.buildEncryptedDataElement(typeToEncrypt,cipherValue,encParams,encKeyEle,id)
        )
    else
      #else create the EncryptedData Element without the encryptedKey Element
      encDataElement=ElementBuilder.buildEncryptedDataElement(typeToEncrypt,cipherValue,encParams)

  ###
  Unwraps the encypted key
  encData: one encryptedData element
  asymKey: an assymertric key used for unwrap the symmetric key
  ###
  unwrapKey= (encData,asymKey)->
    #Get the symmetric algorithm URI use for encryption
    algorithmURI = encData.getElementsByTagName(XMLSecEnum.NodeNames.encMethod)[0].getAttribute(XMLSecEnum.AttributeNames.algorithm)
    #Map the URI to an identifer the WebCryptoAPI understands
    algId = Helper.mapFromURI(algorithmURI)
    #get the encrypted Key Element from the the encryptedData element
    encKeyEle = encData.getElementsByTagName(XMLSecEnum.NodeNames.encKey)[0]
    #get the cipherValue from the encrypetedKey element
    encKey = encKeyEle.getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML
    #and remove it form to assure that it remains only on cipherValue Element in the encryptedData element.
    #At the beginnig there are 2: One is the cipherValue form the the other is the cipherValue of the encrypted Data.
    #The cipherValue in the encrypetedKey is easy to optain, because we can only look at the EncryptedKey element.
    #If the cipherValueof the encrypetedKey remains in the document and we look for the one of the encrypted data, we don't know which one we get,
    #so remove the first one.
    encKeyEle.parentNode.removeChild(encKeyEle)
    #Unwrap the key
    CryptoWrapper.UnWrapKey(encKey,asymKey,algId.toUpperCase())
    .then((symKey)->
      #and return the key
      return symKey
      )

  ###
  Decrypts alle encryptedData nodes recursivly to map the right ElementType to the corrosponding Element
  encData: A list of encryptedData Elements
  key: A WebCryptoApi key object either simmertic or asymmetric
  decryptedNode: the already decrypted nodes
  index: The index of the actual processed encryptedData node
  ###
  decryptRecursive=(encData,key,decryptedNodes,index)->
    type=Helper.mapFromURI(encData[index].getAttribute(XMLSecEnum.AttributeNames.type))
    if key.type==XMLSecEnum.KeyTypes.Private
      #the unwrap the symmetric key with this key
      unwrapKey(encData[index],key)
      .then((symKey)->
        #Get the cipherValue of the encryptedData Element
        cipherValue = encData[index].getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML
        #and decrypt the encryptedData element with the unwrapped key
        CryptoWrapper.Decryption(cipherValue,symKey)
        .then((decrypted)->
            #Put the decrypted node in the list
            decryptedNodes.push([decrypted,type])
            #If there are encryptedData nodes remaining, go on
            if index < encData.length-1
              decryptRecursive(encData,key,decryptedNodes,index+1)
          )
      )
    #if the passed key is a symmetric key
    else if key.type ==XMLSecEnum.KeyTypes.Secret
      #get the cipherValue from the encryptedData element
      cipherValue = encData[index].getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML
      #decrypt the cipherValue using the symmetric key
      CryptoWrapper.Decryption(cipherValue,key)
      .then((decrypted)->
          #put the decrypted Element in the list
          decryptedNodes.push([decrypted,type])
          if index < encData.length-1
            #If there are encryptedData nodes remaining, go on
            decryptRecursive(encData,key,decryptedNodes,index+1)
        )


  decrypt:(doc,key) ->
    decryptedNodes = [] #List of nodes that are decrypted
    #get all encryptedData nodes
    encData = xpath.select(XMLSecEnum.xPathSelectors.EncryptedData,doc)
    if (encData.length==0)
      throw new Error "No encData found"
    #Decrypt all EncryptedData nodes recursive
    decryptRecursive(encData,key,decryptedNodes,0)
    .then(()->
      #iterate through the list of decrypted Nodes
      for i in [0..decryptedNodes.length-1]
        #if the type from the Type array at index i is "Element". The index of the Type array is the same as the index of the decryptedNodes Array
        if(decryptedNodes[i][1] == XMLSecEnum.Type.Element)
          #replace the encryptedData element with the decrypted element
          encData[i].parentNode.replaceChild(utils.parseXML(decryptedNodes[i][0]).firstChild,encData[i])
        else
          #if the type is "Content" get the parent node
          parentNode = encData[i].parentNode
          #remove the encryptedData Element
          encData[i].parentNode.removeChild(encData[i].parentNode.firstChild)
          #put the decrypted data as content in the parent node
          parentNode.innerHTML = decryptedNodes[i][0]
      return doc
      )
