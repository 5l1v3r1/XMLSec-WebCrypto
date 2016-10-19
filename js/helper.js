(function() {
  window.Helper = (function() {
    function Helper() {}


    /*
    Converts a base64 string into an arrayBuffer
    base64: base64 encoded input string
     */

    Helper.base64ToArrayBuffer = function(base64) {
      var binary_string, bytes, i, j, len, ref;
      binary_string = window.atob(base64);
      len = binary_string.length;
      bytes = new Uint8Array(len);
      for (i = j = 0, ref = len - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    };


    /*
    Converts a base64 encoded string into a base64URL string
    data: base64  encoded input string
     */

    Helper.base64ToBase64URL = function(data) {
      data = data.split('=').toString();
      data = data.split('+').join('-').toString();
      data = data.split('/').join('_').toString();
      data = data.split(',').join('').toString();
      data = data.trim();
      return data;
    };


    /*
    Concatinates two arrayBuffers results in buffer1||buffer2
    buffer1: The first Buffer
    buffer2: The second Buffer
     */

    Helper.concatArrayBuffers = function(buffer1, buffer2) {
      var cBuffer;
      cBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
      cBuffer.set(new Uint8Array(buffer1), 0);
      cBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
      return cBuffer.buffer;
    };


    /*
    Gererates a 256 Bit GUID and return it as an base64 encoded string
     */

    Helper.generateGUID = function() {
      var id;
      id = window.crypto.getRandomValues(new Uint8Array(32));
      id = base64ArrayBuffer(id);
      return id = Helper.base64ToBase64URL(id);
    };


    /*
    Gets an identifer from the Mapping enumeration from an passed uri
     */

    Helper.mapFromURI = function(uri) {
      var internalIdentifier, result;
      uri = uri.toLowerCase();
      uri = uri.toLowerCase();
      uri = btoa(uri);
      uri = Helper.base64ToBase64URL(uri);
      internalIdentifier = XMLSecEnum.URIMapper[uri];
      result = XMLSecEnum.WebCryptoAlgMapper[internalIdentifier];
      if (result) {
        return result;
      } else {
        return internalIdentifier;
      }
    };

    Helper.base64URLtoBase64 = function(base64URL) {
      base64URL = base64URL.split('-').join('+').toString();
      base64URL = base64URL.split('_').join('/').toString();
      if (base64URL.length % 4 === 1) {
        base64URL += "=";
      }
      if (base64URL.length % 4 === 2) {
        base64URL += "==";
      }
      return base64URL;
    };


    /*
    Ensures that the actual node has an Id. If not create one
     */

    Helper.ensureHasId = function(node) {
      var attr, i, id, j, ref;
      attr = "";
      if (node.nodeType === 9) {
        node = node.documentElement;
      }
      for (i = j = 0, ref = XMLSecEnum.idAttributes.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        attr = utils.findAttr(node, XMLSecEnum.idAttributes[i]);
        if (attr) {
          break;
        }
      }
      if (attr) {
        return attr.value;
      }
      id = Helper.generateGUID();
      node.setAttribute('ID', id);
      return id;
    };

    return Helper;

  })();

}).call(this);
