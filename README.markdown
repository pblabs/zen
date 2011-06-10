# <img src="https://github.com/pblabs/zen/raw/master/logo.png"> Zen

_Z-engine (Zen)_ is the most simple, minimal, fast, full featured, general purpose javascript module stack engine.

It's like Ruby's Rack or Python WSGI, but for Node.js.

## Install

If you use npm, then install zen via npm. 

    npm install zen

If you don't use npm, then copy the single file `zen.js` somewhere you can get to it.   

## How to use

	var zenInstance=require('../zen')(
	  require('firstHandler')(),
      require('secondHandler')(handleArg1, handleArg2),
	);
	
	var result = zenInstance(<proper>, <application>, <args>); 

## Explanation

_Zen_ takes a list of handler functions and will chain them up by the next() method in a z-engine instance. 

Each handler needs to be of the form:

    function handler(<proper>, <application>, <args>, next) {
      // Either handle the request here using the arguments
      // or call `next()` to pass control to next module

	  // next uses node.js callback convention: 
      // any exceptions need to be caught and forwarded to `next(err)`
	  // result need to be forwarded with `next(null,res)`	

	  // without a call to `next` _Zen_ "drops" the chain  
    }


When using external modules we suggest to use the Setup Pattern, where the module is a callable function that returns the handler function.  

    module.exports = function setup(<some>, <useful>, <setup>, args) {
      // Do module setup stuff here
      return function handler(<proper>, <application>, <args>, next) {
        // Handle a request here
      };
    };

## What Zen Does

_Zen_ does a few things under the hood.

 - Creates standalone module engines. Multiple engines could be chained together.
 - Uses <a href='http://en.wikipedia.org/wiki/Continuation-passing_style'>continuation passing style</a>, but as long as an application stack uses `return next();` value returned from handle functions could be assigned to the caller.  
 - Wraps modules in a `try..catch` to catch any exception that happens running the engine.
 - Forwards errors and exceptions passed to any next module directly to the error handler.  This means module don't have to worry about errors from previous modules.
 - Forwards result passed to any next module directly to the result handler. This avoids generic result handling in module's business logic  

errorHandler and resultHandler could be overridden by custom functions. As handler above these needs to be of the form:

	zenInstance.errorHandler = function(<proper>, <application>, <args>, err) {
	}
	zenInstance.resultHandler= function(<proper>, <application>, <args>, res) {
	}

## What Zen Does NOT Do

Due its general purpose, _Zen_ does not provide any middleware modules of any kind. Take a look at http://github.com/pblabs/zen-garden 

#_Triadic subscriptions

The Book Clean Code (http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) states (@ chapter #3): 
	`The ideal number of arguments for a function is zero (niladic). 
	Next comes one (monadic), followed closely by two (dyadic). 
	Three arguments (triadic) should be avoided where possible. 
	More than three (polyadic) requires very special justification -- and then shouldn't be used anyway.` 

If you need multiple arguments there is a big chance that the method is doing more than it should or that you could abstract
the operation better. Mind the Javascript objects!!! 
Keep classes and functions as small as possible, break it into multiple "modules"... it is usually easier to 
understand what is going on.

_zen-http_ is _Zen_ for triadic handlers, includes proper result and error handlers and default 404 response. Connect and Stack compatible, really faster in real world use cases.
Use `next(err)` to push a 500 error message to the client, `next(null,result)` to send the result with status 200.

## Benchmarks

Internal benchmarks show how _Zen_ versions are faster than Stack and Stack2

<img src="https://github.com/pblabs/zen/raw/master/results.png">

# Conclusion

_Zen_ is available on github <a href='https://github.com/plabs/zen'>here</a>
under <a href='https://github.com/plabs/zen/blob/master/MIT-LICENSE.txt'>MIT license</a>.
If you hit bugs, fill issues on github.
Feel free to fork, modify and have fun with it :)

## Credits

_Zen_ takes ideas from Connect, Stack and internal projects under construction. 
