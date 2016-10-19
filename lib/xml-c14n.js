(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ExclusiveCanonicalisation = require("./lib/algorithm/exclusive-canonicalisation");

var builtIn = {
  algorithms: {
    "http://www.w3.org/2001/10/xml-exc-c14n#": function(options) {
      return new ExclusiveCanonicalisation(options);
    },
    "http://www.w3.org/2001/10/xml-exc-c14n#WithComments": function(options) {
      options = Object.create(options || null);
      options.includeComments = true;
      return new ExclusiveCanonicalisation(options);
    },
  },
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
var escape = require("../escape");

var Algorithm = require("../algorithm");

var ExclusiveCanonicalisation = module.exports = function ExclusiveCanonicalisation(options) {
  Algorithm.call(this, options);

  options = options || {};

  this.includeComments = !!options.includeComments;
  this.inclusiveNamespaces = options.inclusiveNamespaces || [];
};
ExclusiveCanonicalisation.prototype = Object.create(Algorithm.prototype, {constructor: {value: ExclusiveCanonicalisation}});

ExclusiveCanonicalisation.prototype.name = function name() {
  return "http://www.w3.org/2001/10/xml-exc-c14n#" + (this.includeComments ? "WithComments" : "");
};

ExclusiveCanonicalisation.prototype.canonicalise = function canonicalise(node, cb) {
  var self = this;

  // ensure asynchronicity
  setImmediate(function() {
    try {
      var res = self._processInner(node);
    } catch (e) {
      return cb(e);
    }

    return cb(null, res);
  });
};

ExclusiveCanonicalisation.prototype.getIncludeComments = function getIncludeComments() {
  return !!this.includeComments;
};

ExclusiveCanonicalisation.prototype.setIncludeComments = function setIncludeComments(includeComments) {
  this.includeComments = !!includeComments;
};

ExclusiveCanonicalisation.prototype.getInclusiveNamespaces = function getInclusiveNamespaces() {
  return this.inclusiveNamespaces.slice();
};

ExclusiveCanonicalisation.prototype.setInclusiveNamespaces = function setInclusiveNamespaces(inclusiveNamespaces) {
  this.inclusiveNamespaces = inclusiveNamespaces.slice();

  return this;
};

ExclusiveCanonicalisation.prototype.addInclusiveNamespace = function addInclusiveNamespace(inclusiveNamespace) {
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

  return a.name.localeCompare(b.name);
};

var _compareNamespaces = function _compareNamespaces(a, b) {
  var attr1 = a.prefix + a.namespaceURI,
      attr2 = b.prefix + b.namespaceURI;

  if (attr1 === attr2) {
    return 0;
  }

  return attr1.localeCompare(attr2);
};

ExclusiveCanonicalisation.prototype._renderAttributes = function _renderAttributes(node) {
  return (node.attributes ? [].slice.call(node.attributes) : []).filter(function(attribute) {
    return attribute.name.indexOf("xmlns") !== 0;
  }).sort(_compareAttributes).map(function(attribute) {
    return " " + attribute.name + "=\"" + escape.attributeEntities(attribute.value) + "\"";
  }).join("");
};

ExclusiveCanonicalisation.prototype._renderNamespace = function _renderNamespace(node, prefixesInScope, defaultNamespace) {
  var res = "",
      newDefaultNamespace = defaultNamespace,
      newPrefixesInScope = prefixesInScope.slice(),
      nsListToRender = [];

  var currentNamespace = node.namespaceURI || "";

  if (node.prefix) {
    var foundPrefix = newPrefixesInScope.filter(function(e) {
      return e.prefix === node.prefix;
    }).shift();

    if (foundPrefix && foundPrefix.namespaceURI !== node.namespaceURI) {
      for (var i=0;i<newPrefixesInScope.length;++i) {
        if (newPrefixesInScope[i].prefix === node.prefix) {
          newPrefixesInScope.splice(i--, 1);
        }
      }

      foundPrefix = null;
    }

    if (!foundPrefix) {
      nsListToRender.push({
        prefix: node.prefix,
        namespaceURI: node.namespaceURI,
      });

      newPrefixesInScope.push({
        prefix: node.prefix,
        namespaceURI: node.namespaceURI,
      });
    }
  } else if (defaultNamespace !== currentNamespace) {
    newDefaultNamespace = currentNamespace;
    res += " xmlns=\"" + escape.attributeEntities(newDefaultNamespace) + "\"";
  }

  if (node.attributes) {
    for (var i=0;i<node.attributes.length;i++) {
      var attr = node.attributes[i],
          foundPrefix = null;

      if (attr.prefix && attr.prefix !== "xmlns") {
        foundPrefix = newPrefixesInScope.filter(function(e) {
          return e.prefix === attr.prefix;
        }).shift();

        if (foundPrefix && foundPrefix.namespaceURI !== attr.namespaceURI) {
          for (var i=0;i<newPrefixesInScope.length;++i) {
            if (newPrefixesInScope[i].prefix === attr.prefix) {
              newPrefixesInScope.splice(i--, 1);
            }
          }

          foundPrefix = null;
        }
      }

      if (attr.prefix && !foundPrefix && attr.prefix !== "xmlns") {
        nsListToRender.push({
          prefix: attr.prefix,
          namespaceURI: attr.namespaceURI,
        });

        newPrefixesInScope.push({
          prefix: attr.prefix,
          namespaceURI: attr.namespaceURI,
        });
      } else if (attr.prefix && attr.prefix === "xmlns" && this.inclusiveNamespaces.indexOf(attr.localName) !== -1) {
        nsListToRender.push({
          prefix: attr.localName,
          namespaceURI: attr.nodeValue,
        });
      }
    }
  }

  nsListToRender.sort(_compareNamespaces);

  for (var i=0;i<nsListToRender.length;++i) {
    res += " xmlns:" + nsListToRender[i].prefix + "=\"" + escape.attributeEntities(nsListToRender[i].namespaceURI) + "\"";
  }

  return {
    rendered: res,
    newDefaultNamespace: newDefaultNamespace,
    newPrefixesInScope: newPrefixesInScope,
  };
};

ExclusiveCanonicalisation.prototype._renderComment = function _renderComment(node) {
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

ExclusiveCanonicalisation.prototype._renderProcessingInstruction = function _renderProcessingInstruction(node) {
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

ExclusiveCanonicalisation.prototype._processInner = function _processInner(node, prefixesInScope, defaultNamespace) {
  defaultNamespace = defaultNamespace || "";
  prefixesInScope = prefixesInScope || [];

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

  var ns = this._renderNamespace(node, prefixesInScope, defaultNamespace);

  var self = this;

  return [
    node.tagName ? "<" + node.tagName + ns.rendered + this._renderAttributes(node) + ">" : "",
    [].slice.call(node.childNodes).map(function(child) {
      return self._processInner(child, ns.newPrefixesInScope, ns.newDefaultNamespace);
    }).join(""),
    node.tagName ? "</" + node.tagName + ">" : "",
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
  "\r": "&#xD;",
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

},{}]},{},[1]);
