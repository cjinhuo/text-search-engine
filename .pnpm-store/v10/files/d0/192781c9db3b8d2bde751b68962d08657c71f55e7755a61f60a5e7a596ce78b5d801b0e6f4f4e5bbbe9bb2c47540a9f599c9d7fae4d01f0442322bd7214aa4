'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var assembleReleasePlan = require('@changesets/assemble-release-plan');
var readChangesets = require('@changesets/read');
var config = require('@changesets/config');
var getPackages = require('@manypkg/get-packages');
var pre = require('@changesets/pre');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var assembleReleasePlan__default = /*#__PURE__*/_interopDefault(assembleReleasePlan);
var readChangesets__default = /*#__PURE__*/_interopDefault(readChangesets);

async function getReleasePlan(cwd, sinceRef, passedConfig) {
  const packages = await getPackages.getPackages(cwd);
  const preState = await pre.readPreState(cwd);
  const readConfig = await config.read(cwd, packages);
  const config$1 = passedConfig ? _objectSpread(_objectSpread({}, readConfig), passedConfig) : readConfig;
  const changesets = await readChangesets__default["default"](cwd, sinceRef);
  return assembleReleasePlan__default["default"](changesets, packages, config$1, preState);
}

exports["default"] = getReleasePlan;
