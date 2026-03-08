# js-cleanup

[![License][license-badge]][license-url]
[![npm Version][npm-badge]][npm-url]
[![Travis][travis-badge]][travis-url]
[![AppVeyor][appveyor-badge]][appveyor-url]
[![Coverage][coverage-badge]][coverage-url]
[![Code Quality][codacy-badge]][codacy-url]
[![Maintainability][climate-badge]][climate-url]

Smart comment and whitespace cleaner for JavaScript-like files.

With js-cleanup you have:

- Compaction of empty lines within multiline comments and/or out of them.
- Normalization of line endings to Unix, Mac, or Windows.
- Removal of JavaScript comments through powerful, configurable filters.
- Removal of trailing whitespace of each line.
- TypeScript definitions.
- Sourcemap support.

Although js-cleanup is not locked to a particular JavaScript dialect and can handle any JS-like file: TypeScript, Flow, React, ES9, etc, it is mainly a _postprocessor_, so it should be runned in a later stage of your toolchain, after any preprocessor or transpiler.

js-cleanup requires node v10.14.2 or above, but **avoid the buggy v11.x**

**Why not Uglify?**

Uglify is a excelent _minifier_ but you have little control over the results, while with js-cleanup your coding style remains intact and the removal of comments is strictly under your control.

## Support my Work

I'm a full-stack developer with more than 20 year of experience and I try to share most of my work for free and help others, but this takes a significant amount of time and effort so, if you like my work, please consider...

[<img src="https://amarcruz.github.io/images/kofi_blue.png" height="36" title="Support Me on Ko-fi" />][kofi-url]

Of course, feedback, PRs, and stars are also welcome 🙃

Thanks!

## Install

```bash
$ npm install js-cleanup -D
# or
$ yarn add js-cleanup -D
```

## Usage

```typescript
jsCleanup(sourceCode: string, fileName?: string | null, options?: Options): Result;
```

### Result

The result is a plain JS object of this type:

```typescript
type Result = {
  code: string;
  map?: object | null;
};
```

| Name | Description                                                                                      |
| ---- | ------------------------------------------------------------------------------------------------ |
| code | The processed code.                                                                              |
| map  | A raw sourcemap object, or `null` if the text did not change.<br>Undefined if `sourcemap:false`. |

### Options

Type definition:

```typescript
type Options = {
  comments?: string | RegExp;
  compactComments?: boolean;
  maxEmptyLines?: number; // use -1 to preserve all the lines
  lineEndings?: string; // 'mac' | 'unix' | 'win'
  sourcemap?: boolean;
  sourcemapOptions: {
    includeContent?: boolean;
    inlineMap?: boolean;
    hires?: boolean;
  };
};
```

| Name               | Default | Description                                                                                                                                      |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| comments           | 'some'  | Filter or array of filters that determinates which comments should be preserved.<br>Use "all" to keep all, or "none" to remove all the comments. |
| compactComments    | true    | Should js-cleanup also compact whitespace and blank lines in the preserved multiline comments?<br>Line-ending normalization is always done.      |
| maxEmptyLines      | 0       | Maximum successive empty lines to preserve in the output.<br>Use a positive value, or -1 to preserve all the lines                               |
| lineEndings        | 'unix'  | Type of Line-ending for normalization: "unix", "mac", "win".                                                                                     |
| sourcemap          | true    | Should js-cleanup generate a sourcemap?                                                                                                          |
| _sourcemapOptions_ | -       |
| includeContent     | false   | Include the original source text in the sourcemap?                                                                                               |
| inlineMap          | false   | Inline the sourcemap in the processed text?                                                                                                      |
| hires              | true    | Should a hi-res sourcemap be generated?                                                                                                          |

_**Note:**_\
_If you want to keep JSDoc comments, you should also set `compactComments: false`._\
_Since the JSDoc presentation depends on empty lines, these should be controlled by you._

## Predefined Comment Filters

Instead the special 'all' or 'none' keywords, you can use any combination of custom filters along with any of these predefined ones:

| Name     | Will preserve...                                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| some     | Comments containing "@license", "@preserve", or starting with "!".                                                                                                                                                                                      |
| license  | Comments containing "@license".                                                                                                                                                                                                                         |
| eslint   | [ESLint](http://eslint.org/docs/user-guide/configuring) directives.                                                                                                                                                                                     |
| flow     | Facebook [Flow](https://flow.org/en/docs) directives, [comment types](https://flow.org/en/docs/types/comments/), and [flowlint](https://flow.org/en/docs/linting/flowlint-comments/) comments.                                                          |
| istanbul | [istanbul](https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md) ignore comments.                                                                                                                                           |
| jsdoc    | [JSDoc](http://usejsdoc.org/) comments.                                                                                                                                                                                                                 |
| jshint   | [JSHint](http://jshint.com/docs/#inline-configuration) directives.                                                                                                                                                                                      |
| jslint   | [JSLint](http://www.jslint.com/help.html) directives.                                                                                                                                                                                                   |
| sources  | Sourcemap directives [sourceURL](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl) and [sourceMappingURL](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.9ppdoan5f016). |
| ts       | MS [TypeScript](http://www.typescriptlang.org/) Triple-Slash and @ts-\* directives, plus the @jsx pragma.                                                                                                                                               |
| ts3s     | TypeScript [Triple-Slash](http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) directives.                                                                                                                                         |

_**Note:**_\
_Since none of this filters is really accurate (js-cleanup is not a parser), they are suitable for the job without introducing greater complexity._

See the regexes in [src/predef-filters.ts](https://github.com/aMarCruz/js-cleanup/blob/master/src/predef-filters.ts)

### Custom Filters

A custom filter is a regex that must match the content of the comments that you want to preserve.

The content of the comments tested by each filter does not includes the first slash, nor the `*/` terminator of the multiline comments, so the multiline comments begins with an asterisk (`*`) and single-line comments begins with a slash (`/`).

For example, the following filters will preserve ESLint directives and _multiline_ comments starting with a dash:

```js
const cleanedCode = jsCleanup(code, null, {
  comments: ["eslint", /^\*-/],
});
```

## License

The [MIT][license-url] License

&copy; 2018-2020 Alberto Martínez

[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: https://github.com/aMarCruz/js-cleanup/blob/master/LICENSE
[npm-badge]: https://img.shields.io/npm/v/js-cleanup.svg
[npm-url]: https://www.npmjs.com/package/js-cleanup
[appveyor-badge]: https://img.shields.io/appveyor/ci/aMarCruz/js-cleanup/master.svg?label=appveyor
[appveyor-url]: https://ci.appveyor.com/project/aMarCruz/js-cleanup
[travis-badge]: https://img.shields.io/travis/aMarCruz/js-cleanup/master.svg?label=travis
[travis-url]: https://travis-ci.org/aMarCruz/js-cleanup
[coverage-badge]: https://img.shields.io/codecov/c/github/aMarCruz/js-cleanup.svg
[coverage-url]: https://codecov.io/gh/aMarCruz/js-cleanup
[codacy-badge]: https://img.shields.io/codacy/grade/1534ad8a654346b78ccb827dabe0bfa8/master.svg
[codacy-url]: https://www.codacy.com/app/aMarCruz/js-cleanup?utm_source=github.com&utm_medium=referral&utm_content=aMarCruz/js-cleanup&utm_campaign=Badge_Grade
[climate-badge]: https://img.shields.io/codeclimate/maintainability/aMarCruz/js-cleanup.svg
[climate-url]: https://codeclimate.com/github/aMarCruz/js-cleanup/maintainability
[kofi-url]: https://ko-fi.com/C0C7LF7I
