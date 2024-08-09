import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { getBasicOutput, getBasicPlugins, getDirName } from '@mono/rollup'
import terser from '@rollup/plugin-terser'

const currentPackageDir = getDirName()
const input = resolve(currentPackageDir, 'esm/index.js')
const packageDirDist = `${currentPackageDir}/dist`

const { name, version } = createRequire(import.meta.url)('../package.json')

const configs = [
	{
		input,
		output: {
			file: `${packageDirDist}/index.min.js`,
			format: 'iife',
			sourcemap: false,
			name: 'SMART_SEARCH_ENGINE',
			exports: 'named',
			...getBasicOutput({ name, version }),
		},
		plugins: [getBasicPlugins(), terser()],
	},
	{
		input: resolve(currentPackageDir, 'esm/pure.js'),
		output: {
			file: `${packageDirDist}/pure.min.js`,
			format: 'iife',
			sourcemap: false,
			name: 'SMART_SEARCH_ENGINE',
			exports: 'named',
			...getBasicOutput({ name, version }),
		},
		plugins: [getBasicPlugins(), terser()],
	},
]
export default configs
