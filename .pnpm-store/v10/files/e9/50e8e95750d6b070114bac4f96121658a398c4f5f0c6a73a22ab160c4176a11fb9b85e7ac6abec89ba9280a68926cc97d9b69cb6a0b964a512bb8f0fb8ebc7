"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ThemeProvider;
var React = _interopRequireWildcard(require("react"));
var _ThemeProviderNoVars = _interopRequireDefault(require("./ThemeProviderNoVars"));
var _ThemeProviderWithVars = require("./ThemeProviderWithVars");
var _identifier = _interopRequireDefault(require("./identifier"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ThemeProvider({
  theme,
  ...props
}) {
  if (typeof theme === 'function') {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ThemeProviderNoVars.default, {
      theme: theme,
      ...props
    });
  }
  const muiTheme = _identifier.default in theme ? theme[_identifier.default] : theme;
  if (!('colorSchemes' in muiTheme)) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ThemeProviderNoVars.default, {
      theme: theme,
      ...props
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ThemeProviderWithVars.CssVarsProvider, {
    theme: theme,
    ...props
  });
}