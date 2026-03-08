/**
 * rollup-plugin-cleanup v3.2.1
 * @author aMarCruz
 * @license MIT
 */
/*eslint-disable*/
import cleanup from 'js-cleanup';
import { createFilter } from 'rollup-pluginutils';

const justExt = (file) => {
  const match = /[^/\\]\.([^./\\]*)$/.exec(file);
  return match ? match[1] : ''
};

/**
 * Creates a filter for the options `include`, `exclude`, and `extensions`.
 * Since `extensions` is not a rollup option, I think is widely used.
 *
 * @param {object} opts? - The user options
 * @returns {function}     Filter function that returns true if a given
 *                         file matches the filter.
 */
const _createFilter = function (opts) {

  const filter = createFilter(opts.include, opts.exclude);

  let exts = opts.extensions || ['js', 'jsx', 'mjs'];
  if (!Array.isArray(exts)) {
    exts = [exts];
  }

  for (let i = 0; i < exts.length; i++) {
    const e = exts[i];
    if (e === '*') {
      return filter
    }
    if (e[0] === '.') {
      exts[i] = e.substr(1);
    }
  }

  return (name) => (filter(name) && exts.indexOf(justExt(name)) > -1)
};

// Support for deprecated filters
const translateFilter = function (item, ix, arr) {
  switch (item) {
    case 'srcmaps':
      arr[ix] = 'sources';
      break
    // istanbul ignore next
    case 'jscs':
      arr[ix] = /^[/*]\s*jscs:[ed]/;
      break
  }
};

// multiple forms to specify comment filters, default is 'some'
const getFilters = (filters) => {

  if (typeof filters === 'boolean') {
    return filters === true ? 'all' : 'none'
  }

  if (filters) {
    filters = Array.isArray(filters) ? filters : [filters];
    filters.forEach(translateFilter);
    // throws on unknown filters
    cleanup('', null, { comments: filters, sourcemap: false });
  }

  return filters || 'some'
};

const parseOptions = (options) => {
  const comments = getFilters(options.comments);

  return {
    comments,
    compactComments: options.compactComments !== false,
    lineEndings: options.lineEndings || options.normalizeEols,
    maxEmptyLines: options.maxEmptyLines | 0,
    sourcemap: options.sourceMap !== false && options.sourcemap !== false,
  }
};

/**
 * Returns the rollup-plugin-cleanup instance.
 * @param   {Object} options - Plugin's user options
 * @returns {Object} Plugin instance.
 */
const rollupCleanup = function (options) {
  options = options || {};

  // merge include, exclude, and extensions
  const filter = _createFilter(options);

  // validate and clone the plugin options
  options = parseOptions(options);

  // the plugin instance
  return {

    name: 'cleanup',

    transform(code, id) {

      if (filter(id)) {
        return new Promise((resolve) => {
          try {
            resolve(cleanup(code, id, options));
          } catch (err) {
            // istanbul ignore else
            if ('position' in err && this.error) {
              this.error(err.message, err.position);
            } else {
              throw err
            }
          }
        })
      }

      return null
    },
  }
};

export default rollupCleanup;
//# sourceMappingURL=rollup-plugin-cleanup.es.js.map
