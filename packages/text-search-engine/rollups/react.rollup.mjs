import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { getBasicOutput, getBasicPlugins, getDirName } from '@mono/rollup'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const currentPackageDir = getDirName()
const input = resolve(currentPackageDir, 'esm/react/index.js')
const packageDirDist = `${currentPackageDir}/dist`
const { name, version } = createRequire(import.meta.url)('../package.json')

const config = {
	input,
	// reuse the same input as the main entry
	external: ['../index'],
	output: {
		file: `${packageDirDist}/react/index.js`,
		format: 'es',
		sourcemap: false,
		exports: 'named',
		paths: (id) => (id === '../index' || id === resolve(currentPackageDir, 'esm/index') ? '../index.js' : id),
		...getBasicOutput({ name, version }),
	},
	plugins: [getBasicPlugins(), peerDepsExternal()],
}

export default config
