<div align="center">
    <h2>Text Search Engine</h2>
    <p>支持中英文混合的模糊搜索引擎</p>
</div>

# 概览
[English README](../README.md)

基于动态规划的文本搜索引擎，支持中英文混合模糊搜索，并返回权重值最高的匹配结果。

## 谁在使用？
* [Blazwitcher: 一个光速搜索和切换标签，书签和历史的浏览器插件](https://chromewebstore.google.com/detail/blazwitcher-search-and-sw/fjgablnemienkegdnbihhemebmmonihg)

# 在线示例
可以进[线上示例](https://cjinhuo.github.io/text-search-engine/)试试搜索高亮的效果。

![online-demo](./online-demo.jpeg)

# 安装
```bash
npm i text-search-engine
```
## 支持环境
支持 `Node.js` 和 `Web` 环境。


# 使用
## search
### 纯英文搜索
```javascript
import { search } from 'text-search-engine'

const source = 'nonode'

search(source, 'no') //[[0, 1]]
// 匹配到 nod，连续文字的的权重值更高
search(source, 'nod') // [[2, 4]]
search(source, 'oo') // [[1, 1],[3, 3]]
```
`search('nonode', 'noe')` 匹配结果: <mark>no</mark>nod<mark>e</mark>

### 纯中文搜索
```javascript
import { search } from 'text-search-engine'

const source = '地表最强前端监控平台'

search(source, 'jk') // [[6, 7]]
search(source, 'qianduapt') // [[4, 5],[8, 9]]
```
`search('地表最强前端监控平台', 'qianduapt')` 匹配结果：地表最强<mark>前端</mark>监控<mark>平台</mark>


### 中英文混合搜索
```javascript
import { search } from 'text-search-engine'

search('Node.js 最强监控平台 V9', 'nodejk') //[[0, 3],[10, 11]]

const source_2 = 'a_nd你你的就是我的'
search(source_2, 'nd') //[[2, 3]]
// 匹配到 你你的
search(source_2, 'nnd') //[[4, 6]]
// 匹配到 a_'n'd你你的就'是我的'
search(source_2, 'nshwode') //[[2, 2],[8, 10]]
```
`search('Node.js 最强监控平台 V9', 'nodejk')` 匹配结果：<mark>Node</mark>.js 最强<mark>监控</mark>平台 V9


### 空格分词搜索
加空格后，每个词都是独立的，都会从头开始匹配，已匹配到的词会被移除，下次从头匹配时会忽略已匹配到的词

```javascript
const source_1 = 'Node.js 最强监控平台 V9'

search(source_1, 'jknode') // undefined
search(source_1, 'jk node') // [[10, 11],[0, 3]]
```
`search('Node.js 最强监控平台 V9', 'jk node')` 匹配结果：<mark>Node</mark>.js 最强<mark>监控</mark>平台 V9

### 类回溯
```javascript
const source_1 = 'zxhxo zhx'
search(source_1, 'zh') //[[6, 7]])
// 虽然连续的 'zh' 权重比较高，但后面的 'o' 没有匹配到字符，所以取前面
search(source_1, 'zho') //[[0, 0],[2, 2],[4, 4]])
```

## highlightMatches
这个 API 用于快速验证文本匹配高亮结果，返回 ANSI 转义符，在 Web 和 Node.js 中用 console.log 输出即可看到高亮文字。
```javascript
import { highlightMatches } from 'text-search-engine'
console.log(highlightMatches('Node.js 最强监控平台 V9', 'nodev9'))
```
控制台将输出：<mark>Node</mark>.js 最强监控平台 <mark>V9</mark>


# 性能
|      | 时间复杂度               | 空间复杂度               |
| ---- | ------------------------ | ------------------------ |
| 最优 | O(M(source))             | O(M(source))             |
| 最坏 | O(M(source) * N(target)) | O(M(source) * N(target)) |