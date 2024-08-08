import cac from 'cac'

const cli = cac('batch-rollup')
const VERSION = '0.0.1'
export default function help() {
	cli.option('--d, --dir <string>', 'rollup the special directory')
	cli.option('-f --fitler <glob>', 'filter file name with glob')
	cli.option('-p --parallel <number>', 'rollup with parallel count')
	cli.help()
	cli.version(VERSION)
	cli.parse()
}
