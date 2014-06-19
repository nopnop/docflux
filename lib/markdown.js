var split    = require('split')
var through2 = require('through2')
var duplexer = require('duplexer')
var combiner = require('stream-combiner')
var _        = require('underscore')
var sprintf  = require('underscore.string').sprintf
var repeat   = require('underscore.string').repeat

module.exports = markdown;

/**
 * Transform a docflux stream to a markdown stream
 *
 * This is more a docflux's usage example than a full featured tool
 *
 * Example:
 * ```javascript
 * var docflux = require('docflux');
 *
 * process.stdin(docflux())
 *   .pipe(docflux.markdown())
 *   .pipe(process.stdout)
 * ```
 *
 * @param {Object} [options]
 *        Some rendering options
 *        - `depth`: The base header size in term of `#` chars (default: 1)
 *        - `indent`: Use one more header char for methods (default is true)
 *          - Class and function will have `options.depth` repeat of `#`
 *          - If true, other will have `options.depth + 1` repeat of `#`
 *
 * @returns {Stream}
 */
function markdown(options) {
  options = _.extend({
    depth:  1,
    indent: true
  }, options || {})

  return through2.obj(function(doc, encoding, done) {
    var out = [];

    var depth = options.depth;
    if(options.indent && !doc.isClass && !doc.isFunction && !doc.isExport) {
      depth++;
    }

    out.push(repeat('#',depth) + ' ' + doc.signature)
    out.push('> '  + doc.summary)
    if(doc.extended) {
      out.push('\n' + doc.extended)
    }
    out.push('')
    doc.tags.forEach(function(tag) {
      switch(tag.tag) {
        case 'param':
          out.push(sprintf('**%s** `{%s}` %s', tag.token, tag.type, tag.description))
          break;
        case 'throw':
        case 'returns':
        case 'return':
          out.push(sprintf('**%s** `{%s}` %s', tag.tag, tag.type, tag.description))
          break;
        case 'see':
          out.push(sprintf('**see**', tag.summary))
          break;
        default:
          out.push(sprintf('**%s**', tag.summary))
          break;
      }
      out.push('')
    })

    done(null,
      out.join('\n') +
      '\n--------------------------------------------------------------------------------\n\n')
  })
}
