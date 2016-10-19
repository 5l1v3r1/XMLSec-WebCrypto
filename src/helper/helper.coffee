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
  @base64ToBase64URL:(data) ->
    data = data.split('=').toString()
    data = data.split('+').join('-').toString()
    data = data.split('/').join('_').toString()
    data = data.split(',').join('').toString()
    data = data.trim()
    return data;

  ###
  Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
  use window.btoa' step. Adapted from http://jsperf.com/encoding-xhr-image-data/5
  ###
  @arrayBufferToBase64:(arrayBuffer) ->
    encodings     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    bytes         = new Uint8Array(arrayBuffer)
    byteLength    = bytes.byteLength
    byteRemainder = byteLength % 3
    mainLength    = byteLength - byteRemainder

    # Combine the three bytes into a single integer
    get3To4Conversion = (i) ->
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
      # Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 # 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048)   >> 12 # 258048   = (2^6 - 1) << 12
      c = (chunk & 4032)     >>  6 # 4032     = (2^6 - 1) << 6
      d = chunk & 63               # 63       = 2^6 - 1
      return encodings[a] + encodings[b] + encodings[c] + encodings[d]
    
    # Main loop deals with bytes in chunks of 3
    chunks = (get3To4Conversion(i) for i in [0...mainLength] by 3)
    
    # Build string
    base64 = chunks.join('')

    #Deal with the remaining bytes and padding
    if byteRemainder == 1
      chunk = bytes[mainLength]
      a = (chunk & 252) >> 2 # 252 = (2^6 - 1) << 2
      # Set the 4 least significant bits to zero
      b = (chunk & 3)   << 4 # 3   = 2^2 - 1
      base64 += encodings[a] + encodings[b] + '=='
    else if byteRemainder == 2
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
      a = (chunk & 64512) >> 10 # 64512 = (2^6 - 1) << 10
      b = (chunk & 1008)  >>  4 # 1008  = (2^6 - 1) << 4
      #Set the 2 least significant bits to zero
      c = (chunk & 15)    <<  2 # 15    = 2^4 - 1
      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    return base64

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
  @generateGUID:() ->
    id = window.crypto.getRandomValues(new Uint8Array(32))
    id = Helper.arrayBufferToBase64(id)
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

  @base64URLtoBase64:(base64URL) ->
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
