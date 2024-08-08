# Overview

## API
```js
import match from 'word-match'
match.match(string, words)

const originalString = '黑神话悟空black'
const input = 'ha'
const hitIndices = matchPinyin(getBoundary(originalString), input)
console.log('hitIndices', hitIndices)
console.log('original string:', originalString, 'input:', input)
console.log(highlightTextWithRanges(originalString, hitIndices))
```