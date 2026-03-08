'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

const clear = (options) => {
    const targets = options.targets || [];
    // 在rollup watch模式下，当recompile的时候是否clear，默认false
    const watch = options.watch === true ? true : false;
    const workspace = process.cwd();
    /**
     * 清楚目标路径
     *
     * @param {array} targets
     */
    const clear = (targets) => {
        for (let index = 0; index < targets.length; index++) {
            const e = targets[index];
            const target = path.resolve(workspace, e);
            if (fs.existsSync(target)) {
                rimraf.sync(target);
                console.log('cleared: ', target);
            }
        }
    };
    clear(targets);
    return {
        name: 'clear',
        load: (id) => {
            if (watch) {
                clear(targets);
            }
            return null;
        }
    };
};

module.exports = clear;
