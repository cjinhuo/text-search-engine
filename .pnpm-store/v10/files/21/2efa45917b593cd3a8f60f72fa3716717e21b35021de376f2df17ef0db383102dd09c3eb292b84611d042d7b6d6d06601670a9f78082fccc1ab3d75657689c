import { getPath } from '@mui/system/style';
import { alpha } from '@mui/system/colorManipulator';
// TODO v7: remove this transformation
export const colorTransformations = {
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
  const color = getPath(theme, `palette.${transformedColor}`, false) || ownerState.color;
  const channelColor = getPath(theme, `palette.${transformedColor}Channel`);
  if ('vars' in theme && channelColor) {
    return `rgba(${channelColor} / 0.4)`;
  }
  return alpha(color, 0.4);
};
export default getTextDecoration;