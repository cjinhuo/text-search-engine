import alias from '@rollup/plugin-alias'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import size from 'rollup-plugin-sizes'
// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const packagesRoot = resolve(__dirname, '../../../packages')
// const packagesRoot = resolve(__dirname, '../../../packages')
const aliasConfig = alias({
	entries: [],
})

// Custom plugin to exclude standalone code blocks with curly braces (test/debug code)
function excludeStandaloneBlocks() {
	return {
		name: 'exclude-standalone-blocks',
		transform(code) {
			// 移除 debugFn 调用的代码
			const debugFnRegex = /debugFn\(\(\)\s*=>\s*\{[\s\S]*?\}\)/g
			if (debugFnRegex.test(code)) {
				return code.replace(debugFnRegex, '\n')
			}
			return code
		},
	}
}

export function getBasicPlugins(aliasPlguin = aliasConfig) {
	return [
		excludeStandaloneBlocks(),
		process.env.ENV === 'test' &&
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
		// Add the custom plugin before cleanup

		cleanup({
			comments: 'none',
		}),
	].filter(Boolean)
}
