(function() {
  window.EncryptedXML = (function() {
    var createEncryptedData, decryptRecursive, unwrapKey;

    function EncryptedXML() {}


    /*
    Performs the encryption of a XML Document
    doc: XML Document to encrypt
    encParams: The EncryptionParams object
     */

    EncryptedXML.prototype.encrypt = function(doc, encParams) {
      var encryptedDataNodes, i, j, k, l, m, nodelist, nodes, ref, ref1;
      encryptedDataNodes = [];
      nodes = [];
      nodelist = [];
      for (j = l = 0, ref = encParams.references.length - 1; 0 <= ref ? l <= ref : l >= ref; j = 0 <= ref ? ++l : --l) {
        nodes[j] = xpath.select(encParams.references[j].xpath, doc);
        if (nodes[j].length === 0) {
          throw new Error("Node not found or invalid xPath:" + encParams.references[j].xpath);
        }
        for (k = m = 0, ref1 = nodes[j].length - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; k = 0 <= ref1 ? ++m : --m) {
          nodelist.push(nodes[j][k]);
        }
      }
      return Promise.all((function() {
        var n, ref2, results;
        results = [];
        for (i = n = 0, ref2 = nodelist.length - 1; 0 <= ref2 ? n <= ref2 : n >= ref2; i = 0 <= ref2 ? ++n : --n) {
          results.push(CryptoWrapper.Encryption(nodelist[i], encParams.symKey, encParams.staticIV).then(function(cipherValue) {
            var encData, encKeyid;
            if (encParams.withKeyInfo) {
              encKeyid = "Id_" + encParams.asymKeyName + "_" + Helper.generateGUID();
              return encData = createEncryptedData(cipherValue[0], cipherValue[1], encParams, encKeyid).then(function(result) {
                encData = utils.parseXML(result);
                return encryptedDataNodes.push([encData, encParams.keyName]);
              });
            } else {
              encData = createEncryptedData(cipherValue[0], cipherValue[1], encParams, encKeyid);
              encData = utils.parseXML(encData);
              return encryptedDataNodes.push([encData, ""]);
            }
          }));
        }
        return results;
      })()).then(function() {
        var i, n, ref2;
        for (i = n = 0, ref2 = encryptedDataNodes.length - 1; 0 <= ref2 ? n <= ref2 : n >= ref2; i = 0 <= ref2 ? ++n : --n) {
          nodelist[i].parentNode.replaceChild(encryptedDataNodes[i][0].firstChild, nodelist[i]);
        }
        return doc;
      });
    };


    /*
    creates the encryptedData element
    cipherValue: The CipherValue of the node
    nodeType: Content or element
    encParams: The EncryptionParams object
    id (optional) : The id used if an encryptedKey is uses
     */

    createEncryptedData = function(cipherValue, nodeType, encParams, id) {
      var encDataElement, typeToEncrypt;
      if (nodeType === 3) {
        typeToEncrypt = XMLSecEnum.namespaceURIs.xmlEnc + XMLSecEnum.Type.Content;
      } else {
        typeToEncrypt = XMLSecEnum.namespaceURIs.xmlEnc + XMLSecEnum.Type.Element;
      }
      if (encParams.withKeyInfo) {
        return CryptoWrapper.WrapKey(encParams.symKey, encParams.asymKey).then(function(encKey) {
          var encDataElement, encKeyEle;
          encKeyEle = ElementBuilder.buildEncryptedKeyElement(encParams, encKey);
          return encDataElement = ElementBuilder.buildEncryptedDataElement(typeToEncrypt, cipherValue, encParams, encKeyEle, id);
        });
      } else {
        return encDataElement = ElementBuilder.buildEncryptedDataElement(typeToEncrypt, cipherValue, encParams);
      }
    };


    /*
    Unwraps the encypted key
    encData: one encryptedData element
    asymKey: an assymertric key used for unwrap the symmetric key
     */

    unwrapKey = function(encData, asymKey) {
      var algId, algorithmURI, encKey, encKeyEle;
      algorithmURI = encData.getElementsByTagName(XMLSecEnum.NodeNames.encMethod)[0].getAttribute(XMLSecEnum.AttributeNames.algorithm);
      algId = Helper.mapFromURI(algorithmURI);
      encKeyEle = encData.getElementsByTagName(XMLSecEnum.NodeNames.encKey)[0];
      encKey = encKeyEle.getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML;
      encKeyEle.parentNode.removeChild(encKeyEle);
      return CryptoWrapper.UnWrapKey(encKey, asymKey, algId.toUpperCase()).then(function(symKey) {
        return symKey;
      });
    };


    /*
    Decrypts alle encryptedData nodes recursivly to map the right ElementType to the corrosponding Element
    encData: A list of encryptedData Elements
    key: A WebCryptoApi key object either simmertic or asymmetric
    decryptedNode: the already decrypted nodes
    index: The index of the actual processed encryptedData node
     */

    decryptRecursive = function(encData, key, decryptedNodes, index) {
      var chipherValue, type;
      type = Helper.mapFromURI(encData[index].getAttribute(XMLSecEnum.AttributeNames.type));
      if (key.type === XMLSecEnum.KeyTypes.Private) {
        return unwrapKey(encData[index], key).then(function(symKey) {
          var chipherValue;
          chipherValue = encData[index].getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML;
          return CryptoWrapper.Decryption(chipherValue, symKey).then(function(decrypted) {
            decryptedNodes.push([decrypted, type]);
            if (index < encData.length - 1) {
              return decryptRecursive(encData, key, decryptedNodes, index + 1);
            }
          });
        });
      } else if (key.type === XMLSecEnum.KeyTypes.Secret) {
        chipherValue = encData[index].getElementsByTagName(XMLSecEnum.NodeNames.cipherValue)[0].innerHTML;
        return CryptoWrapper.Decryption(chipherValue, key).then(function(decrypted) {
          decryptedNodes.push([decrypted, type]);
          if (index < encData.length - 1) {
            return decryptRecursive(encData, key, decryptedNodes, index + 1);
          }
        });
      }
    };

    EncryptedXML.prototype.decrypt = function(doc, key) {
      var decryptedNodes, encData;
      decryptedNodes = [];
      encData = xpath.select(XMLSecEnum.xPathSelectors.EncryptedData, doc);
      if (encData.length === 0) {
        throw new Error("No encData found");
      }
      return decryptRecursive(encData, key, decryptedNodes, 0).then(function() {
        var i, l, parentNode, ref;
        for (i = l = 0, ref = decryptedNodes.length - 1; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
          if (decryptedNodes[i][1] === XMLSecEnum.Type.Element) {
            encData[i].parentNode.replaceChild(utils.parseXML(decryptedNodes[i][0]).firstChild, encData[i]);
          } else {
            parentNode = encData[i].parentNode;
            encData[i].parentNode.removeChild(encData[i].parentNode.firstChild);
            parentNode.innerHTML = decryptedNodes[i][0];
          }
        }
        return doc;
      });
    };

    return EncryptedXML;

  })();

}).call(this);
