"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getReactNodeRef;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Returns the ref of a React node handling differences between React 19 and older versions.
 * It will return null if the node is not a valid React element.
 *
 * @param element React.ReactNode
 * @returns React.Ref<any> | null
 */
function getReactNodeRef(element) {
  if (!element || ! /*#__PURE__*/React.isValidElement(element)) {
    return null;
  }

  // 'ref' is passed as prop in React 19, whereas 'ref' is directly attached to children in older versions
  return element.props.propertyIsEnumerable('ref') ? element.props.ref :
  // @ts-expect-error element.ref is not included in the ReactElement type
  // We cannot check for it, but isValidElement is true at this point
  // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70189
  element.ref;
}