var _          = require('underscore')

module.exports = parser

/**
 * Parse a raw doc-block source and return docflux object
 *
 * @param  {String} raw
 *         The raw doc-block source without the comment asterisk `*`
 *
 * @param  {String} firstLine
 *         The first line of code after the doc-block comment
 *
 * @returns {Object} A docflux object:
 *
 *         - `token`:
 *           The documented function or class or method
 *         - `params`:
 *            Formated parameters list (expl: `a, b, [options]`)
 *         - `memberOf`:
 *            According to the `@memberOf` tag if present, the class of the currently
 *            documented method. Useful with backbone-like code (expl: `MyClass`)
 *         - `signature`:
 *            A formated signature (expl: `MyClass#foo(a, b, [options])`)
 *         - `description`:
 *           The full description part of the doc-block comment
 *         - `summary`:
 *           Only the summary part of the doc-block comment
 *         - `body`:
 *           The extended description part of the doc-block comment
 *         - `tags`:
 *           An array of tag object with:
 *             - `type`: The tag name
 *             - `types`: Array of types (for tags like `@param {Object|String}`)
 *             - `token`: The param token (for `@param {Type} token`)
 *             - `description`: The full tag description
 *             - `summary`: Only the summary part of the description (first line)
 *             - `body`: The extended part of the tag description
 *             - `raw`: The raw tag extracted from the doc-block comment
 *         - `flags`:
 *           An array of all tags name (type): can be used as flag to check
 *           a tag presence
 *         - `isClass`:
 *           True if this comment concern a Class (see isClass())
 *         - `isFunction`:
 *           True if this comment concern a function
 *         - `isExports`:
 *           True if this comment concern a module.exports
 *         - `ignore`:
 *           a `@ignore` tag exists
 *         - `firstLine`:
 *           The first line of code used to generated the token
 *         - `raw`:
 *           The full raw doc-block
 */
function parser(raw, firstLine) {
  var match, re;
  var result = {
    token:       null,
    params:      null,
    signature:   null,
    memberOf:    null,
    description: '',
    summary:     '',
    body:        '',
    tags:        [],
    isClass:     false,
    isFunction:  false,
    isExports:   false,
    firstLine:   firstLine,
    raw:         raw,
  }

  // Extract token from first line
  match = /^(?:(?:var)?\s?([\w\.]+)\s*=|.*?function\s(\w+)|(\w+)\s*:\s*function)/.exec(firstLine.trim());
  result.token = match ? match[1] || match[2] || match[3] : 'anonymous';
  result.token = result.token.replace('.prototype.', '#')

  if(/module\.exports/.test(firstLine)) {
    result.isExports = true
  }

  // Extract summary and content
  match              = /^((?!@).*\n?)*/.exec(raw);
  result.description = match[0];
  result.summary     = match[0].split('\n')[0].trim();
  result.body        = match[0].split('\n').slice(1).join('\n').trim();

  // Extract tags
  re       =  /@(\w+)\s+(?:\{([^}]+)\}|(.*?))?\s?([\[\w\]]+)?([^\n]*)((\n(?!@)[^\n]*)*)/g;
  var tags = raw.slice(result.description.length)
  function handleTag(match) {
    var tag = {};
    var A, B;
    tag.type        = match[1];
    tag.types       = match[2] ? match[2].split('|') : null;
    if( match[2] ) {
      tag.token       = match[4];
      tag.body        = (match[6] || '') + (match[7] || '')
      tag.summary     = (match[5] || '');
    } else {
      tag.body        = (match[6] || '') + (match[7] || '')
      tag.summary     = (match[3] || '') + (match[4] || '') + (match[5] || '');
    }

    if(tag.body.trim() == '') {
      tag.body = undefined;
    }
    tag.summary  = tag.summary.trim();

    if(tag.body) {
      // Find indentation:
      var ext      = tag.body.split('\n').slice(1);
      var firstNotEmptyLine = _.find(ext, function(line) {
        return line.trim() != '';
      })
      if(firstNotEmptyLine) {
        var indent   = /^\s*/.exec(firstNotEmptyLine)[0].length;
        tag.body = ext.map(function(line) {
          return line.replace(new RegExp('^\\s{0,'+indent+'}'),'');
        }).join('\n').trim();
      }

      tag.description = tag.summary + '\n' + tag.body;
    } else {
      tag.description = tag.summary;
    }

    tag.raw         = match[0];
    result.tags.push(tag);

  }
  while((match = re.exec(tags)) !== null)  handleTag.call(null, match )

  result.params    = result.tags
  .filter(function(tag) { return tag.type == 'param' })
  .map(function(tag) { return tag.token  })
  .join(', ')


  if(!/[\.#]/.test(result.token)) {
    var memberOf = _.findWhere(result.tags, {'type':'memberOf'});
    if(memberOf) {
      result.memberOf = memberOf.summary
      // Add a # if the @memberOf tag does not provide a separator
      var split = /[#\.]$/.test(result.memberOf) ? '' : '#';
      result.token     = result.memberOf + split + result.token
    }
  }

  result.signature = result.token + '('+result.params +')'

  result.flags   = _.uniq(_.pluck(result.tags,'type'))
  result.ignore  = ~result.flags.indexOf('ignore') ? true : false

  result.isClass    = isClass(result)
  result.isFunction = isFunction(result)

  return result
}

/**
 * Return true if this documentation block may comment a Class
 *
 * The doc-block may be a Class comment if:
 * - The tag `@class` is present
 * - The token first char is upper-case (and there is no restrictive tags
 *   such `@function` for instance)
 *
 * @param {Object} doc
 *        docflux parser result
 */
function isClass(doc) {

  // There is a class tag:
  if(~doc.flags.indexOf('class')) return true;

  // There is no . or # in the signature and ...
  if(/[\.#]/.test(doc.signature)) return false;

  // ... the first char is upper-case ...
  var firstTokenChar = doc.token.slice(0,1);
  var isUpperCase    = firstTokenChar === firstTokenChar.toUpperCase()

  if(!isUpperCase) return false;

  // ... and there is no restrictive tags
  if(
       ~doc.flags.indexOf('function')
    || ~doc.flags.indexOf('constant')
    || ~doc.flags.indexOf('memberOf')
    || ~doc.flags.indexOf('type')
  ) {
    return false
  }
  return true;
}

/**
 * Return true if this documentation block may comment a Class
 *
 * The doc-block may be a function comment if:
 * - The function's flag is present
 * - The tag `@class` is not present
 * - The first line token is only a function
 *
 * @param {Object} doc
 *        docflux parser result
 */
function isFunction(doc) {

  if(~doc.flags.indexOf('function')) return true;

  if(~doc.flags.indexOf('class')) return false;

  if(/^\s*function/.test(doc.firstLine)) return true;

  return false;
}
