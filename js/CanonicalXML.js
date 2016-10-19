(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var c14n;

  window.setImmediate = require('timers').setImmediate;

  c14n = require("xml-c14n")();

  window.CanonicalXML = (function() {
    CanonicalXML.prototype.CanonicalisationMethod = "http://www.w3.org/2001/10/xml-exc-c14n#WithComments";


    /*
    Erzeugt einen neuen Canonicalisierer
     */

    function CanonicalXML(Algorithm) {
      this.can = c14n.createCanonicaliser(this.CanonicalisationMethod);
    }


    /*
    Erzeugt einen Promise für ein neues canonicalisiertes XML document
     */

    CanonicalXML.prototype.canonicalise = function(RawXML) {
      var can;
      can = this.can;
      return new Promise(function(resolve, reject) {
        return can.canonicalise(RawXML, function(err, res) {
          if (err) {
            return reject(err);
          } else {
            return resolve(res);
          }
        });
      });
    };

    return CanonicalXML;

  })();

}).call(this);

},{"timers":3,"xml-c14n":4}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
},{"process/browser.js":2}],4:[function(require,module,exports){
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

},{"./lib/algorithm/exclusive-canonicalisation":6}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../algorithm":5,"../escape":7}],7:[function(require,module,exports){
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
