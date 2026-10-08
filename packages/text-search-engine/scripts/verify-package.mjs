import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runInNewContext } from 'node:vm'

const [tarball, ...compilers] = process.argv.slice(2)
if (!tarball || !compilers.length) throw new Error('Usage: verify-package.mjs package.tgz /path/to/tsc [...]')
const require = createRequire(import.meta.url)
const temp = await mkdtemp(join(tmpdir(), 'text-search-engine-package-'))
try {
	const modules = join(temp, 'node_modules')
	await mkdir(modules)
	execFileSync('tar', ['-xzf', resolve(tarball), '-C', modules])
	const pkg = join(modules, 'text-search-engine')
	await symlink(join(modules, 'package'), pkg)
	await symlink(dirname(require.resolve('react/package.json')), join(modules, 'react'))
	await mkdir(join(modules, '@types'))
	await symlink(dirname(require.resolve('@types/react/package.json')), join(modules, '@types/react'))
	const declarations = await readdir(join(pkg, 'dist'), { recursive: true })
	assert(!declarations.some((file) => file.includes('__test__') || file.endsWith('.spec.d.ts')))
	const fixture = (await readFile(resolve('test-types/search-items.ts'), 'utf8')).replace(
		"from '../src'",
		"from 'text-search-engine'"
	)
	await writeFile(
		join(temp, 'types.ts'),
		`${fixture}\nimport { HighlightWithRanges } from 'text-search-engine/react'\nHighlightWithRanges satisfies Function\n`
	)
	await writeFile(
		join(temp, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				strict: true,
				noEmit: true,
				skipLibCheck: false,
				target: 'es2015',
				module: 'esnext',
				moduleResolution: 'bundler',
				jsx: 'react',
				types: ['react'],
			},
			files: ['types.ts'],
		})
	)
	for (const compiler of compilers) {
		execFileSync(resolve(compiler), ['-p', join(temp, 'tsconfig.json')], { stdio: 'inherit' })
		console.log(`Published type inference passed: ${compiler}`)
	}
	const cjs = require(join(pkg, 'dist/index.cjs.js'))
	const esm = await import(pathToFileURL(join(pkg, 'dist/index.js')))
	const context = {}
	runInNewContext(await readFile(join(pkg, 'dist/index.min.js'), 'utf8'), context)
	for (const api of [cjs, esm, context._TEXT_SEARCH_ENGINE_]) {
		assert.equal(api.searchItems(['监控'], 'jk')[0].item, '监控')
		assert.equal(api.createSearcher(['React']).search('react')[0].text, 'React')
		const fields = api.searchItems([{ title: 'İ', host: 'github.com' }], 'github', { getFields: (item) => item })[0]
			.fieldHitRanges
		assert.equal(fields.host[0][0], 0)
		assert.equal(fields.host[0][1], 5)
	}
	const react = await import(pathToFileURL(join(pkg, 'dist/react/index.js')))
	assert.equal(typeof react.HighlightWithRanges, 'function')
	assert.equal(typeof react.HighlightWithTarget, 'function')
	const pureContext = {}
	runInNewContext(await readFile(join(pkg, 'dist/pure.min.js'), 'utf8'), pureContext)
	assert.equal(typeof pureContext._TEXT_SEARCH_ENGINE_.pureSearch, 'function')
	console.log('Package declarations, ESM, CJS, IIFE, pure IIFE and React passed')
} finally {
	await rm(temp, { recursive: true, force: true })
}
