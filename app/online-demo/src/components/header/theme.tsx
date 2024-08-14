import useDarkMode from '../../hooks/useThemeMode'
import { IconParkNames, ThemeMode } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
export default function Theme() {
	const [theme, setTheme] = useDarkMode()

	return (
		<LinkWithIcon
			name={theme === ThemeMode.light ? IconParkNames.light : IconParkNames.dark}
			onClick={() => {
				setTheme(theme === ThemeMode.light ? ThemeMode.dark : ThemeMode.light)
			}}
		/>
	)
}
