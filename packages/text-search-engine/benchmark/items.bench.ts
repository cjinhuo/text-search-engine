import { performance } from 'node:perf_hooks'
import { createSearcher, extractBoundaryMapping, searchSentenceByBoundaryMapping } from '../src'

const median = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
function measure(run: () => unknown, rounds = 9) {
	const samples: number[] = []
	for (let i = 0; i < rounds; i++) {
		const start = performance.now()
		run()
		samples.push(performance.now() - start)
	}
	return Number(median(samples).toFixed(3))
}

const rows = [100, 1_000, 10_000].map((count) => {
	const items = Array.from({ length: count }, (_, index) => ({
		title: `React 监控平台 ${index}`,
		host: `docs${index}.example.com`,
	}))
	const getFields = (item: (typeof items)[number]) => ({ title: item.title, host: item.host })
	const create = (list = items) => createSearcher(list, { getFields })
	const searcher = create()
	const coldQuery = measure(() => create().search('jk example'))
	for (let i = 0; i < 20; i++) searcher.search('jk example')
	const oldPayload = items.map((item) => {
		const compositeSource = item.title.toLocaleLowerCase().trim() + item.host
		return { ...item, compositeSource, compositeBoundaryMapping: extractBoundaryMapping(compositeSource) }
	})
	return {
		count,
		'first-20 snapshot ms': measure(() => create(items.slice(0, 20))),
		'legacy full preprocessing ms': measure(() =>
			items.map((i) => extractBoundaryMapping(i.title.toLocaleLowerCase().trim() + i.host))
		),
		'snapshot/rebuild ms': measure(() => create()),
		'cold query + snapshot ms': coldQuery,
		'hot query ms': measure(() => searcher.search('jk example')),
		'legacy hot match ms': measure(() =>
			oldPayload.map((i) => searchSentenceByBoundaryMapping(i.compositeBoundaryMapping, 'jk example'))
		),
		'raw message bytes': Buffer.byteLength(JSON.stringify(items)),
		'prepared message bytes': Buffer.byteLength(JSON.stringify(oldPayload)),
	}
})
console.table(rows)
console.log(
	JSON.stringify(
		{ environment: { node: process.version, platform: process.platform, arch: process.arch }, rows },
		null,
		2
	)
)
