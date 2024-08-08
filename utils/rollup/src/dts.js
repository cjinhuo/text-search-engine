import dts from 'rollup-plugin-dts'
import { getDirName } from './utils.js'

/**
 *
 * @param {*} option  {input, output, dtsOption}
 * @returns {Object}
 */
export function getDtsConfig(option = {}) {
	const pkgDirPath = getDirName()
	const input = option.input || {
		file: `${pkgDirPath}/esm/index.d.ts`,
	}
	const output = option.output || {
		entryFileNames: 'index.d.ts',
		dir: `${pkgDirPath}/dist`,
		format: 'es',
	}
	const dtsOption = option.dtsOption || {}
	return {
		input,
		output,
		plugins: [dts(dtsOption)],
	}
}
