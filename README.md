# Mutable

## Or, stop relying on pull requests to satisfy everyone's needs from your module

Mutable is a simple module enhancer for Node.js, allowing anyone to write a custom mutation file for your module.

To use a mutable module mutation, add a `mutations` folder in the module folder and place the mutations files in there. Then

    var mymodule = require('mymodule').mutate('extras').mutate('logging').instance();


## Installation

    npm install mutable

## Building a Mutable Module

### Note on `module.exports`

Don't use the traditional `module.exports` or `exports`, as that will be automatically handled by Mutable. There are four new functions available to help you manage exports.

`module.mutable.exports('property1', 'property2', ...);` Add an export (or many) by calling this.

`module.mutable.removeExports('property1', ...);` Remove exports.

`module.mutable.exportAs('property');` This sets the exports var directly to one value and will override any other exports.

`module.mutable.removeExportAs();` Clear the override, allowing all other exports to be used.

### Module example (i.e. mymodule.js)

    var $ = require('mutable')(module);
    
    module.mutable.exports('someFunction');
    
    $.someProperty = 'One';
    
    $.someFunction = function someFunction() {
        return 'Number ' + $.someProperty;
    };
    
## Using a Mutable Module

It's just like using a normal module, except to allow for mutations, you just need to add .instance() after the require.

    var mymodule = require('mymodule').instance();
    
    console.log(mymodule.someFunction());
    
    // Number One
    
## Building a mutation

Because of the way JavaScript handles scope, and the logical order of things, it makes sense to export a function `mutate` in our mutation file.

    // File: mymodule/mutations/evil.js
    // It's good practice to name your inline function declarations
    exports.mutate = function evilMutation($, mutable) {
       $.someFunction = function() { return 'Hahaha'; };
    }

## Using a mutation in your module

    var mymodule = require('mymodule').mutate('evil').instance();
    
    console.log(mymodule.someFunction());
    
    // Hahaha
    
That's all there is!