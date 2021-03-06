# <img src="https://github.com/pblabs/zen/raw/master/logo.png"> Zen

_Z-engine (Zen)_ is the most simple, safe, minimal, fast, full featured, general purpose javascript module stack engine for Node.js.

Basically it's like Connect or Stack, but simpler and faster.

Zen comes into two flavours: zen-http and zen: 
- zen is a general purpose engine
- zen-http is designed to be used for triadic modules (like http servers) where extreme performance is a requirement.
 
## Install

As simple as

    npm install zen

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

	  // without a call to `next` Zen "drops" the chain  
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
When a `Handler` throws exception, this is catched by the original errorHandler (that prints on console).
 - `zapp.resultHandler` : this is the result handler. When it throws exception this is catched by the `errorHandler`.   
 - `zapp.pause` : pauses the engine and buffers the requests.
 - `zapp.stop` : stops the engine, requests will be forwarded to the errorHandler.
 - `zapp.resume` : resumes the engine and flushes the requests buffer on the engine.

# Zen-http
_zen-http_ is a special flavour of _Zen_ for triadic handlers (like http server). It includes proper HTTP result and error handlers and default 404 response. Connect and Stack compatible.
Use `next(err)` to push a 500 error message to the client, `next(null,result)` to send the result with status 200.

# Benchmarks

_Zen_ flavours are faster than Stack and Stack2 on real world use cases

<img src="https://github.com/pblabs/zen/raw/master/results.png">

# Conclusion

_Zen_ is available on <a href='https://github.com/pblabs/zen'>github</a>
under <a href='https://github.com/pblabs/zen/blob/master/MIT-LICENSE.txt'>MIT license</a>. If you found bugs, please fill issues on <a href="https://github.com/pblabs/zen/issues">github</a>. 
Feel free to fork, modify and have fun with it ;-)

## Credits

_Zen_ takes ideas from Connect and Stack
