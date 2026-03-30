---
name: "text-search-engine"
description: "Guides users to integrate text-search-engine SDK for Chinese/English fuzzy search with Pinyin support. Invoke when user wants to add fuzzy search, pinyin search, or text matching."
---

# Text Search Engine 接入指南

此 skill 帮助你将 **text-search-engine** SDK 集成到项目中。该 SDK 是一个基于动态规划的文本搜索引擎，支持中英文混合模糊搜索，返回权重最高的匹配结果。

## 安装

```bash
npm i text-search-engine
```

同时支持 `Node.js` 和 `Web` 环境。

## 核心 API

### 1. `search(source, query, options?)` - 主搜索函数

返回匹配位置的索引范围数组 `[start, end][]`，无匹配时返回 `undefined`。

#### 基本用法

```javascript
import { search } from 'text-search-engine'

// 纯英文搜索
search('nonode', 'no')    // [[0, 1]] - 匹配 'no'
search('nonode', 'nod')   // [[2, 4]] - 匹配 'nod'
search('nonode', 'noe')   // [[0, 1], [5, 5]] - 匹配 'no' + 'e'

// 纯中文搜索（支持拼音）
search('地表最强前端监控平台', 'jk')        // [[6, 7]] - 匹配 '监控'
search('地表最强前端监控平台', 'qianduapt') // [[4, 5], [8, 9]] - 匹配 '前端' + '平台'

// 中英文混合搜索
search('Node.js 最强监控平台 V9', 'nodejk') // [[0, 3], [10, 11]] - 匹配 'Node' + '监控'
```

#### 空格分隔搜索

添加空格使每个词独立匹配，从头开始：

```javascript
search('Node.js 最强监控平台 V9', 'jknode')    // undefined
search('Node.js 最强监控平台 V9', 'jk node')   // [[10, 11], [0, 3]] - 可以匹配！
```

### 2. 配置选项

| 选项                    | 默认值      | 说明                                                                                |
| ----------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `mergeSpaces`           | `true`      | 将匹配结果中的空格合并为连续范围                                                    |
| `strictnessCoefficient` | `undefined` | 严格系数（0-1），匹配字符数 ≤ `ceil(query.length * coefficient)` 时返回 `undefined` |
| `isCharConsecutive`     | `false`     | 要求匹配的字符必须连续                                                              |
| `strictCase`            | `false`     | 区分大小写匹配                                                                      |

#### 示例

```javascript
// mergeSpaces - 合并空格
search('chrome 应用商店', 'meyinyon', { mergeSpaces: false }) // [[4, 5], [7, 8]]
search('chrome 应用商店', 'meyinyon', { mergeSpaces: true })  // [[4, 8]]

// strictnessCoefficient - 严格系数
search('Node.js 最强监控平台 V8', 'nozjk', { strictnessCoefficient: 0.5 }) // [[0, 1], [8, 8], [10, 11]]
search('Node.js 最强监控平台 V8', 'nozjk', { strictnessCoefficient: 0.4 }) // undefined

// isCharConsecutive - 连续字符
search('Chinese@中国 People-人', 'chie')                              // [[0, 2], [4, 4]]
search('Chinese@中国 People-人', 'chie', { isCharConsecutive: true }) // undefined

// strictCase - 大小写敏感
search('Hello World', 'hello')                        // [[0, 4]]
search('Hello World', 'hello', { strictCase: true })  // undefined
```

### 3. `highlightMatches(source, query)` - 快速高亮

返回 ANSI 转义码，用于控制台输出：

```javascript
import { highlightMatches } from 'text-search-engine'

console.log(highlightMatches('Node.js 最强监控平台 V9', 'nodev9'))
// 输出带高亮的文本
```

## React 组件

### HighlightWithTarget

自动匹配并高亮：

```jsx
import { HighlightWithTarget } from 'text-search-engine/react'

function SearchResult() {
  return <HighlightWithTarget source='Node.js 最强监控平台 V9' target='nodejk' />
}
```

### HighlightWithRanges

手动提供匹配范围：

```jsx
import { HighlightWithRanges } from 'text-search-engine/react'
import { search } from 'text-search-engine'

function SearchResult() {
  const ranges = search('Node.js 最强监控平台 V9', 'nodejk')
  return <HighlightWithRanges source='Node.js 最强监控平台 V9' hitRanges={ranges} />
}
```

## 常见集成模式

### 1. 带高亮的搜索列表

```jsx
import { search } from 'text-search-engine'
import { HighlightWithRanges } from 'text-search-engine/react'

function SearchList({ items, query }) {
  const results = items
    .map(item => ({ item, ranges: search(item.name, query) }))
    .filter(({ ranges }) => ranges !== undefined)

  return (
    <ul>
      {results.map(({ item, ranges }) => (
        <li key={item.id}>
          <HighlightWithRanges source={item.name} hitRanges={ranges} />
        </li>
      ))}
    </ul>
  )
}
```

### 2. 复用 BoundaryData 进行多次搜索

当需要对同一数据源进行多次搜索时，可以预先提取 `boundaryData` 以提升性能：

```javascript
import { 
  extractBoundaryMapping, 
  searchSentenceByBoundaryMapping 
} from 'text-search-engine'

const source = 'Node.js 最强监控平台 V9'

// 预先提取 boundaryData（只需执行一次）
const boundaryData = extractBoundaryMapping(source)

// 多次搜索复用同一个 boundaryData
function searchMultiple(queries) {
  return queries.map(query => {
    const { hitRanges, wordHitRangesMapping } = searchSentenceByBoundaryMapping(boundaryData, query)
    return { query, hitRanges, wordHitRangesMapping }
  }).filter(result => result.hitRanges !== undefined)
}

// 示例：对同一数据源进行多次搜索
const results = searchMultiple(['node', 'jk', 'v9', 'qianduan'])
```

这种方式特别适合以下场景：
- 搜索列表中对每个 item 需要匹配多个关键词
- 实时搜索建议，用户输入变化时复用已处理的数据
- 批量搜索任务

### 3. Node.js 后端搜索

```javascript
import { search } from 'text-search-engine'

function searchDocuments(documents, query, options = {}) {
  const { limit = 20, strictnessCoefficient = 0.6 } = options
  
  const results = []
  
  for (const doc of documents) {
    const ranges = search(doc.title, query, { strictnessCoefficient })
    if (ranges) {
      results.push({ doc, ranges })
      if (results.length >= limit) break
    }
  }
  
  return results
}
```

## 性能

|      | 时间复杂度                   | 空间复杂度 |
| ---- | ---------------------------- | ---------- |
| 最优 | O(M)，M = 源字符串长度       | O(M)       |
| 最差 | O(M × N)，N = 查询字符串长度 | O(M × N)   |

## 相关资源

- [在线演示](https://cjinhuo.github.io/text-search-engine/)
- [算法可视化](https://cjinhuo.github.io/text-search-engine/visual)
- [CodeSandbox React 示例](https://codesandbox.io/p/sandbox/text-search-engine-component-22c5m5)
