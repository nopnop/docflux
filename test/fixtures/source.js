
/**
 * A useful class
 *
 * This is exported (isExport must be true)
 *
 * @author Jean Ponchon
 */
var MyClass = module.exports = ClassCreator({
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
    *            function() { ... }
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
    createUser: function(name, groupId, options) {}
})

/**
 * Summary in a short and compact documentation
 * Long description of this method
 * @param {Object} [options]
 * @returns {Boolean}
 */
 MyClass.prototype.isCompacter = function(options) {}
