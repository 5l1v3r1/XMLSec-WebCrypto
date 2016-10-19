(function() {
  window.Algorithms = (function() {

    /*
    Provides access to the internal identifiers
     */
    Algorithms.EncryptionAlgorithms = {
      AES: {
        CBC: {
          128: "AESCBC128",
          192: "AESCBC192",
          256: "AESCBC256"
        },
        GCM: {
          128: "AESGCM128",
          192: "AESGCM192",
          256: "AESGCM256"
        }
      },
      RSA: {
        OAEP: "RSAOAEP"
      }
    };

    Algorithms.SigningAlgorithms = {
      RSA: {
        SHA1: "RSASHA1"
      },
      HMAC: {
        SHA1: "HMACSHA1"
      }
    };

    Algorithms.DigestAlgorithms = {
      SHA1: "SHA1"
    };

    Algorithms.TransformAlgorithms = {
      C14N: "c14n",
      Enveloped_Signature: "envSig"
    };

    function Algorithms() {}

    return Algorithms;

  })();

}).call(this);
