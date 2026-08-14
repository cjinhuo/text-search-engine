import { performance } from 'node:perf_hooks'
import { extractBoundaryMappingWithPresetPinyin } from '../src/boundary'
import { search } from '../src/exports'
import { searchSentenceByBoundaryMapping } from '../src/search'
import type { Matrix } from '../src/types'

type BenchmarkCase = {
	name: string
	source: string
	targets: string[]
	iterations: number
}

type BenchmarkResult = {
	case: string
	mode: string
	'ms/op': string
	'ops/s': string
}

const WARMUP_ITERATIONS = 20
const SAMPLE_ROUNDS = 9
let resultSink = 0

const benchmarkCases: BenchmarkCase[] = [
	{
		name: 'long-tail',
		source: `a_b_c_d_e_f${'x'.repeat(5_000)}`,
		targets: ['ab', 'abc', 'abcd', 'abcde', 'abcdef'],
		iterations: 120,
	},
	{
		name: 'latin-dense',
		source: 'ab'.repeat(3_000),
		targets: ['aaaa', 'aaaaaa', 'aaaaaaaa'],
		iterations: 12,
	},
	{
		name: 'chinese-dense',
		source: '监控平台'.repeat(500),
		targets: ['jkjk', 'jkptjk', 'jkjkjk'],
		iterations: 8,
	},
]

function recordResult(result: Matrix | undefined) {
	resultSink += result?.length ?? 0
}

function median(values: number[]) {
	const sortedValues = values.slice().sort((a, b) => a - b)
	return sortedValues[Math.floor(sortedValues.length / 2)]
}

function measure(run: (iteration: number) => Matrix | undefined, iterations: number) {
	for (let i = 0; i < WARMUP_ITERATIONS; i++) recordResult(run(i))

	const samples: number[] = []
	for (let round = 0; round < SAMPLE_ROUNDS; round++) {
		const startTime = performance.now()
		for (let i = 0; i < iterations; i++) recordResult(run(i))
		samples.push((performance.now() - startTime) / iterations)
	}
	return median(samples)
}

function formatResult(caseName: string, mode: string, millisecondsPerOperation: number): BenchmarkResult {
	return {
		case: caseName,
		mode,
		'ms/op': millisecondsPerOperation.toFixed(4),
		'ops/s': (1_000 / millisecondsPerOperation).toFixed(0),
	}
}

const results: BenchmarkResult[] = []
for (const benchmarkCase of benchmarkCases) {
	const boundaryMapping = extractBoundaryMappingWithPresetPinyin(benchmarkCase.source)
	const getTarget = (iteration: number) => benchmarkCase.targets[iteration % benchmarkCase.targets.length]

	const fullSearchDuration = measure(
		(iteration) => search(benchmarkCase.source, getTarget(iteration)),
		benchmarkCase.iterations
	)
	results.push(formatResult(benchmarkCase.name, 'search', fullSearchDuration))

	const reusedBoundaryDuration = measure(
		(iteration) => searchSentenceByBoundaryMapping(boundaryMapping, getTarget(iteration)).hitRanges,
		benchmarkCase.iterations
	)
	results.push(formatResult(benchmarkCase.name, 'reused boundary', reusedBoundaryDuration))
}

const churnSources = Array.from({ length: 2_000 }, (_, index) => `${index.toString(36)}-a_b_c_d_e_f-${'x'.repeat(64)}`)
const churnDuration = measure(
	(iteration) => search(churnSources[iteration % churnSources.length], 'abcdef'),
	churnSources.length
)
results.push(formatResult('source-churn', 'search', churnDuration))

console.table(results)

// 保证运行时能够观察到 benchmark 调用，同时避免污染正常输出。
if (process.env.SEARCH_BENCHMARK_DEBUG) console.log('result sink:', resultSink)
