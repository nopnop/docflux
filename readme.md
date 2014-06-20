# docflux [![Build Status](https://secure.travis-ci.org/nopnop/docflux.png?branch=master)](http://travis-ci.org/nopnop/docflux) [![NPM version](https://badge-me.herokuapp.com/api/npm/docflux.png)](http://badges.enytc.com/for/npm/docflux)


> Stream source code documentation block to json object

## Features

  - Transform stream source code to [docflux json object](#docflux-json-object)
  - Transform [docflux json object](#docflux-json-object)
    to [markdown](#docfluxmarkdown)
  - Support for multiline tag description

## Api

Install the module with: `npm install docflux`

```javascript
var docflux = require('docflux');

process.stdin(docflux())
  .on('data', function(jsdoc) {
    console.log(JSON.stringify(jsdoc, null, 2))
  })
```

**Yield** (see [docflux json object](#docflux-json-object) below)

```javascript
{"token": "MyClass#foo(a,b,[c])", "description": "...", "tags": [{...}]}
{"token": "MyClass#bar(a,b,[c])", "description": "...", "tags": [{...}]}
```

## Command line tool

Install the command line tool with: `npm install -g docflux`

```bash
Usage: docflux docflux <file>

Options:

  -h, --help          output usage information
  -V, --version       output the version number
  -m --markdown       Output a markdown formated documentation (default to json)
  -o --output <file>  Output to this file
  -i --indent [size]  Indent json output
  -d --depth  <size>  Minimal header depth for markdown output

# Pipe to another json consumer
cat input.js | docflux | consumejson

# Use input and output
docflux input.js -o output.md

# Or write markdown output ...
docflux --markdown input.js > output.md

# Or write json output with indentation...
docflux input.js -i 4 > output.json

```



## Supported comments style

Docflux support most of the jsdoc-like simple doc-block
(see tests for more examples)

**Short & compact doc-block style**

```javascript
/**
 * Create new user
 * Long description of this method
 * @param {String} name User name
 * @param {String|String[]} groupId Group id or array of group id
 * @param {Object} [options]
 * @returns {Boolean}
 */
 MyClass.prototype.createUser(name, groupId, options) { //...
```

**Long doc-block style**
```javascript
/**
 * Create new user
 *
 * Long description of this method with list and examples
 *
 *   - Do this
 *   - And this
 *
 * Example:
 *
 *     var my = new MyClass();
 *     my.createUser('Foo',['admin','staff'], { silent: true });
 *
 * @param {String} name
 *        Username with some restrictions
 *        - Must be lower-case
 *        - Must be funny
 *
 * @param {String|String[]} groupId Group id or array of group id
 *        Put some markdow here too:
 *
 *            // Example
 *
 * @param {Object} [options]
 *   Options are always optional
 *   but params description alignement is based on first line indentation
 *
 * @returns {Boolean}
 *
 * @thows {InvalidUsernameException} Not funny (maybe)
 *
 * @see http://www.gelule.net/
 *
 * @memberOf MyClass
 */
      createUser: function(name, groupId, options) { //...
```


**Output examples**

 - [JSON output example](./test/fixtures/expect.json)
 - [Markdown output example](./test/fixtures/expect.md)


## docflux.markdown()

Opinionated stream that transform a docflux stream to markdown
(see  [markdown output example](./test/fixtures/expect.md)) (nb: this
is more a demo usage of docflux's json stream)

```javascript
var docflux = require('docflux');

process.stdin(docflux())
  .pipe(docflux.markdown())
  .on('data', function(jsdoc) {
    console.log(JSON.stringify(jsdoc, null, 2))
  })
```


## `@memberOf` tag

The `@memberOf` associate a backbone-like method with a class.

```javascript
var MyClass = ClassCreator({
  /**
   * Create new user
   * @memberOf MyClass
   */
   createUser: function () { //...
})
```

**Yield** the following `docflux.signature` (with markdown transform):

```markdown
## MyClass#createUser()
```

**Add a dot** to the memberOf tag (`@memberOf MyClass.`) to force a static method signature:

```markdown
## MyClass.createUser()
```

## docflux json object

For each jsdoc-style block in the source code, docflux provide a pojo javascript
object with those fields:

  - `token`:
    The documented function or class or method
  - `params`:
     Formated parameters list (expl: `a, b, [options]`)
  - `memberOf`:
     According to the `@memberOf` tag if present, the class of the currently
     documented method. Useful with backbone-like code (expl: `MyClass`)
  - `signature`:
     A formated signature (expl: `MyClass#foo(a, b, [options])`)
  - `description`:
    The full description part of the doc-block comment
  - `summary`:
    Only the summary part of the doc-block comment
  - `body`:
    The extended description part of the doc-block comment
  - `tags`:
    An array of tag object with:
      - `type`: The tag name
      - `types`: Array of types (for tags like `@param {Object|String}`)
      - `token`: The param token (for `@param {Type} token`)
      - `description`: The full tag description
      - `summary`: Only the summary part of the description (first line)
      - `body`: The extended part of the tag description
      - `raw`: The raw tag extracted from the doc-block comment
  - `flags`:
    An array of all tags name (type): can be used as flag to check
    a tag presence
  - `isClass`:
    True if this comment concern a Class (see isClass())
  - `isFunction`:
    True if this comment concern a function
  - `isExports`:
    True if this comment concern a module.exports
  - `ignore`:
    a `@ignore` tag exists
  - `firstLine`:
    The first line of code used to generated the token
  - `raw`:
    The full raw doc-block

## Why another dox (and credit)?

  - Docflux was inspired by [dox](https://github.com/visionmedia/dox) and
     [dox](https://github.com/visionmedia/dox) is widely used
     with [many other projects based on it](https://www.npmjs.org/browse/depended/dox):
     so consider using it if it match your needs
  - Docflux is a one-day project to provide
    - A [stream interface](http://nodejs.org/api/stream.html)
    - Less verbose and opinionated output (no pre-formated html output)
    - Support for multiline tag description
  - Docflux output is partially compatible with dox output
  - Sometimes, reinventing the wheel opens new perspectives (sometimes not...)

## License

The MIT license (see LICENSE.md)
