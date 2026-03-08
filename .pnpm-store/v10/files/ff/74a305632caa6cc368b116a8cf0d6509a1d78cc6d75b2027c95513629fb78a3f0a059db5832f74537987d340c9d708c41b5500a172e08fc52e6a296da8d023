/**
 * perf-regexes
 * @license MIT
 */
export = R

declare const R: {
  /**
   * Valid HTML comments, according to the SGML standard.
   * @see https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.4
   */
  HTML_CMNT: RegExp

  /**
   * Matches multiline JS comments, with support for embedded `'/*'` sequences.
   */
  JS_MLCMNT: RegExp

  /**
   * Matches single line JS comments.
   */
  JS_SLCMNT: RegExp

  /**
   * Matches a double quoted JS string, with support for escaped quotes
   * and line-endings.
   */
  JS_DQSTR: RegExp

  /**
   * Matches a single quoted JS string, with support for escaped quotes
   * and line-endings.
   */
  JS_SQSTR: RegExp

  /**
   * Combines `JS_DQSTR` and `JS_SQSTR` regexes to match both quoted strings.
   */
  JS_STRING: RegExp

  /**
   * Matches literal regexes
   */
  JS_REGEX: RegExp

  /**
   * Matches regex, captures in $1 a prefix, in $2 the regex without options
   * @deprecated
   */
  JS_REGEX_P: RegExp

  /**
   * Matches an empty line, including its line-ending, if it has one.
   */
  EMPTY_LINES: RegExp

  /**
   * Matches non-empty lines, including its line-ending, if it has one.
   */
  NON_EMPTY_LINES: RegExp

  /**
   * Matches the trailing whitespace of a line, without including its
   * line-ending.
   */
  TRAILING_WS: RegExp

  /**
   * Matches zero or more blank characters followed by a line-ending
   * or the final blanks, if the (last) line has no line-ending.
   */
  OPT_WS_EOL: RegExp

  /**
   * Matches line-ending of any type
   */
  EOL: RegExp
}
