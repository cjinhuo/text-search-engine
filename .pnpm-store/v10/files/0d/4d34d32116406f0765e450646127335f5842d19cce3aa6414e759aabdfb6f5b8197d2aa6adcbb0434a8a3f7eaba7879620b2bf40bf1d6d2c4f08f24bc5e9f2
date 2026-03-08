/**
 * js-cleanup v1.2.0
 * @author aMarCruz
 * @license MIT
 */
/* eslint-disable */
import { EOL, JS_DQSTR, JS_SQSTR, JS_MLCMNT, JS_SLCMNT } from 'perf-regexes';
import skipRegex from 'skip-regex';
import MagicString from 'magic-string';

/**
 * Augments the error with the position of the error into the source.
 *
 * @param err Error object
 * @param pos Absolute position into the buffer (base 0)
 */
const makeError = function (err, pos) {
    err.position = pos;
    return err;
};

/**
 * Replaces the marker '@LE' with line-endings characters in the regex.
 * Safe to use with minifiers.
 *
 * @param re Regex to replace
 * @param flags Regex flags
 */
const safeRegex = (re, flags) => new RegExp(re.source.replace(/@LE/g, EOL.source), flags);

/**
 * Source to match consecutive whitespace that ends in a line-ending of any
 * type. The whitespace can include other line-endings.
 */
// eslint-disable-next-line unicorn/better-regex
const sAllLines = safeRegex(/\s*(?:@LE)/).source;
/**
 * Matches one line-endings and its leading characters.
 */
// eslint-disable-next-line unicorn/better-regex
const reEachLine = safeRegex(/.*(?:@LE)/, 'g');
/**
 * Normalizes and compacts a block of blank characters to convert it into a
 * block of line-endings that do not exceed the maximum number defined by the
 * user.
 *
 * @param ctx Maximum number of *characters* for the empty lines
 * @param str Block of blank characters to search on
 * @param first This is the first block
 */
const packLines = (ctx, str, first) => {
    //
    // First case, no empty lines
    if (!ctx.empties) {
        return first ? '' : ctx.eolChar;
    }
    // Normalize eols and discard other characters in this region
    str = str.replace(reEachLine, ctx.eolChar);
    // Second case, limit to max N lines
    if (ctx.empties > 0) {
        const limit = first ? ctx.maxTopLen : ctx.maxEols.length;
        if (str.length > limit) {
            return str.substr(0, limit);
        }
    }
    // Third case is keep all the empty lines, so do nothing more
    return str;
};
/**
 * Normalizes and compacts the region of consecutive whitespace.
 *
 * @param ctx Execution context
 * @param mm Regex result with the index and content to squash
 * @param end Ending of the region
 */
const squashRegion = (ctx, mm, end) => {
    // Get the start position and content of the region to squash.
    const start = mm.index;
    const oldStr = mm[0];
    // Optimize the high frecuency case of one only normalized eol,
    // but not at start
    if (start > 0 && oldStr === ctx.eolChar) {
        return;
    }
    // Compact intermediate lines, if `maxEmptyLines` is zero all blank lines
    // are removed. If it is -1 the spaces are removed, keeping the EOLs.
    const newStr = packLines(ctx, oldStr, !start);
    if (oldStr !== newStr) {
        ctx.magicStr.overwrite(start, end, newStr);
        ctx.changes = true;
    }
};
/**
 * Normalizes and compacts lines in a block of text.
 *
 * @param ctx Execution context
 * @--param start Offset of the start of the region
 * @param end Ending of the region
 */
const trimLines = function (ctx, end) {
    if (ctx.start >= end) {
        return;
    }
    const buffer = ctx.buff;
    const re = new RegExp(sAllLines, 'g');
    re.lastIndex = ctx.start;
    let mm = re.exec(buffer);
    while (mm) {
        if (mm.index >= end) {
            ctx.start = end;
            return;
        }
        ctx.start = re.lastIndex;
        squashRegion(ctx, mm, ctx.start);
        mm = re.exec(buffer);
    }
};

/** Flag for ES6 TL in the stack */
const ES6_BQ = '`';
/**
 * Searches the next backtick that signals the end of the ES6 Template Literal
 * or the sequence "${" that starts a sub-expression, skipping any escaped
 * character.
 *
 * @param buffer Whole code
 * @param start Starting position of the template
 * @param stack To save nested ES6 TL positions
 * @returns The end of the string (-1 if not found).
 */
