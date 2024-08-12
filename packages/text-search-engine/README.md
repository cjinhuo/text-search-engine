# Overview
A text search engine that relies on a dynamic programming algorithm and supports fuzzy search with pinyin.
## support 
* Web
* Node

## API
```js
import { search } from 'text-search-engine'

const range_1 = search('nonode', 'no') // [[0,1]]
const range_2 = search('nonode', 'nod') // [[2,4]]

```