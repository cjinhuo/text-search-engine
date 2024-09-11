import { getBasicOutput, getBasicPlugins, getDirName, getDtsConfig } from '@mono/rollup'

import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const currentPackageDir = getDirName()
const input = resolve(currentPackageDir, 'esm/react/index.js')
const packageDirDist = `${currentPackageDir}/dist`
const { name, version } = createRequire(import.meta.url)('../package.json')

const reactDtsInput = {
	file: `${currentPackageDir}/esm/react/index.d.ts`,
}
const reactDtsOutput = {
	dir: `${packageDirDist}/react`,
	entryFileNames: 'index.d.ts',
	format: 'es',
}
console.log('reactDtsInput', reactDtsInput, 'reactDtsOutput', reactDtsOutput)
const config = {
	input,
	// reuse the same input as the main entry
	external: ['../index'],
	output: {
		file: `${packageDirDist}/react/index.esm.js`,
		format: 'es',
		sourcemap: false,
		exports: 'named',
		...getBasicOutput({ name, version }),
	},
	plugins: [getBasicPlugins(), peerDepsExternal()],
}

export default [config, getDtsConfig({ input: reactDtsInput, output: reactDtsOutput })]
