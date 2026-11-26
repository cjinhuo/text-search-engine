# Pinyin search selection: reproducible comparison

From this directory, using Node.js 24 and npm:

```sh
npm ci --ignore-scripts
node compare.mjs
```

The npm lockfile pins the published packages. This isolated fixture does not add
dependencies to the workspace or demo. The first assertions also verify the
documented initials, multi-field and highlight examples against the npm package.

- **Quality:** Seven hand-written records and eight queries. Expected IDs reflect
  what a user might expect for this fixture, not a comprehensive relevance
  judgment. Results are printed in returned order. See [one saved run](sample-2026-11-26.json)
  (2026-11-26, Linux x64, AMD EPYC 9V74, Node.js 24.22.3).
- **Timing:** Each adapter sees the same deterministic 1,000 records with suffixes.
  Setup + first query starts before creating the adapter and ends after the
  `jk` lookup and result-ID projection. Repeated-query timings cover 24 mixed
  lookups reusing that adapter. The script discards two warmup rounds per
  adapter and reports median values across 31 rounds; these are not
  process-cold starts. Rendering, module import and normalizing
  highlight coordinates are not part of the timed workload.
- **Adapters:** Text Search Engine uses the same title and host through
  `getFields`. For pinyin-pro, the adapter scans the combined strings using
  `match`. Fuse.js indexes the original text, full Pinyin, and initials of the
  same strings; it uses `threshold: 0.3` and `ignoreLocation: true`. No offset
  remapping is implemented for its derived fields.

This compares particular recipes, not every configuration of these libraries.
Use your own records, query distribution, and expected matches before treating
the timings or match counts as selection criteria.
