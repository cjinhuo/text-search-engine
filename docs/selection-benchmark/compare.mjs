import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import Fuse from 'fuse.js'
import { match, pinyin } from 'pinyin-pro'
import { createSearcher, searchItems } from 'text-search-engine'

const rows = [
  { id: 'monitor', title: 'React 监控平台', host: 'github.com' },
  { id: 'space', title: '健康空间', host: 'example.org' },
  { id: 'repeat', title: '重复任务', host: 'example.org' },
  { id: 'bank', title: '银行服务', host: 'example.org' },
  { id: 'types', title: 'TypeScript Handbook', host: 'typescriptlang.org' },
  { id: 'typography', title: 'Typography', host: 'example.org' },
  { id: 'javascript', title: 'JavaScript', host: 'example.org' },
]
const cases = [
  { query: 'jk', expected: ['monitor', 'space'] },
  { query: 'jk github', expected: ['monitor'] },
  { query: 'chongfu', expected: ['repeat'] },
  { query: 'yinhang', expected: ['bank'] },
  { query: 'typscript', expected: ['types'] },
  { query: 'typescrpit', expected: ['types'] },
  { query: 'jvaascript', expected: ['javascript'] },
  { query: 'qzxv123', expected: [] },
]

const getFields = ({ title, host }) => ({ title, host })
const asText = ({ title, host }) => title + host
const compact = (query) => query.toLowerCase().replaceAll(' ', '')
const adapters = {
  'Text Search Engine': (items) => {
    const searcher = createSearcher(items, { getFields })
    return (query) => searcher.search(query).map(({ item }) => item.id)
  },
  'pinyin-pro match': (items) => {
    const texts = items.map((item) => [item.id, asText(item).toLowerCase()])
    return (query) => texts.filter(([, text]) => match(text, compact(query))).map(([id]) => id)
  },
  'Fuse.js + Pinyin': (items) => {
    const indexable = items.map((item) => {
      const text = asText(item).toLowerCase().replaceAll(' ', '')
      return {
        id: item.id, text,
        full: pinyin(text, { toneType: 'none', separator: '' }),
        initials: pinyin(text, { pattern: 'first', toneType: 'none', separator: '' }),
      }
    })
    const fuse = new Fuse(indexable, {
      keys: ['text', 'full', 'initials'], threshold: 0.3, ignoreLocation: true,
    })
    return (query) => fuse.search(compact(query)).map(({ item }) => item.id)
  },
}

assert.deepEqual(searchItems(['React', '监控平台'], 'jk'), [
  { item: '监控平台', index: 1, text: '监控平台', hitRanges: [[0, 1]] },
])
const [hit] = createSearcher(rows, { getFields }).search('jk github')
assert.equal(hit.item, rows[0])
assert.deepEqual(hit.fieldHitRanges, { title: [[6, 7]], host: [[0, 5]] })
assert.equal(hit.item.title.slice(6, 8), '监控')

// Time lookup and result-ID projection only. No rendering or range normalization.
const dataset = Array.from({ length: 1000 }, (_, i) => {
  const row = rows[i % rows.length]
  return { ...row, id: String(i), title: row.title + i }
})
const median = (samples) => samples.sort((a, b) => a - b)[Math.floor(samples.length / 2)]
const timings = {}
for (const [name, make] of Object.entries(adapters)) {
  const first = []
  const repeated = []
  for (let i = 0; i < 33; i++) {
    let start = performance.now()
    const search = make(dataset)
    search('jk')
    const firstMs = performance.now() - start
    start = performance.now()
    for (let q = 0; q < 24; q++) search(cases[q % cases.length].query)
    const repeatedMs = (performance.now() - start) / 24
    if (i >= 2) {
      first.push(firstMs)
      repeated.push(repeatedMs)
    }
  }
  timings[name] = { setupAndFirstMs: median(first), repeatedPerQueryMs: median(repeated) }
}

const searchers = Object.fromEntries(Object.entries(adapters).map(([name, make]) => [name, make(rows)]))
const matches = cases.map(({ query, expected }) => ({
  query, expected,
  actual: Object.fromEntries(Object.entries(searchers).map(([name, search]) => [name, search(query)])),
}))
console.log(JSON.stringify({ node: process.version, arch: process.arch, timings, matches }, null, 2))
