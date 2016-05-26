(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.factory = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var InclusiveCanonicalisation = require("./lib/algorithm/inclusive-canonicalisation");

var builtIn = {
  algorithms: {
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315": function(options) {
      return new InclusiveCanonicalisation(options);
    },
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments": function(options) {
      options = Object.create(options || null);
      options.includeComments = true;
      return new InclusiveCanonicalisation(options);
    }
  }
};

var CanonicalisationFactory = module.exports = function CanonicalisationFactory() {
  if (!(this instanceof CanonicalisationFactory)) {
    return new CanonicalisationFactory();
  }

  this.algorithms = Object.create(builtIn.algorithms);
};

CanonicalisationFactory.prototype.registerAlgorithm = function registerAlgorithm(uri, implementation) {
  this.algorithms[uri] = implementation;

  return this;
};

CanonicalisationFactory.prototype.getAlgorithm = function getAlgorithm(uri) {
  return this.algorithms[uri];
};

CanonicalisationFactory.prototype.createCanonicaliser = function createCanonicaliser(uri, options) {
  return this.algorithms[uri](options);
};

},{"./lib/algorithm/exclusive-canonicalisation":3}],2:[function(require,module,exports){
var Algorithm = module.exports = function Algorithm(options) {
};

Algorithm.prototype.name = function name() {
  return null;
};

Algorithm.prototype.canonicalise = function canonicalise(node, cb) {
  setImmediate(function() {
    return cb(Error("not implemented"));
  });
};

},{}],3:[function(require,module,exports){
var escape = require("./lib/escape");

var Algorithm = require("./lib/algorithm");

var InclusiveCanonicalisation = module.exports = function InclusiveCanonicalisation(options) {
  Algorithm.call(this, options);

  options = options || {};

  this.includeComments = !!options.includeComments;
  this.inclusiveNamespaces = options.inclusiveNamespaces || [];
};
InclusiveCanonicalisation.prototype = Object.create(Algorithm.prototype, {constructor: {value: InclusiveCanonicalisation}});

InclusiveCanonicalisation.prototype.name = function name() {
  return "http://www.w3.org/TR/2001/REC-xml-c14n-20010315" + (this.includeComments ? "WithComments" : "");
};

InclusiveCanonicalisation.prototype.canonicalise = function canonicalise(node) {
  var namespacesMap = {}
  namespacesMap["xmlns"] = ""; // special for ignoring empty default namespace in apex nodes
  var res = this._processInner(node,namespacesMap);
  return res;
  //return cb(null, res);


};

InclusiveCanonicalisation.prototype.getIncludeComments = function getIncludeComments() {
  return !!this.includeComments;
};

InclusiveCanonicalisation.prototype.setIncludeComments = function setIncludeComments(includeComments) {
  this.includeComments = !!includeComments;
};

InclusiveCanonicalisation.prototype.getInclusiveNamespaces = function getInclusiveNamespaces() {
  return this.inclusiveNamespaces.slice();
};

InclusiveCanonicalisation.prototype.setInclusiveNamespaces = function setInclusiveNamespaces(inclusiveNamespaces) {
  this.inclusiveNamespaces = inclusiveNamespaces.slice();

  return this;
};

InclusiveCanonicalisation.prototype.addInclusiveNamespace = function addInclusiveNamespace(inclusiveNamespace) {
  this.inclusiveNamespaces.push(inclusiveNamespace);

  return this;
};

var _compareAttributes = function _compareAttributes(a, b) {

  if (!a.prefix && b.prefix) {
    return -1;
  }

  if (!b.prefix && a.prefix) {
    return 1;
  }
  var attr1 = a.namespaceURI+a.name,
      attr2  = b.namespaceURI+b.name;
  return attr1.localeCompare(attr2);
  //return a.name.localeCompare(b.name);
};

var _compareNamespaces = function _compareNamespaces(a, b) {

   if(a.isDefault && !b.isDefault) return -1;
   if(!a.isDefault && b.isDefault) return 1;


   var attr1 = a.prefix + a.namespaceURI,
      attr2 = b.prefix + b.namespaceURI;


  //if (attr1 === attr2) {
  //  return 0;
 // }

  return attr1.localeCompare(attr2);
};

InclusiveCanonicalisation.prototype._renderAttributes = function _renderAttributes(node) {
  return (node.attributes ? [].slice.call(node.attributes) : []).filter(function(attribute) {
    return attribute.name.indexOf("xmlns") !== 0;
  }).sort(_compareAttributes).map(function(attribute) {
    return " " + attribute.name + "=\"" + escape.attributeEntities(attribute.value) + "\"";
  }).join("");
};

InclusiveCanonicalisation.prototype._renderNamespace = function _renderNamespace(node, namespacesMap) {
  var res = "", newNamespacesMap={},nsListToRender = [];
  for(var key in namespacesMap){
     if(namespacesMap.hasOwnProperty(key)) {
         newNamespacesMap[key] = namespacesMap[key];
     }
  }

  if (node.attributes) {

    for (var i=0;i<node.attributes.length;i++) {

        var attr = node.attributes[i];
        var ns=false;
        var isDefault;

        if (attr.prefix && attr.prefix === "xmlns") {
            key = attr.prefix+attr.localName;
            isDefault = false;
            ns=true;
        }
        if (attr.localName && attr.localName === "xmlns") {
            key = attr.localName;
            isDefault = true;
            ns=true;
        }
        if(ns == true) {
            var pushNS;
            if (newNamespacesMap.hasOwnProperty(key)) {
                if (newNamespacesMap[key] !== attr.nodeValue) {
                    pushNS = true;
                    newNamespacesMap[key] = attr.nodeValue;
                } else {
                    pushNS = false;
                }
            } else {
                pushNS = true;
                newNamespacesMap[key] = attr.nodeValue;
            }

            if (pushNS == true) {
                nsListToRender.push({
                    prefix: attr.localName,
                    namespaceURI: attr.nodeValue,
                    isDefault: isDefault
                });
            }
        }
    }
  }

  nsListToRender.sort(_compareNamespaces);

  for (var i=0;i<nsListToRender.length;++i) {
      if(nsListToRender[i].isDefault)
      res += " " + nsListToRender[i].prefix + "=\"" + escape.attributeEntities(nsListToRender[i].namespaceURI) + "\"";
      else  res += " xmlns:" + nsListToRender[i].prefix + "=\"" + escape.attributeEntities(nsListToRender[i].namespaceURI) + "\"";
  }

  return {
    rendered: res,
    newNamespacesMap: newNamespacesMap
  };
};

InclusiveCanonicalisation.prototype._renderComment = function _renderComment(node) {
  var isOutsideDocument = (node.ownerDocument === node.parentNode),
      isBeforeDocument = null,
      isAfterDocument = null;

  if (isOutsideDocument) {
    var nextNode = node,
        previousNode = node;

    while (nextNode !== null) {
      if (nextNode === node.ownerDocument.documentElement) {
        isBeforeDocument = true;
        break;
      }

      nextNode = nextNode.nextSibling;
    }

    while (previousNode !== null) {
      if (previousNode === node.ownerDocument.documentElement) {
        isAfterDocument = true;
        break;
      }

      previousNode = previousNode.previousSibling;
    }
  }

  return (isAfterDocument ? "\n" : "") + "<!--" + escape.textEntities(node.data) + "-->" + (isBeforeDocument ? "\n" : "");
};

InclusiveCanonicalisation.prototype._renderProcessingInstruction = function _renderProcessingInstruction(node) {
  if (node.tagName === "xml") {
    return "";
  }

  var isOutsideDocument = (node.ownerDocument === node.parentNode),
      isBeforeDocument = null,
      isAfterDocument = null;

  if (isOutsideDocument) {
    var nextNode = node,
        previousNode = node;

    while (nextNode !== null) {
      if (nextNode === node.ownerDocument.documentElement) {
        isBeforeDocument = true;
        break;
      }

      nextNode = nextNode.nextSibling;
    }

    while (previousNode !== null) {
      if (previousNode === node.ownerDocument.documentElement) {
        isAfterDocument = true;
        break;
      }

      previousNode = previousNode.previousSibling;
    }
  }

  return (isAfterDocument ? "\n" : "") + "<?" + node.tagName + (node.data ? " " + escape.textEntities(node.data) : "") + "?>" + (isBeforeDocument ? "\n" : "");
};

InclusiveCanonicalisation.prototype._processInner = function _processInner(node, namespacesMap) {


  if (node.nodeType === 3) {
    return (node.ownerDocument === node.parentNode) ? escape.textEntities(node.data.trim()) : escape.textEntities(node.data);
  }

  if (node.nodeType === 7) {
    return this._renderProcessingInstruction(node);
  }

  if (node.nodeType === 8) {
    return this.includeComments ? this._renderComment(node) : "";
  }

  if (node.nodeType === 10) {
    return "";
  }

  var ns = this._renderNamespace(node, namespacesMap);

  var self = this;

  return [
    node.tagName ? "<" + node.tagName + ns.rendered + this._renderAttributes(node) + ">" : "",
    [].slice.call(node.childNodes).map(function(child) {
      return self._processInner(child, ns.newNamespacesMap);
    }).join(""),
    node.tagName ? "</" + node.tagName + ">" : ""
  ].join("");
};

},{"../algorithm":2,"../escape":4}],4:[function(require,module,exports){
var entities = exports.entities = {
  "&":  "&amp;",
  "\"": "&quot;",
  "<":  "&lt;",
  ">":  "&gt;",
  "\t": "&#x9;",
  "\n": "&#xA;",
  "\r": "&#xD;"
};

var attributeEntities = exports.attributeEntities = function escapeAttributeEntities(string) {
  return string.replace(/([\&<"\t\n\r])/g, function(character) {
    return entities[character];
  });
};

var textEntities = exports.textEntities = function escapeTextEntities(string) {
  return string.replace(/([\&<>\r])/g, function(character) {
    return entities[character];
  });
};

},{}]},{},[1])(1)
});
