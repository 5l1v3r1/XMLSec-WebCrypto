class window.Helper

  constructor: () ->
  ###
  Converts a base64 string into an arrayBuffer
  base64: base64 encoded input string
  ###
  @base64ToArrayBuffer:(base64) ->
      binary_string =  window.atob(base64);
      len = binary_string.length;
      bytes = new Uint8Array( len );
      for i in [0.. len-1]
        bytes[i] = binary_string.charCodeAt(i);

      return bytes.buffer;

  ###
  Converts a base64 encoded string into a base64URL string
  data: base64  encoded input string
  ###
  @base64ToBase64URL:(data)->
    data = data.split('=').toString()
    data = data.split('+').join('-').toString()
    data = data.split('/').join('_').toString()
    data = data.split(',').join('').toString()
    data = data.trim()
    return data;


  ###
  Concatinates two arrayBuffers results in buffer1||buffer2
  buffer1: The first Buffer
  buffer2: The second Buffer
  ###
  @concatArrayBuffers:(buffer1,buffer2) ->
    cBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    cBuffer.set(new Uint8Array(buffer1), 0);
    cBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return cBuffer.buffer

  ###
  Gererates a 256 Bit GUID and return it as an base64 encoded string
  ###
  @generateGUID:()->
    id = window.crypto.getRandomValues(new Uint8Array(32))
    id = base64ArrayBuffer(id)
    id = Helper.base64ToBase64URL(id)

  ###
  Gets an identifer from the Mapping enumeration from an passed uri
  ###
  @mapFromURI:(uri) ->
    uri=uri.toLowerCase()
    uri = uri.toLowerCase()
    uri = btoa(uri)
    uri = Helper.base64ToBase64URL(uri)
    internalIdentifier = XMLSecEnum.URIMapper[uri]
    result = XMLSecEnum.WebCryptoAlgMapper[internalIdentifier]
    if result
      return result
    else
      return internalIdentifier

  @base64URLtoBase64:(base64URL)->
    base64URL = base64URL.split('-').join('+').toString()
    base64URL = base64URL.split('_').join('/').toString()
    if base64URL.length%4 == 1
      base64URL+="="
    if base64URL.length%4 == 2
      base64URL+="=="
    return base64URL

  ###
  Ensures that the actual node has an Id. If not create one
  ###
  @ensureHasId= (node) ->
    attr = ""
    #If the nodetype of the node is 9, we have to use the document element instead of the node
    if node.nodeType ==9
      node = node.documentElement
    #Look if there is an Id Attribut in the node
    for i in [0..XMLSecEnum.idAttributes.length-1]
      #if there is one break
      attr = utils.findAttr(node,XMLSecEnum.idAttributes[i])
      if attr then break
    if attr
      #and return the value
      return attr.value

    #else create a new ID using a 256bit random value base64 URL coded

    id= Helper.generateGUID()

    #set the attribute
    node.setAttribute('ID', id)

    #return the id
    return id
