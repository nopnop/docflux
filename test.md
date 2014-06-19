{
  "token": "MyClass",
  "params": "",
  "signature": "MyClass()",
  "memberOf": null,
  "description": "A useful class\n\nThis is exported (isExport must be true)\n\n",
  "summary": "A useful class",
  "extended": "This is exported (isExport must be true)",
  "tags": [
    {
      "tag": "author",
      "summary": "Jean Ponchon",
      "description": "Jean Ponchon",
      "raw": "@author Jean Ponchon"
    }
  ],
  "isClass": true,
  "isFunction": false,
  "isExports": true,
  "firstLine": "var MyClass = module.exports = ClassCreator({",
  "raw": "A useful class\n\nThis is exported (isExport must be true)\n\n@author Jean Ponchon",
  "flags": [
    null
  ],
  "ignore": false
}
{
  "token": "MyClass#createUser",
  "params": "name, groupId, [options]",
  "signature": "MyClass#createUser(name, groupId, [options])",
  "memberOf": "MyClass",
  "description": "Create new user\n\nLong description of this method with list and examples\n\n  - Do this\n  - And this\n\nExample:\n\n    var my = new MyClass();\n    my.createUser('Foo',['admin','staff'], { silent: true });\n\n",
  "summary": "Create new user",
  "extended": "Long description of this method with list and examples\n\n  - Do this\n  - And this\n\nExample:\n\n    var my = new MyClass();\n    my.createUser('Foo',['admin','staff'], { silent: true });",
  "tags": [
    {
      "tag": "param",
      "type": "String",
      "token": "name",
      "extended": "Username with some restrictions\n- Must be lower-case\n- Must be funny",
      "summary": "",
      "description": "\nUsername with some restrictions\n- Must be lower-case\n- Must be funny",
      "raw": "@param {String} name\n       Username with some restrictions\n       - Must be lower-case\n       - Must be funny\n"
    },
    {
      "tag": "param",
      "type": "String|String[]",
      "token": "groupId",
      "extended": "Put some markdow here too:\n\n    // Example",
      "summary": "Group id or array of group id",
      "description": "Group id or array of group id\nPut some markdow here too:\n\n    // Example",
      "raw": "@param {String|String[]} groupId Group id or array of group id\n       Put some markdow here too:\n\n           // Example\n"
    },
    {
      "tag": "param",
      "type": "Object",
      "token": "[options]",
      "extended": "Options are always optional\nbut params description alignement is based on first line indentation",
      "summary": "",
      "description": "\nOptions are always optional\nbut params description alignement is based on first line indentation",
      "raw": "@param {Object} [options]\n  Options are always optional\n  but params description alignement is based on first line indentation\n"
    },
    {
      "tag": "returns",
      "type": "Boolean",
      "summary": "",
      "description": "",
      "raw": "@returns {Boolean}\n"
    },
    {
      "tag": "thows",
      "type": "InvalidUsernameException",
      "summary": "Not funny (maybe)",
      "description": "Not funny (maybe)",
      "raw": "@thows {InvalidUsernameException} Not funny (maybe)\n"
    },
    {
      "tag": "see",
      "summary": "http://www.gelule.net/",
      "description": "http://www.gelule.net/",
      "raw": "@see http://www.gelule.net/\n"
    },
    {
      "tag": "memberOf",
      "summary": "MyClass",
      "description": "MyClass",
      "raw": "@memberOf MyClass"
    }
  ],
  "isClass": false,
  "isFunction": false,
  "isExports": false,
  "firstLine": "    createUser: function(name, groupId, options) {}",
  "raw": "Create new user\n\nLong description of this method with list and examples\n\n  - Do this\n  - And this\n\nExample:\n\n    var my = new MyClass();\n    my.createUser('Foo',['admin','staff'], { silent: true });\n\n@param {String} name\n       Username with some restrictions\n       - Must be lower-case\n       - Must be funny\n\n@param {String|String[]} groupId Group id or array of group id\n       Put some markdow here too:\n\n           // Example\n\n@param {Object} [options]\n  Options are always optional\n  but params description alignement is based on first line indentation\n\n@returns {Boolean}\n\n@thows {InvalidUsernameException} Not funny (maybe)\n\n@see http://www.gelule.net/\n\n@memberOf MyClass",
  "flags": [
    "name",
    "groupId",
    "[options]",
    null
  ],
  "ignore": false
}
{
  "token": "anonymous",
  "params": "[options]",
  "signature": "anonymous([options])",
  "memberOf": null,
  "description": "Summary in a short and compact documentation\nLong description of this method\n",
  "summary": "Summary in a short and compact documentation",
  "extended": "Long description of this method",
  "tags": [
    {
      "tag": "param",
      "type": "Object",
      "token": "[options]",
      "summary": "",
      "description": "",
      "raw": "@param {Object} [options]"
    },
    {
      "tag": "returns",
      "type": "Boolean",
      "summary": "",
      "description": "",
      "raw": "@returns {Boolean}"
    }
  ],
  "isClass": false,
  "isFunction": false,
  "isExports": false,
  "firstLine": " MyClass.prototype.isCompacter(options) {}",
  "raw": "Summary in a short and compact documentation\nLong description of this method\n@param {Object} [options]\n@returns {Boolean}",
  "flags": [
    "[options]",
    null
  ],
  "ignore": false
}