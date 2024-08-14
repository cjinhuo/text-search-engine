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

export function encodeURIComponentPlus(str: string) {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}
export function decodeURIComponentPlus(str: string) {
	return decodeURIComponent(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		str.replace(/%(21|28|29|2A|27)/g, (match: any, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)))
	)
}

export function getHighlightText(str: string) {
	return `\x1b[33m${str}\x1b[0m`
}
