"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createGrid;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _isMuiElement = _interopRequireDefault(require("@mui/utils/isMuiElement"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _styled = _interopRequireDefault(require("../styled"));
var _useThemeProps = _interopRequireDefault(require("../useThemeProps"));
var _useTheme = _interopRequireDefault(require("../useTheme"));
var _styleFunctionSx = require("../styleFunctionSx");
var _createTheme = _interopRequireDefault(require("../createTheme"));
var _gridGenerator = require("./gridGenerator");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const defaultTheme = (0, _createTheme.default)();

// widening Theme to any so that the consumer can own the theme structure.
const defaultCreateStyledComponent = (0, _styled.default)('div', {
  name: 'MuiGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
});
function useThemePropsDefault(props) {
  return (0, _useThemeProps.default)({
    props,
    name: 'MuiGrid',
    defaultTheme
  });
}
function createGrid(options = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent,
    useThemeProps = useThemePropsDefault,
    componentName = 'MuiGrid'
  } = options;
  const useUtilityClasses = (ownerState, theme) => {
    const {
      container,
      direction,
      spacing,
      wrap,
      size
    } = ownerState;
    const slots = {
      root: ['root', container && 'container', wrap !== 'wrap' && `wrap-xs-${String(wrap)}`, ...(0, _gridGenerator.generateDirectionClasses)(direction), ...(0, _gridGenerator.generateSizeClassNames)(size), ...(container ? (0, _gridGenerator.generateSpacingClassNames)(spacing, theme.breakpoints.keys[0]) : [])]
    };
    return (0, _composeClasses.default)(slots, slot => (0, _generateUtilityClass.default)(componentName, slot), {});
  };
  function parseResponsiveProp(propValue, breakpoints, shouldUseValue = () => true) {
    const parsedProp = {};
    if (propValue === null) {
      return parsedProp;
    }
    if (Array.isArray(propValue)) {
      propValue.forEach((value, index) => {
        if (value !== null && shouldUseValue(value) && breakpoints.keys[index]) {
          parsedProp[breakpoints.keys[index]] = value;
        }
      });
    } else if (typeof propValue === 'object') {
      Object.keys(propValue).forEach(key => {
        const value = propValue[key];
        if (value !== null && value !== undefined && shouldUseValue(value)) {
          parsedProp[key] = value;
        }
      });
    } else {
      parsedProp[breakpoints.keys[0]] = propValue;
    }
    return parsedProp;
  }
  const GridRoot = createStyledComponent(_gridGenerator.generateGridColumnsStyles, _gridGenerator.generateGridColumnSpacingStyles, _gridGenerator.generateGridRowSpacingStyles, _gridGenerator.generateGridSizeStyles, _gridGenerator.generateGridDirectionStyles, _gridGenerator.generateGridStyles, _gridGenerator.generateGridOffsetStyles);
  const Grid = /*#__PURE__*/React.forwardRef(function Grid(inProps, ref) {
    var _inProps$columns, _inProps$spacing, _ref, _inProps$rowSpacing, _ref2, _inProps$columnSpacin;
    const theme = (0, _useTheme.default)();
    const themeProps = useThemeProps(inProps);
    const props = (0, _styleFunctionSx.extendSxProp)(themeProps); // `color` type conflicts with html color attribute.
    const {
      className,
      children,
      columns: columnsProp = 12,
      container = false,
      component = 'div',
      direction = 'row',
      wrap = 'wrap',
      size: sizeProp = {},
      offset: offsetProp = {},
      spacing: spacingProp = 0,
      rowSpacing: rowSpacingProp = spacingProp,
      columnSpacing: columnSpacingProp = spacingProp,
      unstable_level: level = 0,
      ...other
    } = props;
    const size = parseResponsiveProp(sizeProp, theme.breakpoints, val => val !== false);
    const offset = parseResponsiveProp(offsetProp, theme.breakpoints);
    const columns = (_inProps$columns = inProps.columns) != null ? _inProps$columns : level ? undefined : columnsProp;
    const spacing = (_inProps$spacing = inProps.spacing) != null ? _inProps$spacing : level ? undefined : spacingProp;
    const rowSpacing = (_ref = (_inProps$rowSpacing = inProps.rowSpacing) != null ? _inProps$rowSpacing : inProps.spacing) != null ? _ref : level ? undefined : rowSpacingProp;
    const columnSpacing = (_ref2 = (_inProps$columnSpacin = inProps.columnSpacing) != null ? _inProps$columnSpacin : inProps.spacing) != null ? _ref2 : level ? undefined : columnSpacingProp;
    const ownerState = {
      ...props,
      level,
      columns,
      container,
      direction,
      wrap,
      spacing,
      rowSpacing,
      columnSpacing,
      size,
      offset
    };
    const classes = useUtilityClasses(ownerState, theme);
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridRoot, {
      ref: ref,
      as: component,
      ownerState: ownerState,
      className: (0, _clsx.default)(classes.root, className),
      ...other,
      children: React.Children.map(children, child => {
        if ( /*#__PURE__*/React.isValidElement(child) && (0, _isMuiElement.default)(child, ['Grid'])) {
          var _unstable_level;
          return /*#__PURE__*/React.cloneElement(child, {
            unstable_level: (_unstable_level = child.props.unstable_level) != null ? _unstable_level : level + 1
          });
        }
        return child;
      })
    });
  });
  process.env.NODE_ENV !== "production" ? Grid.propTypes /* remove-proptypes */ = {
    children: _propTypes.default.node,
    className: _propTypes.default.string,
    columns: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.number), _propTypes.default.number, _propTypes.default.object]),
    columnSpacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),
    component: _propTypes.default.elementType,
    container: _propTypes.default.bool,
    direction: _propTypes.default.oneOfType([_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']), _propTypes.default.arrayOf(_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])), _propTypes.default.object]),
    offset: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])), _propTypes.default.object]),
    rowSpacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),
    size: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool, _propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool, _propTypes.default.number])), _propTypes.default.object]),
    spacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),
    sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
    wrap: _propTypes.default.oneOf(['nowrap', 'wrap-reverse', 'wrap'])
  } : void 0;

  // @ts-ignore internal logic for nested grid
  Grid.muiName = 'Grid';
  return Grid;
}