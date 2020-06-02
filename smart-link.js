'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

exports.default = {
  name: 'SmartLink',
  functional: true,

  // The URL gets passed here
  props: {
    to: String
  },
  // Destructure the props and data we care about
  render: function render(create, _ref) {
    var to = _ref.props.to,
        _ref$data = _ref.data,
        attrs = _ref$data.attrs,
        staticClass = _ref$data.staticClass,
        children = _ref.children;

    if (!to) {

      // If no "to", just return children
      return children;
    }
    // Test if an internal link
    if ((0, _index.isInternal)(to)) {
      // Render a nuxt-link
      return create('nuxt-link', {
        props: {
          to: (0, _index.makeRouterPath)(to)
        },
        attrs: attrs,
        class: staticClass
      }, children);
    } else {

      // Make a standard link that opens in a new window
      return create('a', {
        attrs: {
          href: to,
          target: (0, _index.shouldOpenInNewWindow)(to) ? '_blank' : void 0
        },
        class: staticClass
      }, children);
    }
  }
}; // Generated by CoffeeScript 2.2.4
// Render a nuxt-link if an internal link or a v-parse-anchor wrapped a if not. 
// This is so that link pre-fetching works.