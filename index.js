'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInternal = exports.handleAnchor = undefined;

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by CoffeeScript 2.2.4
// Deps
var bind,
    handleExternal,
    handleInternal,
    makeUrlObj,
    mergeSettings,
    settings,
    indexOf = [].indexOf;

// Default settings
settings = {
  addBlankToExternal: false,
  internalUrls: [],
  internalHosts: [typeof location !== "undefined" && location !== null ? location.host : void 0]
};

// Override the settings
mergeSettings = function mergeSettings(choices) {
  return (0, _merge2.default)(settings, choices);
};

// Add listeners to anchors
bind = function bind(el, binding, vnode) {
  var anchor, i, len, ref, results, router;
  // Get the router instance
  router = vnode.context.$router;
  if (el.tagName.toLowerCase() === 'a') {
    // Handle self
    handleAnchor(el, router);
  }
  ref = el.querySelectorAll('a');
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    anchor = ref[i];
    // Handle child anchors that have an href
    results.push(handleAnchor(anchor, router));
  }
  return results;
};

// Check an anchor tag
var handleAnchor = exports.handleAnchor = function handleAnchor(anchor, router) {
  var href, url;
  if (href = anchor.getAttribute('href')) {
    url = makeUrlObj(href);
    if (isInternal(url)) {
      return handleInternal(anchor, url, router);
    } else {
      return handleExternal(anchor);
    }
  }
};

// Test if an anchor is an internal link
var isInternal = exports.isInternal = function isInternal(url) {
  var i, len, ref, ref1, urlRegex;
  url = makeUrlObj(url);
  if (url.href.match(/^\/[^\/]/)) {

    // Does it begin with a / and not an //
    return true;
  }
  ref = settings.internalUrls;

  // Does the hot match internal URLs
  for (i = 0, len = ref.length; i < len; i++) {
    urlRegex = ref[i];
    if (url.href.match(urlRegex)) {
      return true;
    }
  }
  if (ref1 = url.host, indexOf.call(settings.internalHosts, ref1) >= 0) {
    // Does the host match internal hosts
    return true;
  }
};

// Make a URL instance from url strings
makeUrlObj = function makeUrlObj(url) {
  if (typeof url !== 'string') {

    // Already a URL object
    return url;
  }
  if (url.match(/^#/)) {

    // If the URL is just an anchor, prepend the current path so that the URL obj
    // doesn't add an automatic root path
    url = (typeof window !== "undefined" && window !== null ? window.location.pathname : void 0) + url;
  }

  // Return URL object
  return new _urlParse2.default(url);
};

// Add click bindings to internal links that resolve.  Thus, if the Vue doesn't
// know about a route, it will not be handled by vue-router.  Though it won't
// open in a new window.
handleInternal = function handleInternal(anchor, url, router) {
  var route;
  route = {
    path: '' + url.pathname + url.query
  };
  if (router.resolve(route).route.matched.length) {
    return anchor.addEventListener('click', function (e) {
      e.preventDefault();
      return router.push({
        path: '' + url.pathname + url.query + url.hash
      });
    });
  }
};

// Add target blank to external links
handleExternal = function handleExternal(anchor) {
  if (settings.addBlankToExternal && !anchor.hasAttribute('target')) {
    return anchor.setAttribute('target', '_blank');
  }
};

exports.default = {
  // Directive definition with settings method for overriding the default settings.
  // I'm relying on Browser garbage collection to cleanup listeners.
  bind: bind,
  settings: mergeSettings
};