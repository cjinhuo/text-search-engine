import { dirname, join, resolve } from 'node:path'
import url from 'node:url'
import alias from '@rollup/plugin-alias'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import size from 'rollup-plugin-sizes'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packagesRoot = resolve(__dirname, '../../../packages')
const aliasConfig = alias({
	entries: [
		{ find: /^@mono\/core$/, replacement: join(packagesRoot, 'core', 'esm') },
		{ find: /^@mono\/web$/, replacement: join(packagesRoot, 'web', 'esm') },
		{ find: /^@mono\/react$/, replacement: join(packagesRoot, 'react', 'esm') },
		{
			find: /^@mono\/shared$/,
			replacement: join(packagesRoot, 'shared', 'esm'),
		},
	],
})

export function getBasicPlugins(aliasPlguin = aliasConfig) {
	return [
		babel({
			babelHelpers: 'bundled',
			plugins: ['babel-plugin-istanbul'],
		}),
		aliasPlguin,
		nodeResolve(),
		size(),
		commonjs({
			exclude: 'node_modules',
		}),
		json(),
		cleanup({
			comments: 'none',
		}),
	]
	// 外部依赖，也是防止重复打包的配置
	// external: [],
}
