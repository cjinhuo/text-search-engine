"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Stack = _interopRequireDefault(require("@mui/material-pigment-css/Stack"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// @ts-ignore

const useUtilityClasses = () => {
  const slots = {
    root: ['root']
  };
  return (0, _composeClasses.default)(slots, slot => (0, _generateUtilityClass.default)('MuiStack', slot), {});
};
/**
 *
 * Demos:
 *
 * - [Stack](https://next.mui.com/material-ui/react-stack/)
 *
 * API:
 *
 * - [PigmentStack API](https://next.mui.com/material-ui/api/pigment-stack/)
 */
const PigmentStack = /*#__PURE__*/React.forwardRef(function PigmentStack({
  className,
  ...props
}, ref) {
  const classes = useUtilityClasses();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Stack.default, {
    ref: ref,
    className: (0, _clsx.default)(classes.root, className),
    ...props
  });
});
process.env.NODE_ENV !== "production" ? PigmentStack.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: _propTypes.default.node,
  /**
   * @ignore
   */
  className: _propTypes.default.string,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'column'
   */
  direction: _propTypes.default.oneOfType([_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']), _propTypes.default.arrayOf(_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])), _propTypes.default.shape({
    lg: _propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
    md: _propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
    sm: _propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
    xl: _propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
    xs: _propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])
  })]),
  /**
   * Add an element between each child.
   */
  divider: _propTypes.default.node,
  /**
   * Defines the space between immediate children.
   * @default 0
   */
  spacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.shape({
    lg: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    md: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    sm: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    xl: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    xs: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }), _propTypes.default.string]),
  /**
   * The system prop, which allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;
var _default = exports.default = PigmentStack;