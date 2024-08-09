import { useEffect, useState } from 'react'
import { ThemeMode } from '../shared/constants'
import { getThemeMode } from '../shared/utils'

export default function useDarkMode() {
	const [theme, setTheme] = useState<ThemeMode>(getThemeMode())
	useEffect(() => {
		if (theme === ThemeMode.dark) {
			document.body.classList.add(ThemeMode.dark)
		} else {
			document.body.classList.remove(ThemeMode.dark)
		}
	}, [theme])
	return [theme, setTheme] as const
}
