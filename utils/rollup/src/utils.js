import { join, resolve } from 'node:path'

export function getDirName() {
	const __dirname = resolve()
	return join(__dirname)
}
