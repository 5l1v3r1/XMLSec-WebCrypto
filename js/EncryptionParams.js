
/*
Class as Container for all required Parameters for Encryption
 */

(function() {
  window.EncryptionParams = (function() {
    EncryptionParams.symKey = "";

    EncryptionParams.asymKey = "";

    EncryptionParams.asymKeyName = "";

    EncryptionParams.withKeyInfo = "";

    EncryptionParams.staticIV = false;

    EncryptionParams.prefix = "";

    EncryptionParams.references = "";

    EncryptionParams.algIdentifer = "";

    EncryptionParams.asymAlgIdentifier = "";

    EncryptionParams.keyLength = "";

    EncryptionParams.keyInfoPrefix = "";


    /*
     */

    function EncryptionParams() {
      this.staticIV = false;
    }


    /*
    Sets the symmetric key objekt and selects the Algorithm URI with the information from the key
     */

    EncryptionParams.prototype.setSymmetricKey = function(symKey) {
      if (symKey) {
        this.symKey = symKey;
        this.algIdentifer = XMLSecEnum.AlgIdentifiers[symKey.algorithm.name.replace("-", "") + symKey.algorithm.length];
        this.keyLength = symKey.algorithm.length;
        if (!this.algIdentifer || this.algIdentifer === "") {
          throw new Error("Algorithm not supported:" + algIdentifer);
        }
      }
      return this.symKey;
    };


    /*
    Sets the public key for the keywrapping within the encryption. The name can be choosen. Sets furthermore the URI.
     */

    EncryptionParams.prototype.setPublicKey = function(publicKey, keyName) {
      if (publicKey) {
        this.asymKey = publicKey;
        this.withKeyInfo = true;
        this.asymKeyName = keyName;
        this.asymAlgIdentifier = XMLSecEnum.AlgIdentifiers[publicKey.algorithm.name.replace("-", "")];
        if (!this.asymAlgIdentifier || this.asymAlgIdentifier === "") {
          throw new Error("Algorithm not supported:" + asymAlgIdentifier);
        }
      }
      return this.asymKey;
    };


    /*
    Sets the prefix for the xml elements. The prefix is optional
     */

    EncryptionParams.prototype.setPrefix = function(prefix) {
      if (prefix !== "") {
        if (prefix.indexOf(":") === -1) {
          return this.prefix = prefix + ":";
        } else {
          return this.prefix = prefix;
        }
      }
    };


    /*
    Sets the prefix for the xml elements. The prefix is optional
     */

    EncryptionParams.prototype.setKeyInfoPrefix = function(prefix) {
      if (prefix !== "") {
        if (prefix.indexOf(":") === -1) {
          return this.keyInfoPrefix = prefix + ":";
        } else {
          return this.keyInfoPrefix = prefix;
        }
      }
    };


    /*
    Forces a static IV. USE ONLY FOR TESTING
     */

    EncryptionParams.prototype.setStaticIV = function(staticIV) {
      return this.staticIV = staticIV;
    };


    /*
    Sets the References
     */

    EncryptionParams.prototype.setReferences = function(references) {
      return this.references = references;
    };


    /*
    creates an object containig all relevant infomation
     */

    EncryptionParams.prototype.getEncryptionInfo = function() {
      var encryptionInfo;
      return encryptionInfo = {
        symKey: this.symKey,
        keyLength: this.keyLength,
        asymKey: this.asymKey,
        asymKeyName: this.asymKeyName,
        withKeyInfo: this.withKeyInfo,
        staticIV: this.staticIV,
        prefix: this.prefix,
        references: this.references,
        algIdentifer: this.algIdentifer,
        asymAlgIdentifier: this.asymAlgIdentifier,
        keyInfoPrefix: this.keyInfoPrefix
      };
    };

    return EncryptionParams;

  })();

}).call(this);
