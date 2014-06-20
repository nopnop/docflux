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

  var isFirst = true;

  return through2.obj(function(doc, encoding, done) {
    var out = [];

    if(isFirst) { isFirst = false } else { out.push('\n\n') }

    var depth = options.depth;
    if(options.indent && !doc.isClass && !doc.isFunction && !doc.isExport) {
      depth++;
    }

    out.push(repeat('#',depth) + ' ' + doc.signature + '')
    out.push('> '  + doc.summary)
    if(doc.body) {
      out.push('\n' + doc.body)
    }


    // Parameters
    if(~doc.flags.indexOf('param')) {
      out.push('')
      out.push('**Parameters:**\n')
      var isFirstParam = true;
      doc.tags.forEach(function(tag) {
        if(tag.type != 'param') return;
        if(isFirstParam) { isFirstParam = false } else { out.push('') }
        var description = '\n' + tag.description.trim().split('\n').map(function(line) {
          return line.trim() == '' ? '' : '    ' + line
        }).join('\n')
        var types = tag.types ? ' {' + tag.types.map(function(type) { return '`' + type + '`' }).join('|') + '}' : '';
        out.push(sprintf('  - **%s**%s%s', tag.token, types, description))
      })
    }

    var isFirstTag = true;
    doc.tags.forEach(function(tag) {
      if(~['param', 'memberOf'].indexOf(tag.type)) return;
      out.push('')
      var types = tag.types ? ' {' + tag.types.map(function(type) { return '`' + type + '`' }).join('|') + '}' : '';
      var description = '\n' + tag.description.trim()
      out.push(sprintf('**%s**%s%s', tag.type, types, description))
    })

    done(null, out.join('\n'))
  })
}
