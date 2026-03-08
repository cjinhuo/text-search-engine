# rollup-plugin-clear
Rollup clear plugin
### Installation
```shell
npm install --save-dev rollup-plugin-clear
```
### Usage
```javascript
// rollup.config.js
import clear from 'rollup-plugin-clear'

const config = {
    // ...
    plugins: [
        // ...
        clear({
            // required, point out which directories should be clear.
            targets: ['some directory'],
            // optional, whether clear the directores when rollup recompile on --watch mode.
            watch: true, // default: false
        })
    ]
}

export default config;
```
This plugin can help you to clear the specific directories when the rollup bundle your resource.