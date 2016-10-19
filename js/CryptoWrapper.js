
/*
Wrapper-Class for Web Crypto API function calls
 */

(function() {
  window.CryptoWrapper = (function() {
    function CryptoWrapper() {}


    /*
    Create a Signature
    input: serialized node
    signatureParams: SignaturParams Object
     */

    CryptoWrapper.Sign = function(input, signatureParams) {
      var buffer;
      buffer = new TextEncoder("utf-8").encode(input);
      return window.crypto.subtle.sign({
        name: signatureParams.signAlg.name,
        hash: {
          name: signatureParams.hash
        }
      }, signatureParams.privateKey, buffer).then(function(signiture) {
        return base64ArrayBuffer(signiture);
      });
    };


    /*
    Signature verification
    input: serialized xml node that has to be verified
    publicKey: verifing key
    signatureParams: SignaturParams Object
     */

    CryptoWrapper.Verify = function(input, publicKey, signatureParams) {
      var buffer, signatureValueBuffer;
      buffer = new TextEncoder("utf-8").encode(input);
      signatureValueBuffer = Helper.base64ToArrayBuffer(signatureParams.signatureValue);
      return window.crypto.subtle.verify({
        name: signatureParams.signAlg.name,
        hash: {
          name: signatureParams.signAlg.name
        }
      }, publicKey, signatureValueBuffer, buffer).then(function(signiture) {
        return signiture;
      });
    };


    /*
    wraps a symmetric key with an asymetric key
    symKey: symmetric key thats gone be wrapped
    asymKey: asymetric key used to wrap the symmetric key
     */

    CryptoWrapper.WrapKey = function(symKey, asymKey) {
      return window.crypto.subtle.wrapKey("raw", symKey, asymKey, {
        name: asymKey.algorithm.name,
        hash: {
          name: asymKey.algorithm.hash.name
        }
      }).then(function(wrappedKey) {
        return base64ArrayBuffer(wrappedKey);
      }).then(null, function(err) {
        return console.error(err);
      });
    };


    /*
    unwraps an wrapped key
    encKey: The wrapped symmetric key
    asymKey: The asymetric key to unwrap the wrapped key
    symKeyAlg: The symetric algorithm belonging to the wrapped key
     */

    CryptoWrapper.UnWrapKey = function(encKey, asymKey, symKeyAlg) {
      encKey = Helper.base64ToArrayBuffer(encKey);
      return window.crypto.subtle.unwrapKey("raw", encKey, asymKey, {
        name: asymKey.algorithm.name,
        hash: {
          name: asymKey.algorithm.hash.name
        }
      }, {
        name: symKeyAlg
      }, false, ["encrypt", "decrypt"]).then(function(key) {
        return key;
      }).then(null, function(err) {
        return console.error(err);
      });
    };


    /*
    Prerforms the AES Encryption
    input: The nodeset to encrypt
    key: The symmetric key
    staticIV: If true, the Encryption Method will use an IV initialsed with "0" instead of an random value. USE ONLY FOR TESTING!
     */

    CryptoWrapper.Encryption = function(input, key, staticIV) {
      var IV, buffer, mode, nodeType;
      mode = key.algorithm.name;
      nodeType = input.nodeType;
      input = new XMLSerializer().serializeToString(input);
      buffer = new TextEncoder("utf-8").encode(input);
      if (mode === "AES-GCM") {
        IV = window.crypto.getRandomValues(new Uint8Array(12));
      } else {
        IV = window.crypto.getRandomValues(new Uint8Array(16));
      }
      if (staticIV) {
        IV = IV.fill(0);
      }
      return window.crypto.subtle.encrypt({
        name: mode,
        iv: IV
      }, key, buffer).then(function(encrypted) {
        var result;
        encrypted = Helper.concatArrayBuffers(IV, encrypted);
        return result = [base64ArrayBuffer(encrypted), nodeType];
      });
    };


    /*
    Method to bypass the Web Crypto / XML Encryption incompatible padding.
    Web Crypto only supports PKCS#7 Padding but XML Encryption expect ISO 10126 Padding.
    This method appends a new padding block with "16" to the chipher text.
    The original ISO 10126 Padding becomes a part of the plaintext and must be removed later.
    buffer: The original buffer with ISO 10126 padding
    key: The encryption key
     */

    CryptoWrapper.AES_ModifyPadding = function(buffer, key) {
      var lastBlock, mode, modifiedPadding, newPadding;
      modifiedPadding = "";
      mode = key.algorithm.name;
      lastBlock = buffer.slice(buffer.byteLength - 16, buffer.byteLength);
      newPadding = new Uint8Array(16);
      newPadding.fill(16);
      return window.crypto.subtle.encrypt({
        name: mode,
        iv: lastBlock
      }, key, newPadding).then(function(newLastBlock) {
        return Helper.concatArrayBuffers(buffer, newLastBlock);
      });
    };


    /*
    decrypt an ciphertext
    input: The ciphertext
    key: The symmetric decryption key
     */

    CryptoWrapper.Decryption = function(input, key) {
      var IV, buffer, mode;
      mode = key.algorithm.name;
      buffer = Helper.base64ToArrayBuffer(input);
      if (mode === "AES-GCM") {
        IV = buffer.slice(0, 12);
        buffer = buffer.slice(12, buffer.byteLength);
      } else {
        IV = buffer.slice(0, 16);
        buffer = buffer.slice(16, buffer.byteLength);
      }
      IV = new Uint8Array(IV);
      if (mode === "AES-CBC") {
        return this.AES_ModifyPadding(buffer, key).then(function(newBuffer) {
          return window.crypto.subtle.decrypt({
            name: mode,
            iv: IV
          }, key, newBuffer).then(function(decrypted) {
            var decryptedArray, padding;
            decrypted = decrypted.slice(0, decrypted.byteLength - 16);
            decryptedArray = new Uint8Array(decrypted);
            padding = decryptedArray[decryptedArray.length - 1];
            if (padding <= 16) {
              decrypted = decrypted.slice(0, decrypted.byteLength - padding);
            }
            return decrypted = String.fromCharCode.apply(null, new Uint8Array(decrypted));
          }).then(null, function(err) {
            return console.error(err);
          });
        });
      } else {
        return window.crypto.subtle.decrypt({
          name: mode,
          iv: IV
        }, key, buffer).then(function(decrypted) {
          return String.fromCharCode.apply(null, new Uint8Array(decrypted));
        }).then(null, function(err) {
          return console.error(err);
        });
      }
    };


    /*
    performs a hash operation
    input: the data to hash
    algorithm: the hash algorithm to use
     */

    CryptoWrapper.hash = function(input, algorithm) {
      var buffer;
      buffer = new TextEncoder("utf-8").encode(input);
      return crypto.subtle.digest(algorithm, buffer).then(function(digest) {
        return base64ArrayBuffer(digest);
      }).then(null, function(err) {
        return err;
      });
    };

    return CryptoWrapper;

  })();

}).call(this);
