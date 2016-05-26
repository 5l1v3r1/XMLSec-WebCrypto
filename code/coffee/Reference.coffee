class window.Reference
  xpath : ""
  transforms : []
  digestAlg : ""
  digestAlgURI : ""
  uri : ""
  digestValue : ""
  isEmptyUri : ""

  ###
  Erzeugung des Referenzobjektes für die Signaturerstellung
  ###
  constructor: (@xpath,@transforms,@digestAlg,@uri,@digestValue) ->
    #If the xpath indicates that the complete Document is processed set the xpath to "/*" ans sets the isEmptyUri Flag to true
    if @xpath =="/*" or @xpath==""
      @xpath="/*"
      @isEmptyUri=true
    else
      @isEmptyUri=false
    #Set the AlgorithmIdentifiers on behalf of the passed transformations
    if @transforms
      for i in [0..@transforms.length-1]
        if @transforms[i].indexOf("http") > -1
          @transforms[i] = @transforms[i]
        else if XMLSecEnum.AlgIdentifiers[@transforms[i]]
          @transforms[i] = XMLSecEnum.AlgIdentifiers[@transforms[i]]
        else throw new Error "Algorithm not Supported:"+ @transforms[i]
      @transforms = sortTransForc14n(@transforms)
    #Set the digest algorithm on behalf of the passed Algorithm
    if @digestAlg
      #If an URI is passed
      if @digestAlg.indexOf("http") > -1
        @digestAlgURI = @digestAlg
        @digestAlg = Helper.mapFromURI(@digestAlg)

      else if XMLSecEnum.AlgIdentifiers[@digestAlg.toUpperCase()]
        #The Digest URI
        @digestAlgURI = XMLSecEnum.AlgIdentifiers[@digestAlg.toUpperCase()]
        #The Digest Identifier
        @digestAlg= XMLSecEnum.WebCryptoAlgMapper[@digestAlg.toUpperCase()]
    new Error "Algorithm not Supported:"+ @digestAlg

  ###
  If the signatureType is "enveloped", then the enveloped signature transformation is set
  ###
  setEnvelopedSignatureTransform:()->
    hasEnvelopedTransform = false
    #Check if there is already an envelopedSignature transformation
    if @transforms
      for i in [0..@transforms.length-1]
        if XMLSecEnum.AlgIdentifiers[@transforms[i]] == XMLSecEnum.AlgIdentifiers.envSig or  @transforms[i]==XMLSecEnum.AlgIdentifiers.envSig
          hasEnvelopedTransform = true
          break
    #if not, put the transformation in the list
    if hasEnvelopedTransform == false
      @transforms[@transforms.length] = XMLSecEnum.AlgIdentifiers.envSig

    #Sort the transformations
    @transforms = sortTransForEnvSig(@transforms)


  ###
  Puts the envelopedSignature transformation at the top of the list.
  ###
  sortTransForEnvSig = (transforms) ->
    sortedTransforms = []
    sortedTransforms.push(XMLSecEnum.AlgIdentifiers.envSig)
    for i in [0..transforms.length-1]
      if transforms[i] != XMLSecEnum.AlgIdentifiers.envSig
        sortedTransforms.push(transforms[i])
    @transforms = sortedTransforms

  ###
  Puts the c14m transformation at the end of the list. since the CanonicalXML is serialized.
  ###
  sortTransForc14n = (transforms) ->
    sortedTransforms = []
    for i in [0..transforms.length-1]
      if transforms[i] != XMLSecEnum.AlgIdentifiers.c14n
        sortedTransforms.push(transforms[i])

    sortedTransforms.push(XMLSecEnum.AlgIdentifiers.c14n)
    @transforms = sortedTransforms
