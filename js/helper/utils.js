
/*
Adapted from certain functions from here:
https://github.com/yaronn/ws.js/blob/master/lib/utils.js
 */

(function() {
  window.utils = (function() {
    function utils() {}

    utils.findAttr = function(node, localName, namespace) {
      var attr, i, len, ref;
      ref = node.attributes;
      for (i = 0, len = ref.length; i < len; i++) {
        attr = ref[i];
        if (this.attrEqualsExplicitly(attr, localName, namespace) || this.attrEqualsImplicitly(attr, localName, namespace, node)) {
          return attr;
        }
      }
      return null;
    };

    utils.findFirst = function(doc, input_xpath) {
      var nodes;
      nodes = xpath.select(input_xpath, doc);
      if (nodes.length === 0) {
        throw "could not find xpath " + input_xpath;
      }
      return nodes[0];
    };

    utils.findChilds = function(node, localName, namespace) {
      var child, i, len, ref, res;
      node = node.documentElement || node;
      res = [];
      ref = node.childNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (child.localName === localName && (child.namespaceURI === namespace || !namespace)) {
          res.push(child);
        }
      }
      return res;
    };

    utils.attrEqualsExplicitly = function(attr, localName, namespace) {
      return attr.localName === localName && (attr.namespaceURI === namespace || !namespace);
    };

    utils.attrEqualsImplicitly = function(attr, localName, namespace, node) {
      return attr.localName === localName && ((!attr.namespaceURI && node.namespaceURI === namespace) || !namespace);
    };

    utils.parseXML = function(data) {
      var error, xml;
      if (!data || typeof data !== "string") {
        return null;
      }
      try {
        xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      } catch (error1) {
        error = error1;
        xml = void 0;
      }
      if (!xml || xml.getElementsByTagName("parsererror").length) {
        throw "Invalid XML: " + data;
      }
      return xml;
    };

    return utils;

  })();

}).call(this);
