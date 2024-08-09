import { LOCAL_STORAGE_THEME_KEY, ThemeMode } from './constants'

export function isSystemDarkMode() {
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

export function isLocalStorageDarkMode() {
	return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) === 'dark'
}

export function getThemeMode() {
	if (isSystemDarkMode() || isLocalStorageDarkMode()) {
		return ThemeMode.dark
	}
	return ThemeMode.light
}
