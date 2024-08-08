import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { getBasicOutput, getBasicPlugins, getDirName } from '@mono/rollup'

const currentPackageDir = getDirName()
const input = resolve(currentPackageDir, 'esm/index.js')
const packageDirDist = `${currentPackageDir}/dist`

const { name, version } = createRequire(import.meta.url)('../package.json')

const config = {
	input,
	external: [],
	output: {
		file: `${packageDirDist}/index.min.js`,
		format: 'iife',
		sourcemap: true,
		name: '_GLOBAL_',
		exports: 'named',
		...getBasicOutput({ name, version }),
	},
	plugins: getBasicPlugins(),
}
export default config
