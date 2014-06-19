var split    = require('split')
var through2 = require('through2')
var duplexer = require('duplexer')
var combiner = require('stream-combiner')
var _        = require('underscore')
var parser   = require('./parser')


module.exports = transform;

/**
 * Create a doc-block extractor stream
 *
 * This function take a buffer stream as input and output a object stream
 * of docflux object (objectified documentation block)
 *
 * Example:
 * ```javascript
 * var docflux = require('docflux');
 *
 * process.stdin(docflux())
 *   .on('data', function(jsdoc) {
 *     console.log(JSON.stringify(jsdoc, null, 2))
 *   })
 * ```
 *
 * @return {Stream}
 */
function transform() {
  var stack    = [];
  var inside   = false;
  var out      = false;

  var writable = combiner(split(), through2(function(line, encoding, done) {
    line = line.toString();
    if(out) {
      // Comment with a white space below are ignored
      if(line.trim() != '') {
        readable.write(parser(stack.join('\n'), line))
      }
      out   = false;
      stack = [];
    } else  if(!inside) {
      if(/\s*\/\*\*/.test(line)) {
        stack  = [];
        inside = true;
      }
    } else if(inside) {
      if(/\*\/\s*$/.test(line)) {
        inside = false
        out    = true
      } else {
        stack.push(line.replace(/^\s*\*{1,2}\s?/,''));
      }
    }
    done();
  }, function(done) {
    readable.write(null)
    done();
  }))

  var readable = through2.obj();

  return duplexer(writable, readable)
}
