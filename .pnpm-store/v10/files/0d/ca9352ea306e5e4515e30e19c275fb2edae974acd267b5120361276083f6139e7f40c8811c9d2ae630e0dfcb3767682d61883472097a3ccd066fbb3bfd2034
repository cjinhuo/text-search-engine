/**
 * skip-regex v1.0.2
 * @author aMarCruz
 * @license MIT
 */
/*eslint-disable*/
var skipRegex = (function () {
  var beforeReChars = '[{(,;:?=|&!^~<>%*/';
  var beforeReSign = beforeReChars + '+-';
  var beforeReWords = [
    'await',
    'case',
    'default',
    'do',
    'else',
    'extends',
    'in',
    'instanceof',
    'of',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield' ];
  var wordsEndChar = beforeReWords.reduce(function (s, w) { return s + w.slice(-1); }, '');
  var R_JS_REGEX = /^\/(?=[^*/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuys]*/;
  var R_JS_VCHAR = /[$\w]/;
  var R_LINE_ALL = /.*/g;
  var _prev = function (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])) {}
    return pos
  };
  return function skipRegex (code, start) {
    var re = R_LINE_ALL;
    var pos = re.lastIndex = start++;
    var match = re.exec(code);
    match = match && match[0].match(R_JS_REGEX);
    if (match) {
      var next = pos + match[0].length;
      pos = _prev(code, pos);
      var c = code[pos];
      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }
      if (c === '.') {
        if (code[pos - 1] === '.') {
          start = next;
        }
      } else {
        if (c === '+' || c === '-') {
          if (code[--pos] !== c ||
             (pos = _prev(code, pos)) < 0) {
            return next
          }
          c = code[pos];
          if (~beforeReSign.indexOf(c)) {
            return next
          }
        }
        if (~wordsEndChar.indexOf(c)) {
          var end = pos + 1;
          while (--pos >= 0 && R_JS_VCHAR.test(code[pos])) {}
          if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
            start = next;
          }
        }
      }
    }
    return start
  }
})();

export default skipRegex;
//# sourceMappingURL=skip-regex.mjs.map
