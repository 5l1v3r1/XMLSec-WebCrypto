(function() {
  window.SignatureParams = (function() {
    SignatureParams.signAlg = "";

    SignatureParams.signAlgURI = "";

    SignatureParams.references = [];

    SignatureParams.publicKey = "";

    SignatureParams.privateKey = "";

    SignatureParams.prefix = "";

    SignatureParams.canonicalisationAlgURI = "";

    SignatureParams.canonicalisationAlg = "";

    SignatureParams.signatureValue = "";

    SignatureParams.signatureType = "";


    /*
    Creates the SignatureParams object and sets the prefix to "" for the case, that the prefix stays unset
     */

    function SignatureParams() {
      this.prefix = "";
    }


    /*
    Sets the variable for the Canonicalisation Algorithmus for the URI and the intern use
     */

    SignatureParams.prototype.setCanonicalisationAlg = function(canonAlg) {
      this.canonicalisationAlgURI = XMLSecEnum.AlgIdentifiers[canonAlg];
      this.canonicalisationAlg = XMLSecEnum.WebCryptoAlgMapper[canonAlg];
      if (!this.canonicalisationAlg || this.canonicalisationAlg === "") {
        throw new Error("Algorithm not supported:" + canonicalisationAlg);
      }
    };


    /*
    Sets the prefix and append ":"
     */

    SignatureParams.prototype.setPrefix = function(prefix) {
      if (prefix !== "") {
        if (prefix.indexOf(":") === -1) {
          return this.prefix = prefix + ":";
        } else {
          return this.prefix = prefix;
        }
      }
    };


    /*
    Sets the signature Algorithm variable for URI an internal use
     */

    SignatureParams.prototype.setSigAlg = function(signAlg) {
      this.signAlgURI = XMLSecEnum.AlgIdentifiers[signAlg];
      this.signAlg = XMLSecEnum.WebCryptoAlgMapper[signAlg];
      if (!this.signAlg || this.signAlg === "") {
        throw new Error("Algorithm not supported:" + signAlg);
      }
    };


    /*
    Opatain the Algorithm from a passed URI and sets map it to the internal identifier
     */

    SignatureParams.prototype.setSigAlgFromURI = function(signAlg) {
      this.signAlgURI = signAlg;
      this.signAlg = Helper.mapFromURI(signAlg);
      if (!this.signAlg || this.signAlg === "") {
        throw new Error("Algorithm not supported:" + signAlg);
      }
    };

    SignatureParams.prototype.setCanonicalisationAlgFromURI = function(canonAlg) {
      this.canonicalisationAlgURI = canonAlg;
      this.canonicalisationAlg = Helper.mapFromURI(canonAlg);
      if (!this.canonicalisationAlg || this.canonicalisationAlg === "") {
        throw new Error("Algorithm not supported:" + canonAlg);
      }
    };


    /*
    Sets the reference objects an add the enveloped Signature transformation if nessesary
     */

    SignatureParams.prototype.setReferences = function(references) {
      var i, j, ref, results;
      this.references = references;
      if (this.signatureType === XMLSecEnum.signatureTypesEnum.Enveloped) {
        if (references) {
          results = [];
          for (i = j = 0, ref = this.references.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            results.push(this.references[i].setEnvelopedSignatureTransform());
          }
          return results;
        }
      }
    };


    /*
    Sets the public and private key variables
     */

    SignatureParams.prototype.setKeyPair = function(publicKey, privateKey) {
      this.publicKey = publicKey;
      this.privateKey = privateKey;
      if (!this.publicKey || !this.privateKey) {
        throw new Error("No key");
      }
    };


    /*
    Sets the SignatureValue varibale
     */

    SignatureParams.prototype.setSignatureValue = function(signatureValue) {
      return this.signatureValue = signatureValue;
    };


    /*
    Sets the SignatureType and add the envelopedSignature transformation to each reference if nessesary
     */

    SignatureParams.prototype.setSignatureType = function(signatureType) {
      var i, j, ref, results;
      this.signatureType = signatureType;
      if (signatureType === XMLSecEnum.signatureTypesEnum.Enveloped) {
        if (this.references) {
          results = [];
          for (i = j = 0, ref = this.references.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            results.push(this.references[i].setEnvelopedSignatureTransform());
          }
          return results;
        }
      }
    };


    /*
    Returns an object wit all information for signature generation
     */

    SignatureParams.prototype.getSignatureParams = function() {
      var signatureParams;
      return signatureParams = {
        signAlgURI: this.signAlgURI,
        signAlg: this.signAlg,
        references: this.references,
        privateKey: this.privateKey,
        publicKey: this.publicKey,
        prefix: this.prefix,
        canonicalisationAlg: this.canonicalisationAlg,
        canonicalisationAlgURI: this.canonicalisationAlgURI,
        signatureValue: this.signatureValue,
        signatureType: this.signatureType
      };
    };

    return SignatureParams;

  })();

}).call(this);
