(function() {
  window.Reference = (function() {
    var sortTransForEnvSig, sortTransForc14n;

    Reference.prototype.xpath = "";

    Reference.prototype.transforms = [];

    Reference.prototype.digestAlg = "";

    Reference.prototype.digestAlgURI = "";

    Reference.prototype.uri = "";

    Reference.prototype.digestValue = "";

    Reference.prototype.isEmptyUri = "";


    /*
    Erzeugung des Referenzobjektes für die Signaturerstellung
     */

    function Reference(xpath, transforms1, digestAlg, uri, digestValue) {
      var i, j, ref;
      this.xpath = xpath;
      this.transforms = transforms1;
      this.digestAlg = digestAlg;
      this.uri = uri;
      this.digestValue = digestValue;
      if (this.xpath === "/*" || this.xpath === "") {
        this.xpath = "/*";
        this.isEmptyUri = true;
      } else {
        this.isEmptyUri = false;
      }
      if (this.transforms) {
        for (i = j = 0, ref = this.transforms.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (this.transforms[i].indexOf("http") > -1) {
            this.transforms[i] = this.transforms[i];
          } else if (XMLSecEnum.AlgIdentifiers[this.transforms[i]]) {
            this.transforms[i] = XMLSecEnum.AlgIdentifiers[this.transforms[i]];
          } else {
            throw new Error("Algorithm not Supported:" + this.transforms[i]);
          }
        }
        this.transforms = sortTransForc14n(this.transforms);
      }
      if (this.digestAlg) {
        if (this.digestAlg.indexOf("http") > -1) {
          this.digestAlgURI = this.digestAlg;
          this.digestAlg = Helper.mapFromURI(this.digestAlg);
        } else if (XMLSecEnum.AlgIdentifiers[this.digestAlg.toUpperCase()]) {
          this.digestAlgURI = XMLSecEnum.AlgIdentifiers[this.digestAlg.toUpperCase()];
          this.digestAlg = XMLSecEnum.WebCryptoAlgMapper[this.digestAlg.toUpperCase()];
        }
      }
      new Error("Algorithm not Supported:" + this.digestAlg);
    }


    /*
    If the signatureType is "enveloped", then the enveloped signature transformation is set
     */

    Reference.prototype.setEnvelopedSignatureTransform = function() {
      var hasEnvelopedTransform, i, j, ref;
      hasEnvelopedTransform = false;
      if (this.transforms) {
        for (i = j = 0, ref = this.transforms.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (XMLSecEnum.AlgIdentifiers[this.transforms[i]] === XMLSecEnum.AlgIdentifiers.envSig || this.transforms[i] === XMLSecEnum.AlgIdentifiers.envSig) {
            hasEnvelopedTransform = true;
            break;
          }
        }
      }
      if (hasEnvelopedTransform === false) {
        this.transforms[this.transforms.length] = XMLSecEnum.AlgIdentifiers.envSig;
      }
      return this.transforms = sortTransForEnvSig(this.transforms);
    };


    /*
    Puts the envelopedSignature transformation at the top of the list.
     */

    sortTransForEnvSig = function(transforms) {
      var i, j, ref, sortedTransforms;
      sortedTransforms = [];
      sortedTransforms.push(XMLSecEnum.AlgIdentifiers.envSig);
      for (i = j = 0, ref = transforms.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (transforms[i] !== XMLSecEnum.AlgIdentifiers.envSig) {
          sortedTransforms.push(transforms[i]);
        }
      }
      return this.transforms = sortedTransforms;
    };


    /*
    Puts the c14m transformation at the end of the list. since the CanonicalXML is serialized.
     */

    sortTransForc14n = function(transforms) {
      var i, j, ref, sortedTransforms;
      sortedTransforms = [];
      for (i = j = 0, ref = transforms.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (transforms[i] !== XMLSecEnum.AlgIdentifiers.c14n) {
          sortedTransforms.push(transforms[i]);
        }
      }
      sortedTransforms.push(XMLSecEnum.AlgIdentifiers.c14n);
      return this.transforms = sortedTransforms;
    };

    return Reference;

  })();

}).call(this);
