# rollup-plugin-cleanup changes

## \[3.2.1] - 2020-09-22

### Changed

- Fixed #16 ? Thanks to @Aqours, @gevalo1 & @xania for repoting this issue
- Using js-cleanup v1.2.0 and Rollup v2.0 and above
- Requires NodeJS v10.14.2 or v12.0 and above
- Updated dependencies

## \[3.1.1] - 2019-01-18

### Changed

- Update dependencies.

### Fixed

- #15 : Version 3.1.0 fails for certain template literals. Thanks to @stotter for repoting this issue.

## \[3.1.0] - 2018-12-27

Bye, acorn.

Although [acorn](https://github.com/acornjs/acorn) is an excellent parser, its use in rollup-plugin-cleanup had caused several issues.

v3.1 removes this dependency and now is completely based on [js-cleanup](https://github.com/aMarCruz/js-cleanup), which does not depend on acorn or another similar parser, with the advantage of a relative independency of the version and "dialect" of JavaScript and a little more efficiency, for being a specialized tool.

While js-cleanup is in its first version, I do not expect it to present major problems (the algorithm and the JS rules used for the replacement are fairly simple).

### Added

- `compactComment` option to control the compaction of multiline comments, useful to preserve the format of JSDoc blocks.
- The `flow` filter for Facebook Flow comments and directives.
- The `ts` filter for MS TypeScript directives.
- TypeScript definitions.
- Link to kofi.

### Changed

- The options `ecmaVersion`, `sourceType`, and `acornOptions` are ignored, acorn was removed in this version.
- The `normalizeEols` option is deprecated in favor of `lineEndings`, which have the same behavior.
- The `some` filter no longer includes `@cc_on`, but adds comments that begin with `'!'`.
- The `jscs` filter is deprecated, jscs no longer exists.
- Updated AppVeyor and Travis settings.
- Updated format of the Changelog.
- Updated devDependencies.
- Replaced Jest with mocha, due to issues with coverage.

### Fixed

- Closes #13, acorn was removed in this version.
- Coverage generation and badge.

### Removed

- Dependency on Jest, due to incompatibilities.
- Dependency on the acorn parser.

## \[3.0.0] - 2018-07-06

- Add an example of using Acorn plugin the README.
- New option `acornOptions`, for advanced usage.
  This is an optional, plain JS object with additional settings passed to the [Acorn](https://github.com/acornjs/acorn) parser. Properties of this object are merged with, and take precedence over, the existing `ecmaVersion` and `sourceType` options.
- The mimimum node version is now 6.14, for compatibility with ESLint 5.
- Updated devDependencies.

### From v3.0.0-beta.1 (Unreleased)

- Removed the [riot](http://riotjs.com/) .tag extension from the defaults, you can add this manually.
- Now acorn `ecmaVersion` defaults to 9 (ES2018).
- Closes #10 : Errors out on spread operator.
- Updated devDependencies the to last acorn and rollup plugins.

## \[2.0.1] - 2018-04-10

- Adds rollup >=0.50 as peerDependencies, hope to update devDependencies soon\*.
- Preserves empty lines inside multi-line strings.
- Welcome to @mkhl to the rollup-plugin-cleanup team!

\* MagicString v0.24.x has great enhancements, but it needs testing with this plugin.

## \[2.0.0] - 2017-10-19

- Requires node v4.2 or later.
- Emission of source map honors the Rollup `sourceMap` or `sourcemap` (lowercased) options.
- Generated errors are displayed through the standard Rollup's `error` method.
- Fixed tests to match rollup v0.48.x parameters and async operation.
- Now the plugin operation is async and returns a Promise.
- Using facebook [jest](http://facebook.github.io/jest/) for tests.

## \[1.0.1] - 2017-06-14

- New filter `"ts3s"` to preserve TypeScript [Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) (See NOTE)
- Closes #5 : cleanup didn't generate a sourcemap for the transformation.
- Some refactorization to speed up some operations.
- Updated devDependencies.

*NOTE:*

TypeScript source must be already compiled to JavaScript.

## \[1.0.0] - 2017-01-10

- Improved regex to detect empty lines.
- Fixed minor bug not processing the input when there's no empty spaces or lines to remove.
- Fixed tests to match rollup v0.40.x output.
- Changed default Acorn `ecmaVersion` from 6 to 7 to allow parsing ES2017 (See [rollup#492](https://github.com/rollup/rollup/issues/492)).
- Updated devDependencies.
- 100% test coverage.

## \[0.1.4] - 2016-09-12

- Default `extensions` are changed from `"*"` to `['.js', '.jsx', '.tag']` to avoid conflicts with other plugins.
- The `extensions` option is case-sensitive by consistency with rollup plugins.

## \[0.1.3] - 2016-09-12

- The string passed to the comment filters now includes a character preceding the content, `"/"` for one-line comments, and `"*"` for multiline comments.
- Adds note to the README about the usage of cleanup as post-processor - See issue [#1](https://github.com/aMarCruz/rollup-plugin-cleanup/issues/1)
- Now, the default for `extensions` is `"*"`. Because _rollup_ is a JavaScript bundler and _cleanup_ is a JavaScript post-processor, it should to work with any file handled by _rollup_.

## \[0.1.2] - 2016-09-08

- Implements support for the removal of comments through configurable filters, using the [acorn](https://github.com/ternjs/acorn) parser for secure detection.
- Fix the `lint` script of npm.

## \[0.1.1] - 2016-09-06

- The generated files includes CommonJS & ES6 module versions, already transpiled.
- Fixes an error when the last empty line does not ends with eol.
- Fixes errors in the build of previous versions (incomplete `dist` folder).
- Fix Travis config, now using ESLint in the test for node 4+
- Adds automatized test for Windows, with the [AppVeyor](https://ci.appveyor.com/) service.

## \[0.1.0] - 2016-09-05

First public release.
