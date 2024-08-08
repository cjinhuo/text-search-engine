#!/usr/bin/env node

import { cpus } from 'node:os'
import { join } from 'node:path'

import Consola from 'consola'
import { execa } from 'execa'
import fg from 'fast-glob'
import minimist from 'minimist'

import help from './common/help.js'
import { getGlobFilter } from './common/index.js'
const info = Consola.info
const argv = minimist(process.argv.slice(2))
const folder = argv.d || argv.dir
const parallel = argv.p || argv.parallel
const filter = argv.f || argv.filter
const maxParallel = parallel ? Number(parallel) : cpus().length

main()

function main() {
	if (!folder && !parallel && !filter) {
		return help()
	}
	if (!folder) {
		throw new Error('plz pass the correct dir')
	}
	const rollupRunRoot = join(process.cwd(), folder)

	runParallel(
		maxParallel,
		getAllRollupEntries(rollupRunRoot).map((url) => async () => {
			await build(url)
		})
	)
}

function getAllRollupEntries(rootDir) {
	return fg.sync(`${rootDir}/**/*${getGlobFilter(filter)}rollup.mjs`, {
		onlyFiles: true,
	})
}

async function build(rollupEntry) {
	info('rollup -c', rollupEntry)
	await execa('rollup', ['-c', rollupEntry], { stdio: 'inherit' })
}

async function runParallel(maxConcurrency, source) {
	const ret = []
	const executing = []
	for (const item of source) {
		const p = Promise.resolve().then(() => item())
		ret.push(p)

		if (maxConcurrency <= source.length) {
			const e = p.then(() => executing.splice(executing.indexOf(e), 1))
			executing.push(e)
			if (executing.length >= maxConcurrency) {
				await Promise.race(executing)
			}
		}
	}
	return Promise.all(ret)
}
