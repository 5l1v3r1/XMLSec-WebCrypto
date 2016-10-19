(function() {
  window.ElementBuilder = (function() {
    function ElementBuilder() {}


    /*
    Builds an Element for detached signature creation
     */

    ElementBuilder.buildWrappingElement = function() {
      var docType, xmlDoc;
      docType = document.implementation.createDocumentType("Document", "Document", "<!ENTITY Document 'Document'>");
      xmlDoc = document.implementation.createDocument("", "Document", docType);
      return xmlDoc;
    };


    /*
    Builds the KeyInfo Element for RSA Keys
    prefix: The XMLNS prefix
    modulus: The modulus of the RSA Key
    exponent: The public exponent of the RSA Key
     */

    ElementBuilder.buildRSAKeyInfoElement = function(prefix, modulus, exponent) {
      var RSAValueNode, docType, exponentNode, exponenttext, keyInfoNode, keyValueNode, modulusNode, modulustext, xmlDoc;
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "keyInfo", docType);
      keyInfoNode = xmlDoc.createElement(prefix + "KeyInfo");
      keyValueNode = xmlDoc.createElement(prefix + "KeyValue");
      RSAValueNode = xmlDoc.createElement(prefix + "RSAKeyValue");
      modulusNode = xmlDoc.createElement(prefix + "Modulus");
      modulustext = xmlDoc.createTextNode(modulus);
      modulusNode.appendChild(modulustext);
      exponentNode = xmlDoc.createElement(prefix + "Exponent");
      exponenttext = xmlDoc.createTextNode(exponent);
      exponentNode.appendChild(exponenttext);
      RSAValueNode.appendChild(modulusNode);
      RSAValueNode.appendChild(exponentNode);
      keyValueNode.appendChild(RSAValueNode);
      keyInfoNode.appendChild(keyValueNode);
      return xmlDoc.documentElement.appendChild(keyInfoNode);
    };


    /*
    Builds the Signature Element
    prefix: The XMLNS prefix
    signedInfo: The signedInfo Element
    signatureValue: The computed signature value
     */

    ElementBuilder.buildSignatureElement = function(prefix, signedInfo, signatureValue) {
      var docType, signatureNode, signatureValueNode, textnode, xmlDoc, xmlNsAttrPrefix;
      xmlNsAttrPrefix = prefix.replace(":", "");
      if (prefix !== "") {
        xmlNsAttrPrefix = ":" + xmlNsAttrPrefix;
      }
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "signature", docType);
      signatureNode = xmlDoc.createElement(prefix + "Signature");
      signatureNode.setAttribute("xmlns" + xmlNsAttrPrefix, XMLSecEnum.namespaceURIs.xmlSig);
      signatureNode.appendChild(signedInfo);
      signatureValueNode = xmlDoc.createElement(prefix + "SignatureValue");
      textnode = xmlDoc.createTextNode(signatureValue);
      signatureValueNode.appendChild(textnode);
      signatureNode.appendChild(signatureValueNode);
      return xmlDoc.documentElement.appendChild(signatureNode);
    };


    /*
    Builds the signedInfo Element
    signatureParams: The signatureParams object
    refElements: The reference Elements
     */

    ElementBuilder.buildSignedInfoElement = function(signatureParams, refElements) {
      var canonNode, docType, i, j, prefix, ref, signatureMethodeNode, signedInfoNode, xmlDoc, xmlNsAttrPrefix;
      prefix = signatureParams.prefix;
      xmlNsAttrPrefix = prefix.replace(":", "");
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "signedInfo", docType);
      signedInfoNode = xmlDoc.createElementNS(XMLSecEnum.namespaceURIs.xmlSig, prefix + "SignedInfo");
      canonNode = xmlDoc.createElement(prefix + "CanonicalizationMethod");
      canonNode.setAttribute("Algorithm", signatureParams.canonicalisationAlgURI);
      signedInfoNode.appendChild(canonNode);
      signatureMethodeNode = xmlDoc.createElement(prefix + "SignatureMethod");
      signatureMethodeNode.setAttribute("Algorithm", signatureParams.signAlgURI);
      signedInfoNode.appendChild(signatureMethodeNode);
      for (i = j = 0, ref = refElements.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        signedInfoNode.appendChild(refElements[i]);
      }
      return xmlDoc.documentElement.appendChild(signedInfoNode);
    };


    /*
    Builds the Reference Elements
    id: The Id or XPath of the referenced object
    prefix: The XMLNS prefix
    transforms: Array of Transform-URIs
    algorithem: Algorithm URI
    digestValue: The computed DigestValue
    idBase: Flag wether the URI is ID-Based or not
     */

    ElementBuilder.buildReferenceElement = function(id, prefix, transforms, Algorithm, digestValue) {
      var digestMethodNode, digestValueNode, digestValueText, docType, i, j, ref, referenceNode, transformNode, transformsNode, xmlDoc;
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "reference", docType);
      referenceNode = xmlDoc.createElement(prefix + "Reference");

      /*
      Decide whitch URI is uses
       */
      referenceNode.setAttribute("URI", "#" + id);
      transformsNode = xmlDoc.createElement(prefix + "Transforms");
      referenceNode.appendChild(transformsNode);
      for (i = j = 0, ref = transforms.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        transformNode = xmlDoc.createElement(prefix + "Transform");
        transformNode.setAttribute("Algorithm", transforms[i]);
        transformsNode.appendChild(transformNode);
      }
      digestMethodNode = xmlDoc.createElement(prefix + "DigestMethod");
      digestMethodNode.setAttribute("Algorithm", Algorithm);
      referenceNode.appendChild(digestMethodNode);
      digestValueNode = xmlDoc.createElement(prefix + "DigestValue");
      digestValueText = xmlDoc.createTextNode(digestValue);
      digestValueNode.appendChild(digestValueText);
      referenceNode.appendChild(digestValueNode);
      return xmlDoc.documentElement.appendChild(referenceNode);
    };


    /*
    Builds the EncryptedData Element
    typeToEncrypt: Either Content or Element
    chipherValue: The computed chipher value
    encParams: The encParams Object
    encKey (optional): An EncryptedKey element
    encKeyId (optional): The Id of the EncryptedKey element
     */

    ElementBuilder.buildEncryptedDataElement = function(typeToEncrypt, chipherValue, encParams, encKey, encKeyId) {
      var attrNsPrefix, chipherDataNode, chipherValueNode, cipherValueText, createdDoc, docType, encDataNode, encMethodNode, keyInfoNode, keyNameNode, keyNameText, prefix, serializer, xmlDoc, xmlNsAttrKeyInfo;
      prefix = encParams.prefix;
      if (prefix) {
        attrNsPrefix = ":" + prefix.replace(":", "");
        xmlNsAttrKeyInfo = ":" + encParams.keyInfoPrefix.replace(":", "");
      } else {
        prefix = "";
        attrNsPrefix = "";
      }
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "EncData", docType);
      encDataNode = xmlDoc.createElement(prefix + "EncryptedData");
      if (encKeyId) {
        encDataNode.setAttribute("id", encKeyId);
      }
      encDataNode.setAttribute("Type", typeToEncrypt);
      encDataNode.setAttribute("xmlns" + attrNsPrefix, XMLSecEnum.namespaceURIs.xmlEnc);
      encMethodNode = xmlDoc.createElement(prefix + "EncryptionMethod");
      encMethodNode.setAttribute("Algorithm", encParams.algIdentifer);
      encDataNode.appendChild(encMethodNode);
      if (encKey) {
        keyInfoNode = xmlDoc.createElement(encParams.keyInfoPrefix + "KeyInfo");
        keyInfoNode.setAttribute("xmlns" + xmlNsAttrKeyInfo, XMLSecEnum.namespaceURIs.xmlSig);
        keyNameNode = xmlDoc.createElement(encParams.keyInfoPrefix + "KeyName");
        keyNameText = xmlDoc.createTextNode(encParams.asymKeyName);
        keyNameNode.appendChild(keyNameText);
        keyInfoNode.appendChild(keyNameNode);
        keyInfoNode.appendChild(encKey);
        encDataNode.appendChild(keyInfoNode);
      }
      chipherDataNode = xmlDoc.createElement(prefix + "CipherData");
      chipherValueNode = xmlDoc.createElement(prefix + "CipherValue");
      cipherValueText = xmlDoc.createTextNode(chipherValue);
      chipherValueNode.appendChild(cipherValueText);
      chipherDataNode.appendChild(chipherValueNode);
      encDataNode.appendChild(chipherDataNode);
      xmlDoc.documentElement.appendChild(encDataNode);
      serializer = new XMLSerializer;
      return createdDoc = serializer.serializeToString(xmlDoc.documentElement.appendChild(encDataNode));
    };


    /*
    Creates an encryptedKey element
    encParams: The encryptionParams objekt
    cipherValue: The Ciphervalue of the encrypted Key
     */

    ElementBuilder.buildEncryptedKeyElement = function(encParams, chipherValue) {
      var attrNsPrefix, chipherDataNode, chipherValueNode, cipherValueText, docType, encKeyNode, encMethodNode, keyInfoNode, keyNameNode, keyNameText, prefix, xmlDoc, xmlNsAttrPrefix;
      prefix = encParams.keyInfoPrefix;
      if (prefix) {
        xmlNsAttrPrefix = ":" + prefix.replace(":", "");
      } else {
        prefix = "";
        attrNsPrefix = "";
      }
      docType = document.implementation.createDocumentType("dummy", "dummy", "<!ENTITY dummy 'dummy'>");
      xmlDoc = document.implementation.createDocument("", "EncData", docType);
      encKeyNode = xmlDoc.createElement(prefix + "EncryptedKey");
      encMethodNode = xmlDoc.createElement(prefix + "EncryptionMethod");
      encMethodNode.setAttribute("Algorithm", encParams.asymAlgIdentifier);
      encKeyNode.appendChild(encMethodNode);
      keyInfoNode = xmlDoc.createElement(prefix + "KeyInfo");
      keyInfoNode.setAttribute("xmlns" + xmlNsAttrPrefix, XMLSecEnum.namespaceURIs.xmlSig);
      keyNameNode = xmlDoc.createElement(prefix + "KeyName");
      keyNameText = xmlDoc.createTextNode(encParams.asymKeyName);
      keyNameNode.appendChild(keyNameText);
      keyInfoNode.appendChild(keyNameNode);
      encKeyNode.appendChild(keyInfoNode);
      chipherDataNode = xmlDoc.createElement(prefix + "CipherData");
      chipherValueNode = xmlDoc.createElement(prefix + "CipherValue");
      cipherValueText = xmlDoc.createTextNode(chipherValue);
      chipherValueNode.appendChild(cipherValueText);
      encKeyNode.appendChild(chipherValueNode);
      return xmlDoc.documentElement.appendChild(encKeyNode);
    };

    return ElementBuilder;

  })();

}).call(this);
