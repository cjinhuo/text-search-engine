"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _jss = require("jss");
var _StylesProvider = _interopRequireDefault(require("../StylesProvider"));
var _createGenerateClassName = _interopRequireDefault(require("../createGenerateClassName"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class ServerStyleSheets {
  constructor(options = {}) {
    this.options = options;
  }
  collect(children) {
    // This is needed in order to deduplicate the injection of CSS in the page.
    const sheetsManager = new Map();
    // This is needed in order to inject the critical CSS.
    this.sheetsRegistry = new _jss.SheetsRegistry();
    // A new class name generator
    const generateClassName = (0, _createGenerateClassName.default)();
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_StylesProvider.default, (0, _extends2.default)({
      sheetsManager: sheetsManager,
      serverGenerateClassName: generateClassName,
      sheetsRegistry: this.sheetsRegistry
    }, this.options, {
      children: children
    }));
  }
  toString() {
    return this.sheetsRegistry ? this.sheetsRegistry.toString() : '';
  }
  getStyleElement(props) {
    return /*#__PURE__*/React.createElement('style', (0, _extends2.default)({
      id: 'jss-server-side',
      key: 'jss-server-side',
      dangerouslySetInnerHTML: {
        __html: this.toString()
      }
    }, props));
  }
}
exports.default = ServerStyleSheets;