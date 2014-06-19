# docflux

> Stream source code documentation block to json object

## Features

  - Transform stream source code to [docflux json object](#docflux_json_object)
  - Can transform [docflux json object](#docflux_json_object)
    to [markdown](#docflux-markdown-)

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

```shell
# Pipe to another json consumer
cat input.js | docflux | consumejson

# Or write markdown output ...
docflux --markdown < input.js > output.md
```

## docflux json object

For each jsdoc-style block in the source code, docflux provide a pojo javascript
object with those fields:

TODO (see source documentation) 


## Supported comments style

Docflux support most of the jsdoc-like simple doc-block
(see tests for more examples)

**Short&compact doc-block style**

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

## The first line after the doc-block

**Only doc-block immediately followed by one of the patterns below are taken into account:**

  - A variable `var MyClass = ...` (the token is `MyClass`)
  - A class constructor `function FooBar(...` (the token is `FooBar`, `F` is upper-case)
  - A function `function foobar(...` (the token is `foobar`, `f` is lower-case)
  - A static method `MyClass.create = function(...` (the token is `MyClass.create`)
  - A method `MyClass.prototype.create = function(...` (the token is `MyClass#create`)
  - A object method `create: function(...` (the token is `create`
    or `MyClass#create` or `MyClass.create` with `@memberOf` tag)

## docflux.markdown()

Opinionated stream that transform a docflux stream to markdown
(see  [markdown output example](example_markdown_output.md)) (nb: this
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
