/**
 * Mutable Modules for Node.js
 * Create an instant plugin system for your module.
 * Reminder: Write in little bits of logic as much as possible for maximum
 * flexibility. See my module 'deduce' for an example.
 * 
 * By: Nate Ferrero
 * On: September 7th, 2011
 */
 
// Requirements
var path = require('path');

// This is so one can do require('mutable')(module);
module.exports = function Mutable(mod) {
    return new MutableModule(mod);
};

// There will now be a module.mutable available
function MutableModule(mod) {
    this.___module = mod;
    this.___exports = [];
    mod.mutable = MutableFeatures(this);
    mod.exports = MutableWrapper(this);
}

// Export features
function MutableFeatures(self) {
    return {
        
        // Gets the function arguments and adds them to the array
        exports: function MutableExports() {
            for(var i = 0; i < arguments.length; i++) {
                if(self.___exports.indexOf(arguments[i]) === -1)
                    self.___exports.push(arguments[i]);
            }
        },
        
        // Removes the function arguments from the array
        removeExports: function MutableRemoveExports() {
            for(var i = 0; i < arguments.length; i++) {
                var pos = self.___exports.indexOf(arguments[i]);
                if(pos !== -1)
                    self.___exports.splice(pos, 1);
            }
        },
        
        // Set the only flag, also if exec is true and str is the name of a 
        // function in the mutable object, it will be executed and returned.
        exportAs: function MutableExportsAs(str, exec) {
            self.___exports.only = str;
            self.___exports.onlyExec = exec;
        },
        
        // Clear the only flag, exports will now be whatever is in the array
        removeExportAs: function MutableRemoveExportsAs() {
            self.___exports.only = null;
        }
    };
}

// This wrapper allows chaining of functions, to allow for mutations
// var foo = require('foo').mutate('mutation1').mutate('m2').instance();  
// Any require(mutable module) must be followed by .instance();
function MutableWrapper(mutable) {
    var wrapper = {
        
        // This calls the function defined as module.exports.mutate in the mutation file
        // Create mutations like exports.mutate = function($, mutable) { ... }
        mutate: function mutate(mutation) {
            var dir = path.dirname(mutable.___module.filename);
            mutation = path.join(dir, 'mutations', mutation);
            
            console.log('[Mutable] Applying mutation: ' + mutation);
            
            require(mutation).mutate(mutable, mutable.___module.mutable);
            
            return wrapper;
        },
        
        // This gets the exports as previously set, and combines them in an object
        instance: function getMutableInstance() {
            var x = mutable.___exports;
            
            // If exportAs was used, return that export only
            if(x.only) {
                
                // Execute it first if requested
                if(x.onlyExec && typeof mutable[x.only] === 'function')
                    return mutable[x.only].apply(mutable.___module, arguments);
                else
                    return mutable[x.only];
            } else {
                
                // Assemble all exports
                var obj = {};
                for(var i = 0; i < x.length; i++)
                    obj[x[i]] = mutable[x[i]];
                return obj;
            }
        }
    };
    return wrapper;
}