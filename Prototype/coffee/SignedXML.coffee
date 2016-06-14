class window.SignedXML



  constructor : () ->
    idCount = 0

  ###
  Computes the Signature and creates the signatureElement
  signedInfo: The signedInfo Element
  signatureParams: The signatureParams object
  ###
  computeSignature = (signedInfo,signatureParams)->
    #canonicalise the signedInfo
    cryptoInput = new CanonicalXML(signedInfo).CanonXML
    #Sign
    CryptoWrapper.Sign(cryptoInput,signatureParams)
    .then((signatureValue) ->
      #build the signature element with the computed signature Value
      ElementBuilder.buildSignatureElement(signatureParams.prefix,signedInfo,signatureValue)
    )

  ###
  signes the document.
  doc: The xml document to sign
  signatureParams: SignatureParams object with the required information
  ###
  sign : (doc,signatureParams) ->
    #create the prefix for the elements and the xmlns
    prefix = signatureParams.prefix

    if (prefix)
      currentPrefix = prefix
    else currentPrefix = ""

    #create the signedInfo Elemen
    signedInfo = createSignedInfo(doc, signatureParams)
    .then((signedInfo)->
      #create the signature
      computeSignature(signedInfo,signatureParams)
      .then((signature)->
          signatureElement = signature
          #create the keyInfo element
          createKeyInfo(currentPrefix,signatureParams.publicKey)
          .then((keyInfo)->
            #If it is a Signature, append KeyInfo. In case of HMAC do Nothing
            if(keyInfo)
              #append the keyInfo element to the signature element
              signatureElement.appendChild(keyInfo)
            #if it is an enveloped signature
            if(signatureParams.signatureType == XMLSecEnum.signatureTypesEnum.Enveloped)
              #Put the Signature as child element of the original Document
              doc.documentElement.appendChild(signature)
            #if it is a detached signature
            if(signatureParams.signatureType == XMLSecEnum.signatureTypesEnum.Detached)
              #create a new root element
              wrappingElement = ElementBuilder.buildWrappingElement()
              #and put the document and the signature as childs in it
              wrappingElement.documentElement.appendChild(doc.children[0])
              wrappingElement.documentElement.appendChild(signature)
              doc = wrappingElement
            ###
            if(signatureParams.signatureType == signatureParams.signatureTypesEnum.Enveloping)
              elementBuilder = new ElementBuilder
              signedObject = elementBuilder.buildSignedDataElement(signatureParams.prefix)
              signedObject.documentElement.appendChild(doc.children[0])
              signatureElement.appendChild(keyInfo)
              signatureElement.appendChild(signedObject.children[0])
              doc = signatureElement
            ###
            return doc
          )
        )
      )

  ###
  creates the keyInfo element
  prefix: The prefix to use
  key: The public key
  ###
  createKeyInfo=(prefix,key) ->
    #export the key.
    #Since the XML Signature needs a padding of leading "0" we cannot export the key as jwk because the jwk export delivers a base64 string
    #without padding. So we need to export the key as spki an parse it.
    algorithm = key.algorithm.name
    window.crypto.subtle.exportKey("jwk",key)
    .then((exportedKey)->
      #if the Algorithm is RSA-SHA1 create a RSAKeyInfo
      #Other Algs are not supported at this time
      if algorithm == XMLSecEnum.WebCryptoAlgMapper.RSASHA1.name
        #Code base64URL to base64
        exponent = Helper.base64URLtoBase64(exportedKey.e,exportedKey)
        modulus = Helper.base64URLtoBase64(exportedKey.n,exportKey)
        #build the keyInfo element with the data
        ElementBuilder.buildRSAKeyInfoElement(prefix,modulus,exponent )
      )


  ###
  creates the reference elements from the reference objects
  doc: The xml document to sign
  signatureParams: SignatureParams object with the required information
  ###
  createReferences=(doc,signatureParams) ->
    references = "" #List of referenc elements
    #Look at the references and create ne reference objects if required
    referenceList = buildReferenceList(doc,signatureParams)
    Promise.all(
      #create one reference element for each reference object
      for i in[0..referenceList.length-1]
        ref = referenceList[i]
        createReference(doc,signatureParams,ref)
        .then((reference) ->
          #and put it in the list
          references[i]=reference
          )
    )
    .then((references)->
        #return the list
        references)

  ###
  Expands the refernce list, if one xpath expression returns more then one node.
  In this case the original reference element is removed and for each resulting node there is a own refence object
  doc: The xml document to sign
  signatureParams: SignatureParams object with the required information
  ###
  buildReferenceList=(doc,signatureParams) ->
    newReferences = []
    reference = ""
    #inspect each reference Object
    for i in [0..signatureParams.references.length-1]
      ref = signatureParams.references[i]
      nodes = xpath.select(ref.xpath,doc)

      #If there are more then one hit for the xpath
      if nodes.length > 1
      #crate a reference object for each hit
        for j in [0..nodes.length-1]
          #and set the xpath to the Id of the node.
          #If the node has no Id, create one
          idBasedXpath = "//*[@id='"+Helper.ensureHasId(nodes[j])+"']"
          #create the new reference object
          reference = new Reference(idBasedXpath,ref.transforms,ref.digestAlgURI)
          newReferences.push(reference)

      else if (nodes.length == 1)
        #Set the xpath to an Id based. If the Element doesn't has an Id create one
        idBasedXpath = "//*[@id='"+Helper.ensureHasId(nodes[0])+"']"
        reference = new Reference(idBasedXpath,ref.transforms,ref.digestAlgURI)
        #if there is only one hit for the xpath use the original reference object
        newReferences.push(ref)

      else if (node.length == 0)
        throw new Error "Node not found or invalid xPath:"+ ref.xpath
    #return the new list
    return newReferences

  ###
  Create the reference element
  doc: The xml document to sign
  signatureParams: SignatureParams object with the required information
  ref: The reference object that holds the information for the reference element
  ###
  createReference= (doc, signatureParams,ref) ->
    prefix = signatureParams.prefix
    if (prefix)
      currentPrefix = prefix
    else currentPrefix = ""

    #Get the node
    nodes = xpath.select(ref.xpath,doc)[0]
    #Ensure that the node has an Id
    id = Helper.ensureHasId(nodes)


    #Apply Transforms at this point only c14n is supported. envelopedSignature transformation is perforemed on another place.
    transformed = nodes
    for i in [0..ref.transforms.length-1]
      if Helper.mapFromURI(ref.transforms[i]) == XMLSecEnum.WebCryptoAlgMapper.envelopedSignature
        #Do Nothing, just for Errorhandling
      #Has to be the last transformation since the CanonicalXML is serilized. Parsing removes Cononicalisation!!!
      else if Helper.mapFromURI(ref.transforms[i]) == XMLSecEnum.WebCryptoAlgMapper.c14n
        transformed = new CanonicalXML(transformed).CanonXML

      else throw new Error "Algorithm not supported"

    #calculate the digest Value
    digestValue = CryptoWrapper.hash(transformed,ref.digestAlg)
    .then((result)->
        #and create the Reference element
        ElementBuilder.buildReferenceElement(id,signatureParams.prefix,ref.transforms,ref.digestAlgURI,result)
      )
    .then( null, (err) ->
      console.log err)

  ###
  Creates the SignedInfo element
  doc: The xml document to sign
  signatureParams: SignatureParams object with the required information
  ###
  createSignedInfo= (doc,signatureParams) ->
    #get the signatureAlgURI
    signatureAlg = signatureParams.signatureAlg
    signedInfos =[]
    #create the References
    references = createReferences(doc,signatureParams)
    .then((ref)->
      #Create the SignedInfoElement
      ElementBuilder.buildSignedInfoElement(signatureParams,ref)
      )


  ###
  Loads the SignatureElement from the document and create a SignatureParams object
  xml: The signed XML Document
  SVR: The SignatureValidationResults Object
  ###
  loadSignature =(xml,SVR) ->
    #If the xml is a string, parse it into a XML Document
    if (typeof xml == 'string')
      signatureNode = $.parseXML(signatureNode)

    #Get the SignatureElement
    SignatureElement = $(xml).find(XMLSecEnum.NodeNames.signature)
    #If more then one Signature Element is detected, stop the operation
    if SignatureElement.length > 1
      throw new error "More then one Signature Element detected!"
    #Put the Signature Element in the SVR
    SVR.setValidatedSignature(SignatureElement)

    #creates a new SignatureParams object to store the required Information
    signature = new SignatureParams()
    #Get the Canonicalisation Alg
    nodes = xpath.select(XMLSecEnum.xPathSelectors.CanonicalisationAlg,xml)
    if nodes.length==0 then throw new Error("could not find CanonicalizationMethod/@Algorithm element")
    #Map the Uri to the internal identifier
    signature.setCanonicalisationAlgFromURI(nodes[0].value)

    #Get the Signature Algorithm URI and map it to the internal identifier
    signature.setSigAlgFromURI(utils.findFirst(xml,XMLSecEnum.xPathSelectors.SignatureAlg).value)

    loadedReferences = []
    #load all references from the signature element
    referencesToLoad = xpath.select(XMLSecEnum.xPathSelectors.References,xml)
    if (referencesToLoad.length == 0) then throw new Error("could not find any Reference elements")

    #Read the infromation from the reference elements and create a list with reference objects
    for  i in [0..referencesToLoad.length-1]
      loadedReferences.push(loadReference(referencesToLoad[i]))

    #Populate the SignatureParams object
    signature.setReferences(loadedReferences)
    signature.setSignatureValue(utils.findFirst(xml, XMLSecEnum.xPathSelectors.SingatureValue).data.replace(/\n/g, ''))

    #Remove the Signature node from the documentElement
    #$(xml).find(XMLSecEnum.NodeNames.signature)[0].remove()
    test = xpath.select(XMLSecEnum.xPathSelectors.Signature,xml)[0]
    test.remove()
    #return the created signatureParams object
    return signature.getSignatureParams()

  ###
  Create reference objects from reference elements
  ref: One reference element
  ###
  loadReference=(ref) ->
    #Get the DigestAlg
    attr = utils.findAttr(utils.findChilds(ref, XMLSecEnum.NodeNames.digestMethod)[0], XMLSecEnum.AttributeNames.algorithm)
    if (!attr) then throw new Error("could not find Algorithm attribute in node " + digestAlgoNode.toString())
    digestAlgo = attr.value

    #get the DigestValue
    nodes = utils.findChilds(ref, XMLSecEnum.NodeNames.digestValue)
    if (nodes.length==0) then throw new Error("could not find DigestValue node in reference " + ref.toString())
    if (nodes[0].childNodes.length==0 || !nodes[0].firstChild.data)
      throw new Error("could not find the value of DigestValue in " + nodes[0].toString())

    digestValue = nodes[0].firstChild.data
    references = []
    transforms = []
    #get all transformations
    nodes = utils.findChilds(ref, XMLSecEnum.NodeNames.transforms)
    if (nodes.length!=0)
      transformsNode = nodes[0]
      transformsAll = utils.findChilds(transformsNode, XMLSecEnum.NodeNames.transform)
      for t in [0..transformsAll.length-1]
        #Read the transformations and put it in a list.
        transforms.push(utils.findAttr(transformsAll[t], XMLSecEnum.AttributeNames.algorithm).value)

    #get the digest Alg URI and map it to the internal identifier
    digestAlg = Helper.mapFromURI(digestAlgo)
    #create the reference object
    reference =new Reference(xpath, transforms, digestAlg, utils.findAttr(ref, "URI").value, digestValue)

    return reference

  ###
  Method called from external to verify a signature Value
  sigXML: Signed Xml document
  publicKey: The verification key

  Returns a SignatureValidationResults object with information about errors, validated References an validated signiture
  ###
  verify : (sigXML,publicKey) ->
    ###
    if the passed XML is a string, parse it
    ###
    xml = $.parseXML(sigXML)
    if !xml
      xml=sigXML
    #Creates a new SignatureValidationResults object
    SVR = new SignatureValidationResults()

    #save the signed Info for signature Generation because the complete signature Element gets removed
    signedInfo = preserveSignedInfo(xml)
    #load the information from the signature element and store it in an SignatureParams object
    signature = loadSignature(xml,SVR)

    #Check if the SignatureType is "Enveloped"
    isEnveloped = checkForEnveloped(signature.references,signature.signatureTypesEnum)

    #If it isn't "Enveloped" remove remove the wrapping XML Element and look at the first child.
    #This is important in case of detached Signatures over the complete Document
    if isEnveloped == false
      xml = xml.children[0].firstChild
    #First validate the signature value
    validateSignatureValue(signedInfo,publicKey,signature)
    .then((verifikationResult)->
      SVR.setResult(verifikationResult[0])
      SVR.addValidationErrors(verifikationResult[1])
      #Then validate all references
      validateReferences(xml,signature.references,0,[])
      .then((referenceValidationResult)->
        #Put the results in the SVR
        SVR.setReferences(referenceValidationResult)
        #If there is a validation Error set the result to false
        if SVR.getValidationErrors().length > 0
          SVR.setResult(false)
        else if  SVR.getResult == true
          SVR.setResult(true)
        return SVR.getResults()
      )
    )
  ###
  Checks wether the signature is an enveloped or not by looking at the transformations.
  If it is an enveloped signature there must be an envelopedSignature transformations.
  references: All references form the signed Info
  ###
  checkForEnveloped = (references) ->
    #assume the Signature is not enveloped
    isEnveloped = false
    #Check in all references
    for i in [0..references.length-1]
      #all transformations
      for j in [0..references[i].transforms.length-1]
        #if one reference has the enveloped Signature transformation
        if references[i].transforms[j] == XMLSecEnum.AlgIdentifiers.envSig
          #the signature is enveloped
          isEnveloped = true
    return isEnveloped

  ###
  Saves the signedInfo Element from the signed xml document
  signedXml : The signed xml document
  ###
  preserveSignedInfo = (signedXml) ->
    xml = $(signedXml)
    if !xml
      xml=signedXml
    signedInfo = $(xpath.select(XMLSecEnum.xPathSelectors.SignedInfo,signedXml))
    return signedInfo[0]

  ###
  Validates the signature value
  signedInfo: The signedInfo element
  publicKey: The verification key
  signature: A signatureParams object
  SVR: The SignatureValidationResults object
  ###
  validateSignatureValue= (signedInfo,publicKey,signature) ->
    #Canonicalise the signedInfo Element
    canonXML = new CanonicalXML(signedInfo).CanonXML
    #call the Verify method
    CryptoWrapper.Verify(canonXML,publicKey,signature)
    .then((result) ->
      error = ""
      if !result
        error = "Signature Value is invalid"
      return [result,error]
      )

  ###
  Validates the references reqursive
  doc: The signed xml document
  references : The reference objects
  ###
  validateReferences= (doc,references,i,res) ->
    xmlDoc = $(doc)
    refValRes = res

    if !references[i].uri or references[i].uri == "/*"
      node = xmlDoc[0]
    else
      #else load only the specified Element
      nodes= xpath.select("//*[@id='"+references[i].uri.substring(1)+"']", doc)
      #if there are more then one result, the ID is not unique, so someting is wrong
      if nodes.length > 1
        throw new error "Id is not unique"
      node = nodes[0]
    #Apply Transforms at this point only c14n is supported. envelopedSignature transformation is perforemed on another place.
    transformed = node
    for t in [0..references[i].transforms.length-1]
      if Helper.mapFromURI(references[i].transforms[t]) == XMLSecEnum.WebCryptoAlgMapper.c14n
        transformed = new CanonicalXML(transformed).CanonXML
    #Calculate the digestValue
    digestValue = CryptoWrapper.hash(transformed,references[i].digestAlg)
    .then((result)->
      #If the calculated digestValue is not the same as the passed
      error = ""
      if (result!=references[i].digestValue)
        #Add the Error to the SVR
        error = "Reference Validation Error of " + references[i].uri
      refValRes.push([references[i],transformed,error])
      if i < references.length-1
        validateReferences(doc,references,i+1,res)
      else
        return refValRes
    )


  ###
  loads the key from the keyInfo element of the signed XML document
  doc: The signedXML document
  ###
  loadKey : (doc) ->
    #if doc is a string, parse it to xml
    xml = $.parseXML(doc)
    if !xml
      xml = doc
    #Read the modulus, exponent and algorithm from the document
    modulus = utils.findFirst(xml, XMLSecEnum.xPathSelectors.Modulus).data;
    exponent = utils.findFirst(xml,XMLSecEnum.xPathSelectors.Exponent).data;
    params = Helper.mapFromURI(utils.findFirst(xml,XMLSecEnum.xPathSelectors.SignatureAlg).value)
    modulusArray = new Uint8Array(Helper.base64ToArrayBuffer(modulus))
    #Get all requried algorithem information for the WebCryptoAPI
    #params = XMLSecEnum.WebCryptoAlgMapper[algorithm]
    #When the WebCryptoAPI exports a key, it removes leading "0". However the XML Signature requires leading "0" as padding.
    #So we have to remove all leading "0" from the key. To do so, we have to convert the base 64 string to hex and remove all leading "0"

    for i in [0..modulusArray.length-1]
      if modulusArray[0] == 0
        modulusArray = modulusArray.slice(1)
      else
        break

    #Then convert the hex to base64URL needed for WebCryptoAPI import
    #modulus =  convertHex2Base64(hex.toString())
    modulus=base64ArrayBuffer(modulusArray)
    modulus = Helper.base64ToBase64URL(modulus)

    exponentArray=new Uint8Array(Helper.base64ToArrayBuffer(exponent))
    #Do the same for the exponent
    for i in [0..exponentArray.length-1]
      if exponentArray[0] == 0
        hex = exponentArray.slice(1)
      else
        break

    exponent =  base64ArrayBuffer(exponentArray)
    exponent = Helper.base64ToBase64URL(exponent)

    #Import the key
    window.crypto.subtle.importKey(
        "jwk",
        {
            kty: params.kty, #KeyType
            e: exponent, #the exponent
            n: modulus, #the modulus
            alg: params.alg, #the algorithm
            ext: true
        },
        {
            name: params.name, # The name of the Algorithm
            hash: {name: params.hash}, # The name of the diegstMethod
        },
        false, # extractable
        ["verify"] # keyusage
    )
    .then((key) ->
      return key)
    .then(null,(err) ->
      console.log err)
