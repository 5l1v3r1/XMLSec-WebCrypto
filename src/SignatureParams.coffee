class window.SignatureParams

  @signAlg = ""
  @signAlgURI = ""
  @references = []
  @publicKey = ""
  @privateKey = ""
  @prefix =""
  @canonicalisationAlgURI = ""
  @canonicalisationAlg = ""
  @signatureValue = ""
  @signatureType = ""

  ###
  Creates the SignatureParams object and sets the prefix to "" for the case, that the prefix stays unset
  ###
  constructor:()->
    @prefix = ""

  ###
  Sets the variable for the Canonicalisation Algorithmus for the URI and the intern use
  ###
  setCanonicalisationAlg:(canonAlg)->
    @canonicalisationAlgURI=XMLSecEnum.AlgIdentifiers[canonAlg]
    @canonicalisationAlg=XMLSecEnum.WebCryptoAlgMapper[canonAlg]
    if !@canonicalisationAlg or @canonicalisationAlg ==""
      throw new Error "Algorithm not supported:" +canonicalisationAlg
  ###
  Sets the prefix and append ":"
  ###
  setPrefix:(prefix)->
    if prefix != ""
      #is there a :
      if prefix.indexOf(":") == -1
        @prefix = prefix+":"
      else
        @prefix = prefix

  ###
  Sets the signature Algorithm variable for URI an internal use
  ###
  setSigAlg : (signAlg)->
    @signAlgURI= XMLSecEnum.AlgIdentifiers[signAlg]
    @signAlg = XMLSecEnum.WebCryptoAlgMapper[signAlg]
    if !@signAlg or @signAlg ==""
      throw new Error "Algorithm not supported:"+signAlg

  ###
  Opatain the Algorithm from a passed URI and sets map it to the internal identifier
  ###
  setSigAlgFromURI : (signAlg)->
    @signAlgURI= signAlg
    @signAlg = Helper.mapFromURI(signAlg)
    if !@signAlg or @signAlg ==""
      throw new Error "Algorithm not supported:"+signAlg

  #Opatain the Algorithm from a passed URI and sets map it to the internal identifier
  setCanonicalisationAlgFromURI:(canonAlg)->
    @canonicalisationAlgURI=canonAlg
    @canonicalisationAlg=Helper.mapFromURI(canonAlg)
    if !@canonicalisationAlg or @canonicalisationAlg ==""
      throw new Error "Algorithm not supported:" +canonAlg

  ###
  Sets the reference objects an add the enveloped Signature transformation if nessesary
  ###
  setReferences:(references)->
    @references = references
    if @signatureType == XMLSecEnum.signatureTypesEnum.Enveloped
      if references
        for i in [0..@references.length-1]
          @references[i].setEnvelopedSignatureTransform()

  ###
  Sets the public and private key variables
  ###
  setKeyPair:(publicKey,privateKey)->
    @publicKey = publicKey
    @privateKey = privateKey
    if !@publicKey or !@privateKey
      throw new Error "No key"

  ###
  Sets the SignatureValue varibale
  ###
  setSignatureValue:(signatureValue) ->
    @signatureValue=signatureValue

  ###
  Sets the SignatureType and add the envelopedSignature transformation to each reference if nessesary
  ###
  setSignatureType:(signatureType) ->
    @signatureType=signatureType
    if signatureType == XMLSecEnum.signatureTypesEnum.Enveloped
      if @references
        for i in [0..@references.length-1]
          @references[i].setEnvelopedSignatureTransform()

  ###
  Returns an object wit all information for signature generation
  ###
  getSignatureParams:() ->
    signatureParams = {
      signAlgURI : @signAlgURI,
      signAlg:@signAlg,
      references : @references,
      privateKey : @privateKey,
      publicKey : @publicKey,
      prefix : @prefix,
      canonicalisationAlg:@canonicalisationAlg
      canonicalisationAlgURI:@canonicalisationAlgURI,
      signatureValue:@signatureValue,
      signatureType:@signatureType
    }