const skipTL = (buffer, start, stack) => {
    //
    // Only three characters are of interest to this function
    const re = /[$\\`]/g;
    // `start` points to the a backtick inside `code`
    re.lastIndex = start + 1;
    while (re.exec(buffer)) {
        const pos = re.lastIndex;
        const c = buffer[pos - 1];
        if (c === ES6_BQ) {
            return pos; // found the end of this TL
        }
        if (c === '\\') {
            re.lastIndex = pos + 1; // Skip this escaped char
            //
        }
        else if (buffer[pos] === '{') {
            /*
              In a sub-expression, push a backtick in the stack.
              When the calling loop finds a closing brace and see the backtick,
              it will restore the ES6 TL parsing mode.
            */
            stack.push(ES6_BQ);
            return pos + 1;
        }
    }
    throw makeError(new Error('Unclosed ES6 Template Literal.'), start);
};
/**
 * Handles ES6 TL.
 *
 * Line trimming is done here and the position is shifted so that trimLines
 * does not touch the literals.
 *
 * @param ctx Execution context
 * @param start Start of the ES6 TL
 */
const skipES6Str = function (ctx, start) {
    //
    trimLines(ctx, start);
    ctx.start = skipTL(ctx.buff, start, ctx.stack);
    return ctx.start;
};

/**
 * Searches the end of a single or double-quoted string.
 *
 * @param ctx Execution context
 * @param index Start of the string
 */
const skipQuotes = function (ctx, index) {
    const buffer = ctx.buff;
    const re = buffer[index] === '"' ? JS_DQSTR : JS_SQSTR;
    re.lastIndex = index;
    if (!re.exec(buffer)) {
        throw makeError(new Error(`Unclosed string.`), index);
    }
    return re.lastIndex;
};

/**
 * Matches non-line-endings characters
 */
const R_NOEOLS = /[^\n\r\u2028\u2029]+/g;
/**
 * By using premaked string of spaces, blankBlock is faster than
 * block.replace(/[^ \n]+/, ' ').
 */
const spaces = new Array(150).join(' ');
/**
 * Helper function to convert characters in spaces, except EOLs.
 * @param str Block to convert
 */
const blankBlock = (str) => {
    const len = str.length;
    str = spaces;
    while (str.length < len) {
        str += spaces;
    }
    return str.slice(0, len);
};
/**
 * Returns `true` if a comment must be removed due there's non-blank
 * content after it in the same line.
 */
const removeThis = (ctx, end) => {
    const buffer = ctx.buff;
    let ch;
    // Find the next non-space to the right, or the end of the buffer.
    while (end < buffer.length) {
        ch = buffer[end];
        // Found an EOL, let the caller handle this
        if (ch === '\n' || ch === '\r') {
            return false;
        }
        // Found non-space, we need remove this comment
        if (/\S/.test(ch)) {
            return true;
        }
        end++;
    }
    return false;
};
/**
 * Handle comments that must be removed.
 *
 * If the comment is multi-line and does not ends with an EOL, remove it
 * here because the caller will not do that.
 *
 * Other comments are only replaced with blanks, except its line-endings,
 * and either `trimLines` or `finalTrim` will remove it in a later step.
 */
const rmComment = (ctx, start, end) => {
    const buffer = ctx.buff;
    // Multiline comments, if they are not isolated, should be removed here,
    // since trimLines will not see it.
    if (buffer[start + 1] === '*' && removeThis(ctx, end)) {
        ctx.magicStr.overwrite(start, end, '');
        ctx.changes = true;
    }
    // Replace the comment with spaces, except EOLs, so in a future step
    // trimLines can normalize and compact it in a right way.
    ctx.buff =
        buffer.substr(0, start) +
            buffer.slice(start, end).replace(R_NOEOLS, blankBlock) +
            buffer.substr(end);
};
/**
 * Called when the option `compactComments` is `false`, preserves the
 * whitespace within the comment, only normalizing line-ending.
 *
 * @param ctx Execution context
 * @param start Start of the comment
 * @param end Ending position of the comment
 */
const normalize = (ctx, start, end) => {
    //
    // Trim the previous block up to the beginning of this comment
    trimLines(ctx, start);
    // Only normalize the line-endings within the comment
    const str = ctx.buff.slice(start, end).replace(EOL, ctx.eolChar);
    ctx.magicStr.overwrite(start, end, str);
    ctx.changes = true;
    // ...and adjust `start` to prevent trimLines from touching it.
    ctx.start = end;
};
/** Matches comments */
const reCmnt = {
    '*': JS_MLCMNT,
    '/': JS_SLCMNT,
};
/**
 * Comment handler.
 *
 * If compactComments is `false`, line compaction must be done here
 * and update the start position in the execution context.
 *
 * @param ctx Execution context
 * @param start Start of this comment
 * @param ch Type of this comment, either '*' or '/'
 */
const handleComment = function (ctx, start, ch) {
    //
    const re = reCmnt[ch];
    re.lastIndex = start;
    const mm = re.exec(ctx.buff);
    if (mm == null || mm.index !== start) {
        throw makeError(new Error(`Unclosed comment.`), start);
    }
    const end = re.lastIndex;
    if (ctx.filter(mm)) {
        // This comment must be removed or replaced by spaces.
        rmComment(ctx, start, end);
        //
    }
    else if (!ctx.compact && ch === '*') {
        // Preserve whitespace of this comment, only normalize lines.
        normalize(ctx, start, end);
    }
    return end; // trimLines will preserve and compact this comment
};

/**
 * Handles slashes, which can initiate a regex or comment.
 *
 * @param ctx Execution context
 * @param index Position of the slash
 */
const skipReOrCm = function (ctx, index) {
    /*
      This function is always called with an out-of-string slash, so
      if it is followed by '*' or '/' it _must be_ a comment.
  
      If it isn't followed by any of those characters, it could be
      a regex or a division sign, any of which skipRegex will jump.
    */
    const ch = ctx.buff[index + 1];
    if (ch === '*' || ch === '/') {
        return handleComment(ctx, index, ch);
    }
    // will returns index+1 if it is not a regex
    return skipRegex(ctx.buff, index);
};

/** Matches the last whitespace of the buffer */
const reFinalSpc = /\s+$/g;
/**
 * Trims trailing spaces of the whole buffer.
 *
 * @param ctx Execution context
 * @param start Start of trainling part, can contain non-blank chars
 */
const finish = (ctx) => {
    //
    // Get trailing whitespace beginning at the last start position
    reFinalSpc.lastIndex = ctx.start;
    const mm = reFinalSpc.exec(ctx.buff);
    if (mm) {
        // Searches trailing spaces
        const pos = mm[0].search(/.+$/);
        // istanbul ignore else: `pos` should always be >=0
        if (~pos) {
            ctx.magicStr.overwrite(mm.index + pos, ctx.buff.length, '');
            ctx.changes = true;
        }
    }
    return ctx.changes;
};
const uncloseMessage = (ctx) => `Unclosed ${ctx.stack.pop() === '}' ? 'bracket' : 'ES6 Template'}.`;
/**
 * Handles closing brackets. It can be a regular bracket or one closing an
 * ES6 TL expression.
 *
 * @param ctx Execution context
 * @param start Position of this bracket
 */
const skipBracket = (ctx, start) => {
    const ch = ctx.stack.pop();
    if (ch == null) {
        throw makeError(new Error('Unexpected character "}"'), start);
    }
    if (ch === '`') {
        return skipES6Str(ctx, start);
    }
    return start + 1; // skip this
};
/**
 * Pushes a regular JS bracket into the stack.
 *
 * @param ctx Execution context
 * @param index Bracket position
 */
