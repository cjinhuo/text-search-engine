# perf-regexes

Optimized and powerful regexes for JavaScript

[![npm Version][npm-badge]][npm-url]
[![License][license-badge]][license-url]
[![Build Status][build-badge]][build-url]
[![Bundle Size][size-badge]][size-url]

## Breaking Changes

In ES5, matching literal regexes with other regex in medium complexity code is highly risky.<br>In ES6 it is practically impossible.

For this reason, as of v1.0 `JS_REGEX_P` is deprecated and will be removed in the next minor version.

`JS_REGEX` will be maintained, but its use should be limited to complement other utilities, such as [skip-regex](https://github.com/aMarCruz/skip-regex), which uses a customized version of `JS_REGEX` to identify regular expresions reliably.

The minimum supported version of NodeJS now is 6.14 (oldest maintained LTS version w/fixes).

## Install

```sh
npm install perf-regexes --save
# or
yarn add perf-regexes
```

In the browser, this loads perf-regexes in the global `R` object:

```html
<script src="https://unpkg.com/perf-regexes/index.min.js"></script>
```

## Included Regexes

All of these regexes recognize Win/Mac/Unix line-endings and are ready to be used, but you can customize them using the `RegExp` constructor and the `source` property of the desired regex.

HTML:

Name       | Flags | Matches
---------- | :---: | -------
HTML_CMNT  | g     | Valid HTML comments, according to the [SGML](https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.4) standard.

JavaScript:

Name       | Flags | Matches
---------- | :---: | -------
JS_MLCMNT  | g     | Multiline JS comment, with support for embedded `'/*'` sequences.
JS_SLCMNT  | g     | Single-line JS comments, not including its line-ending.
JS_DQSTR   | g     | Double quoted JS string, with support for escaped quotes and line-endings.
JS_SQSTR   | g     | Single quoted JS string, with support for escaped quotes and line-endings.
JS_STRING  | g     | Combines `JS_SQSTR` and `JS_DQSTR` to match single or double quoted strings.
JS_REGEX   | g     | Regex. **Note:** The result must be validated.
JS_REGEX_P | g     | _Deprecated, do not use it._

Selection of lines:

Name            | Flags | Matches
--------------- | :---: | -------
EMPTY_LINES     | gm    | Empty line or line with only whitespace within, including its line-ending, if it has one.
NON_EMPTY_LINES | gm    | Line with at least one non-whitespace character, including its line-ending, if it has one.
TRAILING_WS     | gm    | The trailing whitespace of a line, without including its line-ending.
OPT_WS_EOL      | g     | Zero or more blank characters followed by a line-ending, or the final blanks, if the (last) line has no line-ending.
EOL             | g     | Line-ending of any type

### NOTE

Because the `'g'` flag, always set `lastIndex` or clone the regex before using it with the `exec` method.

## Example

Using only one regex, this simple example will...

- Remove trailing whitespace of each line.
- Remove the empty lines.
- Normalize the line-endings to unix style.

```js
const R = require('perf-regexes')

const cleaner = (text) => text.split(R.OPT_WS_EOL).filter(Boolean).join('\n')

console.dir(cleaner(' \r\r\n\nAA\t\t\t\r\n\rBB\nCC  \rDD  '))
// ⇒ 'AA\nBB\nCC\nDD'
```

Use the previous function to cleanup HTML text:

```js
const htmlCleaner = (html) => cleaner(html.replace(R.HTML_CMNT, ''))

console.dir(htmlCleaner(
  '\r<!--header--><h1>A</h1>\r<div>B<br>\r\nC</div> <!--end-->\n'))
// ⇒ '<h1>A</h1>\n<div>B<br>\nC</div>'
```

### Line-endings Normalization

```js
const R = require('perf-regexes')

const normalize = (text) => text.split(R.EOL).join('\n')

console.dir(normalize('\rAA\r\r\nBB\r\nCC \nDD\r'))
// ⇒ '\nAA\n\nBB\nCC \nDD\n'
```

### Double-quoted to single-quoted strings

```js
const toSingleQuotes = (text) => text.replace(R.JS_STRING, (str) => {
  return str[0] === '"'
    ? `'${str.slice(1, -1).replace(/'/g, "\\'")}'`
    : str
})

console.log(toSingleQuotes(`"A's" 'B' "C"`))
// ⇒ 'A\'s' 'B' 'C'
```

### Matching Regexes

With the arrival of [ES6TL](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) and new keywords, finding literal regexes with another regex is not viable, you need a JS parser such as [acorn](https://www.npmjs.com/package/acorn) or a specialized one such as [skip-regex](https://www.npmjs.com/package/skip-regex) to do it correctly.

This is a very basic example that uses skip-regex:

```js
import R from 'perf-regexes'
import skipRegex from 'skip-regex'

/**
 * Source to match quoted string, comments, and slashes.
 * Captures en $1 the slash
 */
const reStr = `${R.JS_STRING.source}|${R.JS_MLCMNT.source}|${R.JS_SLCMNT.source}|(/)`

/**
 * Search regexes in `code` and display the result to the console.
 */
const searchRegexes = (code) => {

  // Creating `re` here keeps its lastIndex private
  const re = RegExp(reStr, 'g')
  let match = re.exec(code)

  while (match) {
    if (match[1]) {
      const start = match.index
      const end = skipRegex(code, start)

      // skipRegex returns start+1 if this is not a regex
      if (end > start + 1) {
        console.log(`Found "${code.slice(start, end)}" at ${start}`)
      }
      re.lastIndex = end
    }
    match = re.exec(code)
  }
}

const code = `
const A = 2
const s = '/A/'            // must not find /A/

const re1 = /A/g           // regex
re1.lastIndex = 2 /A/ 1    // must not find /A/

/* /B/                     // must not find /B/
*/
const re2 = /B/g           // regex
re1.exec(s || "/B/")       // must not find /B/
`

searchRegexes(code)
// output:
// Found "/A/g" at 74
// Found "/B/b" at 210
```

The previous code does not support ES6TL, but it works quite well on ES5 files and is very fast.

For a more complete example of using perf-regexes, see [js-cleanup](https://github.com/aMarCruz/js-cleanup), an advanced utility with support for ES6 that trims trailing spaces, compacts empty lines, normalizes line-endings, and removes comments conditionally.

### ES6 Template Literals

ES6TLs are too complex to be identified by one single regex, do not even try.

## Support my Work

I'm a full-stack developer with more than 20 year of experience and I try to share most of my work for free and help others, but this takes a significant amount of time and effort so, if you like my work, please consider...

[<img src="https://amarcruz.github.io/images/kofi_blue.png" height="36" title="Support Me on Ko-fi" />][kofi-url]

Of course, feedback, PRs, and stars are also welcome 🙃

Thanks for your support!

## License

The [MIT License](LICENCE) (MIT)

[build-badge]:    https://img.shields.io/travis/aMarCruz/perf-regexes.svg
[build-url]:      https://travis-ci.org/aMarCruz/perf-regexes
[npm-badge]:      https://img.shields.io/npm/v/perf-regexes.svg
[npm-url]:        https://www.npmjs.com/package/perf-regexes
[license-badge]:  https://img.shields.io/npm/l/express.svg
[license-url]:    badge://github.com/aMarCruz/perf-regexes/blob/master/LICENSE
[size-badge]:     https://badgen.net/bundlephobia/min/perf-regexes
[size-url]:       https://bundlephobia.com/result?p=perf-regexes
[kofi-url]:       https://ko-fi.com/C0C7LF7I
