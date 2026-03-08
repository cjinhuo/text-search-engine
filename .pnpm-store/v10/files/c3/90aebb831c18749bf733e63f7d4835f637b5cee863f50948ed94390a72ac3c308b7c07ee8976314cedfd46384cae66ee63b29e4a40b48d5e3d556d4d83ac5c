'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var fs = require('fs-extra');
var humanId = require('human-id');
var path = require('path');
var prettier = require('prettier');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var humanId__default = /*#__PURE__*/_interopDefault(humanId);
var path__default = /*#__PURE__*/_interopDefault(path);
var prettier__default = /*#__PURE__*/_interopDefault(prettier);

function getPrettierInstance(cwd) {
  try {
    return require(require.resolve("prettier", {
      paths: [cwd]
    }));
  } catch (err) {
    if (!err || err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }

    return prettier__default["default"];
  }
}

async function writeChangeset(changeset, cwd) {
  const {
    summary,
    releases
  } = changeset;
  const changesetBase = path__default["default"].resolve(cwd, ".changeset"); // Worth understanding that the ID merely needs to be a unique hash to avoid git conflicts
  // experimenting with human readable ids to make finding changesets easier

  const changesetID = humanId__default["default"]({
    separator: "-",
    capitalize: false
  });
  const prettierInstance = getPrettierInstance(cwd);
  const newChangesetPath = path__default["default"].resolve(changesetBase, `${changesetID}.md`); // NOTE: The quotation marks in here are really important even though they are
  // not spec for yaml. This is because package names can contain special
  // characters that will otherwise break the parsing step

  const changesetContents = `---
${releases.map(release => `"${release.name}": ${release.type}`).join("\n")}
---

${summary}
  `;
  await fs__default["default"].outputFile(newChangesetPath, // Prettier v3 returns a promise
  await prettierInstance.format(changesetContents, _objectSpread(_objectSpread({}, await prettierInstance.resolveConfig(newChangesetPath)), {}, {
    parser: "markdown"
  })));
  return changesetID;
}

exports["default"] = writeChangeset;