const pushBracket = (ctx, index) => {
    ctx.stack.push('}');
    return index + 1;
};
/**
 * Functions to process the next significant character in the buffer.
 */
const skipFn = {
    '"': skipQuotes,
    "'": skipQuotes,
    '`': skipES6Str,
    '{': pushBracket,
    '}': skipBracket,
    '/': skipReOrCm,
};
/**
 * Main function for removal of empty lines and comments.
 *
 * @param ctx Execution context
 * @param parser Acorn parser and options
 * @returns `true` if the buffer changed.
 */
const cleanupBuffer = function (ctx) {
    const re = /["'/`{}]/g;
    // Don't cache buff
    let fn;
    let mm = re.exec(ctx.buff);
    while (mm) {
        fn = skipFn[mm[0]];
        re.lastIndex = fn(ctx, mm.index);
        mm = re.exec(ctx.buff);
    }
    if (ctx.stack.length) {
        throw new Error(uncloseMessage(ctx));
    }
    trimLines(ctx, ctx.buff.length);
    return finish(ctx);
};

/**
 * Predefined filters.
 *
 * None of this is really accurate, js-cleanup is not a parser, but they
 * are suitable for the job without introducing more complexity.
 */
const predefFilters = {
    /* eslint-disable unicorn/better-regex */
    // The default filter
    some: /^.!|@(?:license|preserve)\b/,
    // Only license
    license: /@license\b/,
    // http://eslint.org/docs/user-guide/configuring
    eslint: /^\*\s*(?:eslint(?:\s|-env\s|-(?:en|dis)able(?:\s|$))|global\s)|^.[\t ]*eslint-disable-(?:next-)?line(?:[\t ]|$)/,
    // https://flow.org/en/docs
    flow: /^.\s*(?:@flow(?:\s|$)|\$Flow[A-Za-z]|flowlint\s|flowlint(?:-next)?-line[\t ])|^\*[\t ]*(?:flow-include\s|:{1,3}[^:])/,
    // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md
    istanbul: /^.\s*istanbul\s+ignore\s+[a-z]/,
    // http://usejsdoc.org
    jsdoc: /^\*\*[\S\s]*@[a-z]{2}/,
    // http://jshint.com/docs/#inline-configuration
    jshint: /^.\s*(?:jshint|globals|exported)\s/,
    // http://www.jslint.com/help.html
    jslint: /^.(?:jslint|global|property)\s\S/,
    // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps
    sources: /^.[#@][\t ]+source(?:Mapping)?URL=/,
    // http://www.typescriptlang.org/docs
    ts: /^(?:\/\/\s*<(?:reference\s|amd-[a-z]).*>|.\s*@(?:jsx[\t ]|ts-(?:check|nocheck|ignore)\b))/,
    // http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
    ts3s: /^\/\/\s*<(?:reference\s|amd-[a-z]).*>/,
};

const hasOwnProp = Object.prototype.hasOwnProperty;
/**
 * Parses an individual filter.
 *
 * @param filter Filter
 */
const parseEach = (filter) => {
    //
    if (filter instanceof RegExp) {
        return filter;
    }
    if (hasOwnProp.call(predefFilters, filter)) {
        return predefFilters[filter];
    }
    throw new Error(`cleanup: unknown comment filter: "${filter}"`);
};
/**
 * Makes the regexes to filter out comments.
 *
 * @param list User filters
 */
const makeFilters = (list) => {
    //
    if (list == null) {
        return [predefFilters.some];
    }
    const filters = Array.isArray(list) ? list : [list];
    if (~filters.indexOf('all')) {
        return true;
    }
    if (~filters.indexOf('none')) {
        return false;
    }
    return filters.map(parseEach);
};
/**
 * Return a function that determinates if a comment must be removed.
 *
 * @param list Default or defined comment filters
 */
const getFilterFn = function (list) {
    const filters = makeFilters(list);
    if (filters === true) {
        return () => false;
    }
    if (filters === false) {
        return () => true;
    }
    /**
     * Determinates if a comment must be preserved.
     *
     * @param ctx Execution context
     * @param start Start of the whole comment
     * @param end End of the whole comment
     */
    const mustRemove = function (mm) {
        let content = mm[0];
        // Extract the content, including the `isBlock` indicator
        content = content[1] === '*' ? content.slice(1, -2) : content.slice(1);
        // Search a filter that matches the content
        return !filters.some(filter => filter.test(content));
    };
    return mustRemove;
};

const getEol = (type) => (type === 'win' ? '\r\n' : type === 'mac' ? '\r' : '\n');
/**
 * Creates the execution context.
 *
 * @param buffer Source text
 * @param options User options
 */
const createContext = function (buffer, options) {
    //
    const eolChar = getEol(options.lineEndings);
    const empties = options.maxEmptyLines | 0;
    const maxEols = empties < 0 ? '' : new Array(empties + 2).join(eolChar);
    return {
        changes: false,
        buff: buffer,
        compact: options.compactComments !== false,
        empties,
        eolChar,
        start: 0,
        stack: [],
        maxTopLen: empties >= 0 ? empties * eolChar.length : -1,
        maxEols,
        magicStr: new MagicString(buffer),
        filter: getFilterFn(options.comments),
    };
};

/**
 * Get the options for the sourcemap.
 */
const getMapOpts = (options, file) => {
    const opts = options.sourcemapOptions || {};
    return {
        source: file,
        includeContent: opts.includeContent === true,
        inlineMap: opts.inlineMap === true,
        hires: opts.hires !== false,
    };
};
/**
 * Creates the result.
 *
 * @param ctx Execution context
 * @param file Source filename
 * @param options User options
 */
const genChangedRes = (ctx, file, options) => {
    const mapOpts = options.sourcemap !== false && getMapOpts(options, file);
    const result = {
        code: ctx.magicStr.toString(),
    };
    if (mapOpts) {
        const map = ctx.magicStr.generateMap(mapOpts);
        if (mapOpts.inlineMap) {
            result.code += `\n//# sourceMappingURL=${map.toUrl()};`;
        }
        else {
            result.map = map;
        }
    }
    return result;
};
/**
 * Smart comment and whitespace cleaner for JavaScript-like files.
 *
 * @param code Source buffer
 * @param file Source filename
 * @param options User options
 */
const cleanup = function (code, file, options) {
    options = options || {};
    const context = createContext(code, options);
    const changes = cleanupBuffer(context);
    return changes
        ? genChangedRes(context, file || '', options)
        : options.sourcemap !== false
            ? { code, map: null }
            : { code };
};

export default cleanup;
//# sourceMappingURL=index.mjs.map
