'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var fs = require('fs-extra');
var path = require('path');
var parse = require('@changesets/parse');
var git = require('@changesets/git');
var chalk = require('chalk');
var pFilter = require('p-filter');
var logger = require('@changesets/logger');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__default = /*#__PURE__*/_interopDefault(path);
var parse__default = /*#__PURE__*/_interopDefault(parse);
var git__namespace = /*#__PURE__*/_interopNamespace(git);
var chalk__default = /*#__PURE__*/_interopDefault(chalk);
var pFilter__default = /*#__PURE__*/_interopDefault(pFilter);

let importantSeparator = chalk__default["default"].red("===============================IMPORTANT!===============================");
let importantEnd = chalk__default["default"].red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  // this needs to support just not dealing with dirs that aren't set up properly
  let changesets = await pFilter__default["default"](dirs, async (dir) => (await fs__namespace.lstat(path__default["default"].join(changesetBase, dir))).isDirectory());
  const changesetContents = changesets.map(async changesetDir => {
    const jsonPath = path__default["default"].join(changesetBase, changesetDir, "changes.json");
    const [summary, json] = await Promise.all([fs__namespace.readFile(path__default["default"].join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs__namespace.readJson(jsonPath)]);
    return {
      releases: json.releases,
      summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
} // this function only exists while we wait for v1 changesets to be obsoleted
// and should be deleted before v3


async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);

  if (oldChangesets.length === 0) {
    return [];
  }

  logger.warn(importantSeparator);
  logger.warn("There were old changesets from version 1 found");
  logger.warn("These are being applied now but the dependents graph may have changed");
  logger.warn("Make sure you validate all your dependencies");
  logger.warn("In a future major version, we will no longer apply these old changesets, and will instead throw here");
  logger.warn(importantEnd);
  return oldChangesets;
}

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newChangesets = await git__namespace.getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  });
  const newHashes = newChangesets.map(c => c.split("/")[1]);
  return changesets.filter(dir => newHashes.includes(dir));
}

async function getChangesets(cwd, sinceRef) {
  let changesetBase = path__default["default"].join(cwd, ".changeset");
  let contents;

  try {
    contents = await fs__namespace["default"].readdir(changesetBase);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("There is no .changeset directory in this project");
    }

    throw err;
  }

  if (sinceRef !== undefined) {
    contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef);
  }

  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  let changesets = contents.filter(file => !file.startsWith(".") && file.endsWith(".md") && file !== "README.md");
  const changesetContents = changesets.map(async file => {
    const changeset = await fs__namespace["default"].readFile(path__default["default"].join(changesetBase, file), "utf-8");
    return _objectSpread(_objectSpread({}, parse__default["default"](changeset)), {}, {
      id: file.replace(".md", "")
    });
  });
  return [...(await oldChangesetsPromise), ...(await Promise.all(changesetContents))];
}

exports["default"] = getChangesets;
