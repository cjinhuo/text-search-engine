/* eslint-disable max-len */

//#region HTML ---------------------------------------------------------------

/**
 * Valid HTML comments, according to the SGML standard.
 * @see https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.4
 * @type {RegExp}
 */
export var HTML_CMNT = /<!--(?:>|[\S\s]*?--\s*>)/g

//#endregion
//#region JavaScript ---------------------------------------------------------

// can preceed regex, excludes `throw` and `new` from the keywords
var R_PREFIX =
/((?:(?:^|[[{(,;:?=|&!^~>%*/])\s*[+-]{0,2}|\.\.|case|default:?|delete|do|else|extends|in|instanceof|prefix|return|typeof|void|yield|[^+]\+|[^-]-)\s*)/

/**
 * Matches multiline JS comments, with support for embedded `'/*'` sequences.
 * @type {RegExp}
 */
export var JS_MLCMNT = /\/\*[^*]*\*+(?:[^*/][^*]*\*+)*\//g

/**
 * Matches single line JS comments.
 * @type {RegExp}
 */
export var JS_SLCMNT = /\/\/.*/g

/**
 * Matches a double quoted JS string, with support for escaped quotes
 * and line-endings.
 * @type {RegExp}
 */
export var JS_DQSTR = /"[^"\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^"\n\r\\]*)*"/g

/**
 * Matches a single quoted JS string, with support for escaped quotes
 * and line-endings.
 * @type {RegExp}
 */
export var JS_SQSTR = RegExp(JS_DQSTR.source.replace(/"/g, "'"), 'g')

/**
 * Combines `JS_DQSTR` and `JS_SQSTR` regexes to match both quoted strings.
 */
export var JS_STRING = RegExp(JS_DQSTR.source + '|' + JS_SQSTR.source, 'g')

/**
 * Matches literal regexes
 * @type {RegExp}
 */
export var JS_REGEX = /\/(?=[^*\n\r/])[^[\n\r/\\]*(?:(?:\\.|\[(?:\\.|[^\]\r\n\\]*)*\])[^[\n\r\\/]*)*?\/[gimuys]*/

/**
 * Matches regex, captures in $1 a prefix, in $2 the regex without options
 * @type {RegExp}
 * @deprecated
 */
export var JS_REGEX_P = RegExp(R_PREFIX.source + JS_REGEX.source, 'g')

//#endregion
//#region Lines --------------------------------------------------------------

// https://tc39.github.io/ecma262/#table-32
var WS = '[ \\t\\v\\f\\xA0\\uFEFF]'

// https://tc39.github.io/ecma262/#table-32
var LE = '\\r\\n?|[\\n\\u2028\\u2029]'

var _lineRegex = function (re, flags) {
  return new RegExp(re.source.replace(/@B/g, WS).replace(/@L/g, LE), flags)
}

/**
 * Matches an empty line or line with only whitespace within, including its
 * line-ending, if it has one.
 * @type {RegExp}
 */
export var EMPTY_LINES = _lineRegex(/^(?:@L|@B+(?:@L|$))/, 'mg')

/**
 * Matches lines with at least one non-whitespace character, including its
 * line-ending, if it has one.
 * @type {RegExp}
 */
export var NON_EMPTY_LINES = _lineRegex(/^@B*\S.*(?:@L|$)/, 'mg')

/**
 * Matches the trailing whitespace of a line, without including its
 * line-ending.
 * @type {RegExp}
 */
export var TRAILING_WS = _lineRegex(/@B+$/, 'mg')

/**
 * Matches zero or more blank characters followed by a line-ending
 * or the final blanks, if the (last) line has no line-ending.
 * @type {RegExp}
 */
export var OPT_WS_EOL = _lineRegex(/(?:@L)|@B+(?:@L|$)/, 'g')

/**
 * Matches line-ending of any type
 * @type {RegExp}
 */
export var EOL = _lineRegex(/@L/, 'g')

//#endregion
