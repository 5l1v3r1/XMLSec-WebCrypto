(function() {
  if (window.webcryptoImpl == null) {
    window.webcryptoImpl = window.crypto.subtle;
  }

  window.SignedXML = (function() {
    var buildReferenceList, checkForEnveloped, computeSignature, createKeyInfo, createReference, createReferences, createSignedInfo, loadReference, loadSignature, preserveSignedInfo, validateReferences, validateSignatureValue;

    function SignedXML() {
      var idCount;
      idCount = 0;
    }


    /*
    Computes the Signature and creates the signatureElement
    signedInfo: The signedInfo Element
    signatureParams: The signatureParams object
     */

    computeSignature = function(signedInfo, signatureParams) {
      return new CanonicalXML().canonicalise(signedInfo).then(function(cryptoInput) {
        return CryptoWrapper.Sign(cryptoInput, signatureParams).then(function(signatureValue) {
          return ElementBuilder.buildSignatureElement(signatureParams.prefix, signedInfo, signatureValue);
        });
      });
    };


    /*
    signes the document.
    doc: The xml document to sign
    signatureParams: SignatureParams object with the required information
     */

    SignedXML.prototype.sign = function(doc, signatureParams) {
      var currentPrefix, prefix, signedInfo;
      prefix = signatureParams.prefix;
      if (prefix) {
        currentPrefix = prefix;
      } else {
        currentPrefix = "";
      }
      return signedInfo = createSignedInfo(doc, signatureParams).then(function(signedInfo) {
        return computeSignature(signedInfo, signatureParams).then(function(signature) {
          var signatureElement;
          signatureElement = signature;
          return createKeyInfo(currentPrefix, signatureParams.publicKey).then(function(keyInfo) {
            var wrappingElement;
            if (keyInfo) {
              signatureElement.appendChild(keyInfo);
            }
            if (signatureParams.signatureType === XMLSecEnum.signatureTypesEnum.Enveloped) {
              doc.documentElement.appendChild(signature);
            }
            if (signatureParams.signatureType === XMLSecEnum.signatureTypesEnum.Detached) {
              wrappingElement = ElementBuilder.buildWrappingElement();
              wrappingElement.documentElement.appendChild(doc.children[0]);
              wrappingElement.documentElement.appendChild(signature);
              doc = wrappingElement;
            }

            /*
            if(signatureParams.signatureType == signatureParams.signatureTypesEnum.Enveloping)
              elementBuilder = new ElementBuilder
              signedObject = elementBuilder.buildSignedDataElement(signatureParams.prefix)
              signedObject.documentElement.appendChild(doc.children[0])
              signatureElement.appendChild(keyInfo)
              signatureElement.appendChild(signedObject.children[0])
              doc = signatureElement
             */
            return doc;
          });
        });
      });
    };


    /*
    creates the keyInfo element
    prefix: The prefix to use
    key: The public key
     */

    createKeyInfo = function(prefix, key) {
      var algorithm;
      algorithm = key.algorithm.name;
      return window.webcryptoImpl.exportKey("jwk", key).then(function(exportedKey) {
        var exponent, modulus;
        if (algorithm === XMLSecEnum.WebCryptoAlgMapper.RSASHA1.name) {
          exponent = Helper.base64URLtoBase64(exportedKey.e, exportedKey);
          modulus = Helper.base64URLtoBase64(exportedKey.n, exportKey);
          return ElementBuilder.buildRSAKeyInfoElement(prefix, modulus, exponent);
        }
      });
    };


    /*
    creates the reference elements from the reference objects
    doc: The xml document to sign
    signatureParams: SignatureParams object with the required information
     */

    createReferences = function(doc, signatureParams) {
      var i, ref, referenceList, references;
      references = "";
      referenceList = buildReferenceList(doc, signatureParams);
      return Promise.all((function() {
        var k, ref1, results;
        results = [];
        for (i = k = 0, ref1 = referenceList.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
          ref = referenceList[i];
          results.push(createReference(doc, signatureParams, ref).then(function(reference) {
            return references[i] = reference;
          }));
        }
        return results;
      })()).then(function(references) {
        return references;
      });
    };


    /*
    Expands the refernce list, if one xpath expression returns more then one node.
    In this case the original reference element is removed and for each resulting node there is a own refence object
    doc: The xml document to sign
    signatureParams: SignatureParams object with the required information
     */

    buildReferenceList = function(doc, signatureParams) {
      var i, idBasedXpath, j, k, l, newReferences, nodes, ref, ref1, ref2, reference;
      newReferences = [];
      reference = "";
      for (i = k = 0, ref1 = signatureParams.references.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        ref = signatureParams.references[i];
        nodes = xpath.select(ref.xpath, doc);
        if (nodes.length > 1) {
          for (j = l = 0, ref2 = nodes.length - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; j = 0 <= ref2 ? ++l : --l) {
            idBasedXpath = "//*[@id='" + Helper.ensureHasId(nodes[j]) + "']";
            reference = new Reference(idBasedXpath, ref.transforms, ref.digestAlgURI);
            newReferences.push(reference);
          }
        } else if (nodes.length === 1) {
          idBasedXpath = "//*[@id='" + Helper.ensureHasId(nodes[0]) + "']";
          reference = new Reference(idBasedXpath, ref.transforms, ref.digestAlgURI);
          newReferences.push(ref);
        } else if (node.length === 0) {
          throw new Error("Node not found or invalid xPath:" + ref.xpath);
        }
      }
      return newReferences;
    };


    /*
    Create the reference element
    doc: The xml document to sign
    signatureParams: SignatureParams object with the required information
    ref: The reference object that holds the information for the reference element
     */

    createReference = function(doc, signatureParams, ref) {
      var currentPrefix, i, id, k, nodes, prefix, ref1, transformed;
      prefix = signatureParams.prefix;
      if (prefix) {
        currentPrefix = prefix;
      } else {
        currentPrefix = "";
      }
      nodes = xpath.select(ref.xpath, doc)[0];
      id = Helper.ensureHasId(nodes);
      transformed = nodes;
      for (i = k = 0, ref1 = ref.transforms.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        if (Helper.mapFromURI(ref.transforms[i]) === XMLSecEnum.WebCryptoAlgMapper.envelopedSignature) {

        } else if (Helper.mapFromURI(ref.transforms[i]) === XMLSecEnum.WebCryptoAlgMapper.c14n) {
          return new CanonicalXML().canonicalise(transformed).then(function(transformed) {
            var digestValue;
            return digestValue = CryptoWrapper.hash(transformed, ref.digestAlg).then(function(result) {
              return ElementBuilder.buildReferenceElement(id, signatureParams.prefix, ref.transforms, ref.digestAlgURI, result);
            }).then(null, function(err) {
              return console.log(err);
            });
          });
        } else {
          throw new Error("Algorithm not supported");
        }
      }
    };


    /*
    Creates the SignedInfo element
    doc: The xml document to sign
    signatureParams: SignatureParams object with the required information
     */

    createSignedInfo = function(doc, signatureParams) {
      var references, signatureAlg, signedInfos;
      signatureAlg = signatureParams.signatureAlg;
      signedInfos = [];
      return references = createReferences(doc, signatureParams).then(function(ref) {
        return ElementBuilder.buildSignedInfoElement(signatureParams, ref);
      });
    };


    /*
    Loads the SignatureElement from the document and create a SignatureParams object
    xml: The signed XML Document
    SVR: The SignatureValidationResults Object
     */

    loadSignature = function(xml, SVR) {
      var SignatureElement, i, k, loadedReferences, nodes, ref1, referencesToLoad, signature, signatureNode, test;
      if (typeof xml === 'string') {
        signatureNode = $.parseXML(signatureNode);
      }
      SignatureElement = $(xml).find(XMLSecEnum.NodeNames.signature);
      if (SignatureElement.length > 1) {
        throw new error("More then one Signature Element detected!");
      }
      SVR.setValidatedSignature(SignatureElement);
      signature = new SignatureParams();
      nodes = xpath.select(XMLSecEnum.xPathSelectors.CanonicalisationAlg, xml);
      if (nodes.length === 0) {
        throw new Error("could not find CanonicalizationMethod/@Algorithm element");
      }
      signature.setCanonicalisationAlgFromURI(nodes[0].value);
      signature.setSigAlgFromURI(utils.findFirst(xml, XMLSecEnum.xPathSelectors.SignatureAlg).value);
      loadedReferences = [];
      referencesToLoad = xpath.select(XMLSecEnum.xPathSelectors.References, xml);
      if (referencesToLoad.length === 0) {
        throw new Error("could not find any Reference elements");
      }
      for (i = k = 0, ref1 = referencesToLoad.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        loadedReferences.push(loadReference(referencesToLoad[i]));
      }
      signature.setReferences(loadedReferences);
      signature.setSignatureValue(utils.findFirst(xml, XMLSecEnum.xPathSelectors.SingatureValue).data.replace(/\n/g, ''));
      test = xpath.select(XMLSecEnum.xPathSelectors.Signature, xml)[0];
      test.remove();
      return signature.getSignatureParams();
    };


    /*
    Create reference objects from reference elements
    ref: One reference element
     */

    loadReference = function(ref) {
      var attr, digestAlg, digestAlgo, digestValue, k, nodes, ref1, reference, references, t, transforms, transformsAll, transformsNode;
      attr = utils.findAttr(utils.findChilds(ref, XMLSecEnum.NodeNames.digestMethod)[0], XMLSecEnum.AttributeNames.algorithm);
      if (!attr) {
        throw new Error("could not find Algorithm attribute in node " + digestAlgoNode.toString());
      }
      digestAlgo = attr.value;
      nodes = utils.findChilds(ref, XMLSecEnum.NodeNames.digestValue);
      if (nodes.length === 0) {
        throw new Error("could not find DigestValue node in reference " + ref.toString());
      }
      if (nodes[0].childNodes.length === 0 || !nodes[0].firstChild.data) {
        throw new Error("could not find the value of DigestValue in " + nodes[0].toString());
      }
      digestValue = nodes[0].firstChild.data;
      references = [];
      transforms = [];
      nodes = utils.findChilds(ref, XMLSecEnum.NodeNames.transforms);
      if (nodes.length !== 0) {
        transformsNode = nodes[0];
        transformsAll = utils.findChilds(transformsNode, XMLSecEnum.NodeNames.transform);
        for (t = k = 0, ref1 = transformsAll.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; t = 0 <= ref1 ? ++k : --k) {
          transforms.push(utils.findAttr(transformsAll[t], XMLSecEnum.AttributeNames.algorithm).value);
        }
      }
      digestAlg = Helper.mapFromURI(digestAlgo);
      reference = new Reference(xpath, transforms, digestAlg, utils.findAttr(ref, "URI").value, digestValue);
      return reference;
    };


    /*
    Method called from external to verify a signature Value
    sigXML: Signed Xml document
    publicKey: The verification key
    
    Returns a SignatureValidationResults object with information about errors, validated References an validated signature
     */

    SignedXML.prototype.verify = function(sigXML, publicKey) {

      /*
      if the passed XML is a string, parse it
       */
      var SVR, isEnveloped, signature, signedInfo, xml;
      xml = $.parseXML(sigXML);
      if (!xml) {
        xml = sigXML;
      }
      SVR = new SignatureValidationResults();
      signedInfo = preserveSignedInfo(xml);
      signature = loadSignature(xml, SVR);
      isEnveloped = checkForEnveloped(signature.references, signature.signatureTypesEnum);
      if (isEnveloped === false) {
        xml = xml.children[0].firstChild;
      }
      return validateSignatureValue(signedInfo, publicKey, signature).then(function(verifikationResult) {
        SVR.setResult(verifikationResult[0]);
        SVR.addValidationErrors(verifikationResult[1]);
        return validateReferences(xml, signature.references, 0, []).then(function(referenceValidationResult) {
          SVR.setReferences(referenceValidationResult);
          if (SVR.getValidationErrors().length > 0) {
            SVR.setResult(false);
          } else if (SVR.getResult === true) {
            SVR.setResult(true);
          }
          return SVR.getResults();
        });
      });
    };


    /*
    Checks wether the signature is an enveloped or not by looking at the transformations.
    If it is an enveloped signature there must be an envelopedSignature transformations.
    references: All references form the signed Info
     */

    checkForEnveloped = function(references) {
      var i, isEnveloped, j, k, l, ref1, ref2;
      isEnveloped = false;
      for (i = k = 0, ref1 = references.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        for (j = l = 0, ref2 = references[i].transforms.length - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; j = 0 <= ref2 ? ++l : --l) {
          if (references[i].transforms[j] === XMLSecEnum.AlgIdentifiers.envSig) {
            isEnveloped = true;
          }
        }
      }
      return isEnveloped;
    };


    /*
    Saves the signedInfo Element from the signed xml document
    signedXml : The signed xml document
     */

    preserveSignedInfo = function(signedXml) {
      var signedInfo, xml;
      xml = $(signedXml);
      if (!xml) {
        xml = signedXml;
      }
      signedInfo = $(xpath.select(XMLSecEnum.xPathSelectors.SignedInfo, signedXml));
      return signedInfo[0];
    };


    /*
    Validates the signature value
    signedInfo: The signedInfo element
    publicKey: The verification key
    signature: A signatureParams object
    SVR: The SignatureValidationResults object
     */

    validateSignatureValue = function(signedInfo, publicKey, signature) {
      return new CanonicalXML().canonicalise(signedInfo).then(function(canonXML) {
        return CryptoWrapper.Verify(canonXML, publicKey, signature).then(function(result) {
          var error;
          error = "";
          if (!result) {
            error = "Signature Value is invalid";
          }
          return [result, error];
        });
      });
    };


    /*
    Validates the references reqursive
    doc: The signed xml document
    references : The reference objects
     */

    validateReferences = function(doc, references, i, res) {
      var node, nodes, p, refValRes, transformed, xmlDoc;
      xmlDoc = $(doc);
      refValRes = res;
      if (!references[i].uri || references[i].uri === "/*") {
        node = xmlDoc[0];
      } else {
        nodes = xpath.select("//*[@id='" + references[i].uri.substring(1) + "']", doc);
        if (nodes.length > 1) {
          throw new error("Id is not unique");
        }
        node = nodes[0];
      }
      transformed = node;
      p = new Promise(function(resolve, reject) {
        var k, needWait, ref1, t;
        needWait = false;
        for (t = k = 0, ref1 = references[i].transforms.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; t = 0 <= ref1 ? ++k : --k) {
          if (Helper.mapFromURI(references[i].transforms[t]) === XMLSecEnum.WebCryptoAlgMapper.c14n) {
            needWait = true;
            new CanonicalXML().canonicalise(transformed).then(function(transformed) {
              return resolve(transformed);
            });
          }
        }
        if (!needWait) {
          return resolve(transformed);
        }
      });
      return p.then(function(transformed) {
        var digestValue;
        return digestValue = CryptoWrapper.hash(transformed, references[i].digestAlg).then(function(result) {
          var error;
          error = "";
          if (result !== references[i].digestValue) {
            error = "Reference Validation Error of " + references[i].uri;
          }
          refValRes.push([references[i], transformed, error]);
          if (i < references.length - 1) {
            return validateReferences(doc, references, i + 1, res);
          } else {
            return refValRes;
          }
        });
      });
    };


    /*
    loads the key from the keyInfo element of the signed XML document
    doc: The signedXML document
     */

    SignedXML.prototype.loadKey = function(doc) {
      var exponent, exponentArray, hex, i, k, l, modulus, modulusArray, params, ref1, ref2, xml;
      xml = $.parseXML(doc);
      if (!xml) {
        xml = doc;
      }
      modulus = utils.findFirst(xml, XMLSecEnum.xPathSelectors.Modulus).data;
      exponent = utils.findFirst(xml, XMLSecEnum.xPathSelectors.Exponent).data;
      params = Helper.mapFromURI(utils.findFirst(xml, XMLSecEnum.xPathSelectors.SignatureAlg).value);
      modulusArray = new Uint8Array(Helper.base64ToArrayBuffer(modulus));
      for (i = k = 0, ref1 = modulusArray.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        if (modulusArray[0] === 0) {
          modulusArray = modulusArray.slice(1);
        } else {
          break;
        }
      }
      modulus = Helper.arrayBufferToBase64(modulusArray);
      modulus = Helper.base64ToBase64URL(modulus);
      exponentArray = new Uint8Array(Helper.base64ToArrayBuffer(exponent));
      for (i = l = 0, ref2 = exponentArray.length - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; i = 0 <= ref2 ? ++l : --l) {
        if (exponentArray[0] === 0) {
          hex = exponentArray.slice(1);
        } else {
          break;
        }
      }
      exponent = Helper.arrayBufferToBase64(exponentArray);
      exponent = Helper.base64ToBase64URL(exponent);
      return window.webcryptoImpl.importKey("jwk", {
        kty: params.kty,
        e: exponent,
        n: modulus,
        alg: params.alg,
        ext: true
      }, {
        name: params.name,
        hash: {
          name: params.hash
        }
      }, false, ["verify"]).then(function(key) {
        return key;
      }).then(null, function(err) {
        return console.log(err);
      });
    };

    return SignedXML;

  })();

}).call(this);
