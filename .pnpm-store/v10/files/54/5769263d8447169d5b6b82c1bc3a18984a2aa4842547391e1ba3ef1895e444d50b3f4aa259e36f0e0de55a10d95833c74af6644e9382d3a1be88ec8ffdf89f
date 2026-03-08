"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _system.css;
  }
});
exports.globalCss = globalCss;
exports.internal_createExtendSxProp = internal_createExtendSxProp;
Object.defineProperty(exports, "keyframes", {
  enumerable: true,
  get: function () {
    return _system.keyframes;
  }
});
Object.defineProperty(exports, "styled", {
  enumerable: true,
  get: function () {
    return _styled.default;
  }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function () {
    return _useTheme.default;
  }
});
var React = _interopRequireWildcard(require("react"));
var _styleFunctionSx = require("@mui/system/styleFunctionSx");
var _useTheme = _interopRequireDefault(require("../styles/useTheme"));
var _GlobalStyles = _interopRequireDefault(require("../GlobalStyles"));
var _jsxRuntime = require("react/jsx-runtime");
var _system = require("@mui/system");
var _styled = _interopRequireDefault(require("../styles/styled"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function globalCss(styles) {
  return function GlobalStylesWrapper(props) {
    return (
      /*#__PURE__*/
      // Pigment CSS `globalCss` support callback with theme inside an object but `GlobalStyles` support theme as a callback value.
      (0, _jsxRuntime.jsx)(_GlobalStyles.default, {
        styles: typeof styles === 'function' ? theme => styles({
          theme,
          ...props
        }) : styles
      })
    );
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function internal_createExtendSxProp() {
  return _styleFunctionSx.extendSxProp;
}