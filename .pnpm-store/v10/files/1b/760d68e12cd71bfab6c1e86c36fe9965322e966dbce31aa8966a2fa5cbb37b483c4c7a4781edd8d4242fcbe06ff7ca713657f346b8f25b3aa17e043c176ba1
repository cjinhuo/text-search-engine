import prepareCssVars from './prepareCssVars';
import { createGetColorSchemeSelector } from './getColorSchemeSelector';
import { DEFAULT_ATTRIBUTE } from '../InitColorSchemeScript/InitColorSchemeScript';
function createCssVarsTheme({
  colorSchemeSelector = `[${DEFAULT_ATTRIBUTE}="%s"]`,
  ...theme
}) {
  const output = theme;
  const result = prepareCssVars(output, {
    ...theme,
    prefix: theme.cssVarPrefix,
    colorSchemeSelector
  });
  output.vars = result.vars;
  output.generateThemeVars = result.generateThemeVars;
  output.generateStyleSheets = result.generateStyleSheets;
  output.colorSchemeSelector = colorSchemeSelector;
  output.getColorSchemeSelector = createGetColorSchemeSelector(colorSchemeSelector);
  return output;
}
export default createCssVarsTheme;