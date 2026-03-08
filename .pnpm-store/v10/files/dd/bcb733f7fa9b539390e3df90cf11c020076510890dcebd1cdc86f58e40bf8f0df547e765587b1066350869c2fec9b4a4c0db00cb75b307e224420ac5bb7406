rollup-plugin-sizes [![NPM Version](https://img.shields.io/npm/v/rollup-plugin-sizes.svg)](https://www.npmjs.com/package/rollup-plugin-sizes) [![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Ftivac%2Frollup-plugin-sizes%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/tivac/rollup-plugin-sizes/goto?ref=main)
===========
<p align="center">
    <a href="https://www.npmjs.com/package/rollup-plugin-sizes" alt="NPM License"><img src="https://img.shields.io/npm/l/rollup-plugin-sizes.svg" /></a>
    <a href="https://www.npmjs.com/package/rollup-plugin-sizes" alt="NPM Downloads"><img src="https://img.shields.io/npm/dm/rollup-plugin-sizes.svg" /></a>
    <a href="https://david-dm.org/tivac/rollup-plugin-sizes" alt="Dependency Status"><img src="https://img.shields.io/david/tivac/rollup-plugin-sizes.svg" /></a>
    <a href="https://david-dm.org/tivac/rollup-plugin-sizes#info=devDependencies" alt="devDependency Status"><img src="https://img.shields.io/david/dev/tivac/rollup-plugin-sizes.svg" /></a>
</p>

Simple analysis on rollup bundling, helping you to spot libaries bloating up your bundles.

```
/src/index.js:
codemirror - 446.92 KB (35.94%)
remarkable - 193.72 KB (15.58%)
app - 95.87 KB (7.71%)
autolinker - 81.64 KB (6.57%)
lodash.filter - 62.77 KB (5.05%)
...
```

or with way more details!

```
/src/index.js:
codemirror - 446.92 KB (35.94%)
        lib\codemirror.js - 347.8 KB (77.82%)
        mode\javascript\javascript.js - 27.78 KB (6.22%)
        mode\markdown\markdown.js - 25.54 KB (5.72%)
        mode\meta.js - 14.44 KB (3.23%)
        mode\xml\xml.js - 12.52 KB (2.80%)
        addon\edit\closebrackets.js - 7.04 KB (1.58%)
        addon\edit\matchbrackets.js - 5.39 KB (1.21%)
        addon\comment\continuecomment.js - 3.59 KB (0.80%)
        addon\selection\active-line.js - 2.82 KB (0.63%)
remarkable - 193.72 KB (15.58%)
        lib\common\entities.js - 46.44 KB (23.97%)
        lib\rules.js - 10.2 KB (5.26%)
        lib\rules_block\list.js - 6.65 KB (3.43%)
        lib\ruler.js - 5.44 KB (2.81%)
        lib\rules_block\deflist.js - 5.22 KB (2.69%)
...
```

## Install

`$ npm i rollup-plugin-sizes -D`

## Usage

Add to your rollup build as the last plugin via JS API or Config file.

### JS API

```js
var rollup = require("rollup"),

    buble = require("rollup-plugin-buble"),
    sizes = require("rollup-plugin-sizes");

rollup.rollup({
    entry   : "src/main.js",
    plugins : [
        buble(),
        sizes()
    ]
}).then(function(bundle) {
    ...
});
```

## Config file

```js
import buble from 'rollup-plugin-buble';
import sizes from 'rollup-plugin-sizes';

export default {
    ...
    plugins : [
        buble(),
        sizes()
    ]
};
```

## Options

`details` - Set to true to enable file-by-file breakdowns of space usage.

`report` - Customize reporting. See [source code](index.js) for the default reporter.
