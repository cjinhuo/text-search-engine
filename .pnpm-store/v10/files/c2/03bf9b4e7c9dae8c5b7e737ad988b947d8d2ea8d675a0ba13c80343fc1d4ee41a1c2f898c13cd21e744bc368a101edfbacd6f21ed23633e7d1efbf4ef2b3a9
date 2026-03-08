'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chalk = require('chalk');
var util = require('util');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefault(chalk);
var util__default = /*#__PURE__*/_interopDefault(util);

let prefix = "🦋 ";

function format(args, customPrefix) {
  let fullPrefix = prefix + (customPrefix === undefined ? "" : " " + customPrefix);
  return fullPrefix + util__default["default"].format("", ...args).split("\n").join("\n" + fullPrefix + " ");
}

function error(...args) {
  console.error(format(args, chalk__default["default"].red("error")));
}
function info(...args) {
  console.info(format(args, chalk__default["default"].cyan("info")));
}
function log(...args) {
  console.log(format(args));
}
function success(...args) {
  console.log(format(args, chalk__default["default"].green("success")));
}
function warn(...args) {
  console.warn(format(args, chalk__default["default"].yellow("warn")));
}

exports.error = error;
exports.info = info;
exports.log = log;
exports.prefix = prefix;
exports.success = success;
exports.warn = warn;
