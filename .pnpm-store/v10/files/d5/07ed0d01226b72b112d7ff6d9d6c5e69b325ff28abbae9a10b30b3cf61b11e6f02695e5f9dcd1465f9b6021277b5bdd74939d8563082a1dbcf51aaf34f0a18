"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.colorTransformations = void 0;
var _style = require("@mui/system/style");
var _colorManipulator = require("@mui/system/colorManipulator");
// TODO v7: remove this transformation
const colorTransformations = exports.colorTransformations = {
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
  // For main palette, the color will be applied by the styles above.
  primary: null,
  secondary: null,
  error: null,
  info: null,
  success: null,
  warning: null
};
const getTextDecoration = ({
  theme,
  ownerState
}) => {
  let transformedColor = colorTransformations[ownerState.color];
  if (transformedColor === null) {
    return null;
  }
  if (transformedColor === undefined) {
    transformedColor = ownerState.color;
  }
  const color = (0, _style.getPath)(theme, `palette.${transformedColor}`, false) || ownerState.color;
  const channelColor = (0, _style.getPath)(theme, `palette.${transformedColor}Channel`);
  if ('vars' in theme && channelColor) {
    return `rgba(${channelColor} / 0.4)`;
  }
  return (0, _colorManipulator.alpha)(color, 0.4);
};
var _default = exports.default = getTextDecoration;