# Zen

Zen is a simple, minimal, fast, general purpose javascript module stack engine.

Basically it's extend the idea of http://github.com/creationix/stack to general purpose application.

## Install

If you use npm, then install zen via npm.  Also, remember to put it as a dependency in your own project's package.json file.

    npm install zen

If you don't use npm (Like you're on a phone), then simply copy the single file `zen.js` somewhere you can get to it.

## Example

    http.createServer(require('zen')(
      require('firstMiddleware')(),
      require('secondMiddleware')(root, mount),
      //...
    )).listen(8080);

## Explanation

As seen on creationix/stack, it takes a list of handler functions and will chain them up for you. 

Each handler needs to be of the form:

    function handler(your, personal, args, next) {
      // Either handle the request here using the arguments
      // or call `next()` to pass control to next module

	  // next uses node.js callback convention: 
      // any exceptions need to be caught and forwarded to `next(err)`
	  // result need to be forwarded with `next(null,res)`	

	  // without a call to `next(err,result) ` Zen "drops" the chain  
    }

When using external modules a good convention is to make the module be a callable setup function that returns the handler function.  The first example uses modules created after this pattern.

    module.exports = function setup(some, args) {
      // Do server set up stuff here
      return function handler(your, personal, args, next) {
        // Handle a single request here
      };
    };

## What Zen Does

Zen does a few things under the hood.

 - Creates standalone module stacks, escaping node's module caching. With this stacks could be chained together.
 - Calls each module passing given arguments. This means modules can "chain" partial result by reference.
 - Returns any given value to parent handler. This means as long as application uses `return next();` value returned could be popped to the caller (useful for synchronous application stack).  
 - Wraps each layer in a `try..catch` to catch any exceptions that happen in the main execution stack module's handler function or in the callback.
 - Forwards errors and exceptions passed to any next module directly to the error handler.  This means module don't have to worry about errors from previous modules.
 - Forwards result passed to any next module directly to the result handler. This avoids generic result handling in module's business logic  

errorHandler and resultHandler could be overridden by custom functions. As sample above these needs to be of the form:

function errorHandler(your, personal, args, err) {
}

function resultHandler(your, personal, args, res) {
}

## What Zen Does NOT Do

Due its general purpose, Zen does not provide any middleware modules of any kind.

