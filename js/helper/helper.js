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
    Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    use window.btoa' step. Adapted from http://jsperf.com/encoding-xhr-image-data/5
     */

    Helper.arrayBufferToBase64 = function(arrayBuffer) {
      var a, b, base64, byteLength, byteRemainder, bytes, c, chunk, chunks, encodings, get3To4Conversion, i, mainLength;
      encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      bytes = new Uint8Array(arrayBuffer);
      byteLength = bytes.byteLength;
      byteRemainder = byteLength % 3;
      mainLength = byteLength - byteRemainder;
      get3To4Conversion = function(i) {
        var a, b, c, chunk, d;
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        a = (chunk & 16515072) >> 18;
        b = (chunk & 258048) >> 12;
        c = (chunk & 4032) >> 6;
        d = chunk & 63;
        return encodings[a] + encodings[b] + encodings[c] + encodings[d];
      };
      chunks = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = mainLength; j < ref; i = j += 3) {
          results.push(get3To4Conversion(i));
        }
        return results;
      })();
      base64 = chunks.join('');
      if (byteRemainder === 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2;
        b = (chunk & 3) << 4;
        base64 += encodings[a] + encodings[b] + '==';
      } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10;
        b = (chunk & 1008) >> 4;
        c = (chunk & 15) << 2;
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
      }
      return base64;
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
      id = Helper.arrayBufferToBase64(id);
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
