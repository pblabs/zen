# <img src="https://github.com/pblabs/zen/raw/master/logo.png"> Zen

_Z-engine (Zen)_ is the most simple, safe, minimal, fast, full featured, general purpose javascript module stack engine.

It's like Ruby's Rack or Python WSGI, but for Node.js.

## Install

As simple as

    npm install zen

If you don't use npm, then copy the single file `zen.js` somewhere you can get to it.   

## How to use

	var zapp=require('../zen')(
	  require('firstHandler')(),
      require('secondHandler')(handleArg1, handleArg2),
	);
	
	var result = zapp(<proper>, <application>, <args>); 

## Explanation

_Zen_ takes a list of handler functions and will chain them up by the next() method in a z-engine instance. 

Each handler needs to be of the form:

    function handler(<proper>, <application>, <args>, next) {
      // Either handle the request here using the arguments
      // or call `next()` to pass control to next module

	  // next uses node.js callback convention: 
      // any exceptions need to be caught and forwarded to `next(err)`
	  // result needs to be forwarded with `next(null,res)`	

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
 - Wraps handlers in a `try..catch` to catch any exception that happens running the engine.
 - Forwards errors and exceptions passed to any next module directly to the error handler.  This means module doesn't have to worry about errors from previous modules.
 - Forwards result passed to any next module directly to the result handler. This avoids generic result handling in module's business logic  

errorHandler and resultHandler could be overridden by custom functions. As handler above these needs to be of the form:

	zapp.errorHandler = function(<proper>, <application>, <args>, err) {
	}
	zapp.resultHandler= function(<proper>, <application>, <args>, res) {
	}

## What Zen Does NOT Do

Due its general purpose, _Zen_ does not provide any middleware modules of any kind.

## API

 - `zapp.errorHandler` : this is the default request handler and the called handler on errors. Must be a function.
When an `errorHandler` throws exception, this is catched by the original errorHandler (that prints on console).
 - `zapp.resultHandler` : this is the result handler. When it throws exception this is catched by the `errorHandler`.   
 - `zapp.pause` : pauses the engine and buffers the requests.
 - `zapp.stop` : stops the engine, requests will be forwarded to the errorHandler.
 - `zapp.resume` : resumes the engine and flushes the requests buffer on the engine.

# Triadic subscriptions

The Book <a href="http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882">Clean Code</a> states: 
	
	The ideal number of arguments for a function is zero (niladic). 
	Next comes one (monadic), followed closely by two (dyadic). 
	Three arguments (triadic) should be avoided where possible. 
	More than three (polyadic) requires very special justification -- and then shouldn't be used anyway.

If you need multiple arguments there is a big chance that the method is doing more than it should or that you could abstract
the operation better. Mind the Javascript objects!!! 

Keep classes and functions as small as possible, break it into multiple "modules"... it is usually easier to 
understand what is going on.

_zen-http_ is a special flavour of _Zen_ for triadic handlers. It includes proper HTTP result and error handlers and default 404 response. Connect and Stack compatible, a lot faster in real world use cases.
Use `next(err)` to push a 500 error message to the client, `next(null,result)` to send the result with status 200.

## Benchmarks

Internal benchmarks show how _Zen_ versions are faster than Stack and Stack2

<img src="https://github.com/pblabs/zen/raw/master/results.png">

# Conclusion

_Zen_ is available on github <a href='https://github.com/plabs/zen'>here</a>
under <a href='https://github.com/plabs/zen/blob/master/MIT-LICENSE.txt'>MIT license</a>.

If you found bugs, please fill issues on github.

Feel free to fork, modify and have fun with it :)

## Credits

_Zen_ takes ideas from Connect, Stack and internal projects under construction. 
