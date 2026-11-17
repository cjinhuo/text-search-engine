# text-search-engine

## 1.6.2

### Patch Changes

- fix: add the second reading of common heteronyms to the pinyin dictionary, so 银行 (yinhang), 成都 (chengdu), 大厦 (dasha) and 调整 (tiaozheng) match. Added readings: 行 hang, 都 du, 调 tiao, 厦 sha, 弹 tan, 单 shan/chan, 曾 zeng, 降 xiang, 解 xie, 大 dai, 落 la/lao @jayhemnani9910 · 2026-11-17 · [#00554ef9](https://github.com/cjinhuo/text-search-engine/commit/00554ef9995a2b05d8b26bca7dd8078a416f1fd8)
- fix: 为常见多音字补充第二个读音，使 银行、成都、大厦、调整 等词可以用拼音搜到 @jayhemnani9910 · 2026-11-17 · [#00554ef9](https://github.com/cjinhuo/text-search-engine/commit/00554ef9995a2b05d8b26bca7dd8078a416f1fd8)

## 1.6.1

### Patch Changes

- fix: preserve original search ranges and highlights when lowercasing expands characters @mradulsingh524.ms@gmail.com · 2026-11-16 · [#dace8814](https://github.com/cjinhuo/text-search-engine/commit/dace88142213304a43f04b57f3e11fc3873e03e0)
- fix: 修复字符转小写后展开导致的搜索坐标偏移和高亮重复 @mradulsingh524.ms@gmail.com · 2026-11-16 · [#dace8814](https://github.com/cjinhuo/text-search-engine/commit/dace88142213304a43f04b57f3e11fc3873e03e0)

## 1.6.0

### Minor Changes

- feat: add reusable bulk search with inferred multi-field highlights @cjinhuo · 2026-10-09 · [#5e2213f4](https://github.com/cjinhuo/text-search-engine/commit/5e2213f4e9347a0ba01aa01f6c867123a3fc56d4)
- feat: 新增可复用的批量搜索及自动推导的多字段高亮 @cjinhuo · 2026-10-09 · [#5e2213f4](https://github.com/cjinhuo/text-search-engine/commit/5e2213f4e9347a0ba01aa01f6c867123a3fc56d4)
- build: migrate the SDK and demo to TypeScript 7 with native declarations @cjinhuo · 2026-10-09 · [#5e2213f4](https://github.com/cjinhuo/text-search-engine/commit/5e2213f4e9347a0ba01aa01f6c867123a3fc56d4)
- build: 将 SDK 和演示迁移至 TypeScript 7 并使用原生声明生成 @cjinhuo · 2026-10-09 · [#5e2213f4](https://github.com/cjinhuo/text-search-engine/commit/5e2213f4e9347a0ba01aa01f6c867123a3fc56d4)

## 1.5.3

### Patch Changes

- perf: reduce search DP traversals with suffix-aware pruning @cjinhuo · 2026-08-14 · [#823e4da5](https://github.com/cjinhuo/text-search-engine/commit/823e4da5219d36bb588677d5381ee11e7c5c5f06)
- perf: 通过后缀可行边界剪枝减少搜索动态规划遍历 @cjinhuo · 2026-08-14 · [#823e4da5](https://github.com/cjinhuo/text-search-engine/commit/823e4da5219d36bb588677d5381ee11e7c5c5f06)
- chore: optimize isStrictnessSatisfied and refine unit test @cjinhuo · 2025-08-07 · [#96cbfa14](https://github.com/cjinhuo/text-search-engine/commit/96cbfa145916bc2b4074d0169edec337de23ccaf)
- chore: 优化 isStrictnessSatisfied 和补充单测 @cjinhuo · 2025-08-07 · [#96cbfa14](https://github.com/cjinhuo/text-search-engine/commit/96cbfa145916bc2b4074d0169edec337de23ccaf)

## 1.5.2

### Patch Changes

- chore: Use the full image address instead of a relative path @cjinhuo · 2025-07-23 · [#6af6d779](https://github.com/cjinhuo/text-search-engine/commit/6af6d7796b57d0314b37c5554fc4af2b52a31b08)
- chore: 在 readme 中使用完整的图片地址来代替相对路径 @cjinhuo · 2025-07-23 · [#6af6d779](https://github.com/cjinhuo/text-search-engine/commit/6af6d7796b57d0314b37c5554fc4af2b52a31b08)

## 1.5.2-beta.0

### Patch Changes

- chore: Use the full image address instead of a relative path @cjinhuo · 2025-07-23 · [#6af6d779](https://github.com/cjinhuo/text-search-engine/commit/6af6d7796b57d0314b37c5554fc4af2b52a31b08)
- chore: 在 readme 中使用完整的图片地址来代替相对路径 @cjinhuo · 2025-07-23 · [#6af6d779](https://github.com/cjinhuo/text-search-engine/commit/6af6d7796b57d0314b37c5554fc4af2b52a31b08)

## 1.5.1

### Patch Changes

- chore: optimize variable name and add annotation @cjinhuo · 2025-07-22 · [#09de1a7f](https://github.com/cjinhuo/text-search-engine/commit/09de1a7f5b44fd13290dc14466877e1ce597141b)
- chore: 优化变量名和新增代码注释 @cjinhuo · 2025-07-22 · [#09de1a7f](https://github.com/cjinhuo/text-search-engine/commit/09de1a7f5b44fd13290dc14466877e1ce597141b)
- chore: new gif to show online demo and a visualization of how the algorithm works @cjinhuo · 2025-07-23 · [#37583019](https://github.com/cjinhuo/text-search-engine/commit/37583019b094977984765a104d5f2891f5a19171)
- chore: 添加 gif 图来展示线上 demo 和可视化搜索算法工作原理 @cjinhuo · 2025-07-23 · [#37583019](https://github.com/cjinhuo/text-search-engine/commit/37583019b094977984765a104d5f2891f5a19171)

## 1.5.0

### Minor Changes

- 1ceaee6: Consecutive Word Matching: add isCharConsecutive search param

### Patch Changes

- 6acbe8e: fix search with isCharConsecutive

## 1.5.0-beta.0

### Minor Changes

- 1ceaee6: Consecutive Word Matching: add isCharConsecutive search param

### Patch Changes

- 6acbe8e: fix search with isCharConsecutive

## 1.4.4

### Patch Changes

- 3ab57cb: return in advance to optimize the number of iterations when not match valid character

## 1.4.3

### Patch Changes

- a53c856: refine homophone for '哪'

## 1.4.2

### Patch Changes

- 0680777: fix searchWithIndexOf function to remove target.trim()

## 1.4.1

### Patch Changes

- 88b152d: fix the issue of injecting dynamic style

## 1.4.0

### Minor Changes

- 00a9303: new option strictnessCoefficient for controlling if hitRange is expected

## 1.3.1

### Patch Changes

- sort the result of hitRanges and optimize HighlightWithRanges component to fix render error

## 1.3.0

### Minor Changes

- 1b99ee4: export new component 'HighlightWithTarget' and 'HighlightWithRanges' for react

## 1.3.0-beta.0

### Minor Changes

- 1b99ee4: export new component 'HighlightWithTarget' and 'HighlightWithRanges' for react

## 1.2.0

### Minor Changes

- d765a03: new option 'mergeSpaces' for merging blank spaces between raw hit ranges

## 1.1.0

### Minor Changes

- f32e541: support backtracking that would priority matching whole string

## 1.1.0-beta.0

### Minor Changes

- f32e541: support backtracking that would priority matching whole string

## 1.0.0

### Major Changes

- The first stable version

### Patch Changes

- 279774e: First Version
- d32e932: support multiple words seaching

## 1.0.0-beta.0

### Major Changes

- The first stable version

### Patch Changes

- 279774e: First Version
- d32e932: support multiple words seaching

## 0.0.1-beta.2

### Patch Changes

- 279774e: First Version
- d32e932: support multiple words seaching

## 0.0.1-beta.1

### Patch Changes

- d32e932: support multiple words seaching

## 0.0.1-beta.0

### Patch Changes

- 279774e: First Version
