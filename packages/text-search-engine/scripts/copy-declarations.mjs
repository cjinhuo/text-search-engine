import { cp, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const source = resolve('esm')
const destination = resolve('dist')
for (const entry of await readdir(source, { recursive: true })) {
	if (entry.endsWith('.d.ts')) {
		await cp(resolve(source, entry), resolve(destination, entry))
	}
}
