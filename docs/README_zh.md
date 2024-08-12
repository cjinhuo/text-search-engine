# `text-search-engine`
基于动态规划的文本搜索引擎，支持中英文混合模糊搜索，并返回权重最高的匹配结果。

# 安装
```bash
npm i text-search-engine
```
## 支持环境
支持 `Node.js` 和 `Web` 环境。


# 使用
## search
### 纯英文搜索

### 纯中文搜索


### 中英文混合搜索


### 空格分词搜索
```javascript
```


| highlightMatches

# 性能
|      | 时间复杂度               | 空间复杂度               |
| ---- | ------------------------ | ------------------------ |
| 最优 | O(M(source))             | O(M(source))             |
| 最坏 | O(M(source) * N(target)) | O(M(source) * N(target)) |