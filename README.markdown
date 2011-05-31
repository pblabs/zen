# Zen

Z-engine (Zen) is the most simple, minimal, fast, full featured, general purpose javascript module stack engine.

It's like Ruby's Rack or Python WSGI, but in a Node.js environment.

## Optimized version

Zen bundles optimized versions for specific purpose:
	- zen-http: a HTTP request,response module engine. Connect and Stack compatible, faster in real world use cases  

## Benchmarks

Internal benchmarks show how faster are Zen versions vs. Stack and Stack2

![results.img](results.png)  

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

Zen takes a list of handler functions and will chain them up by the next() method in a z-engine instance. 

Each handler needs to be of the form:

    function handler(<proper>, <application>, <args>, next) {
      // Either handle the request here using the arguments
      // or call `next()` to pass control to next module

	  // next uses node.js callback convention: 
      // any exceptions need to be caught and forwarded to `next(err)`
	  // result need to be forwarded with `next(null,res)`	

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

Zen does a few things under the hood.

 - Creates standalone module engines, escaping node's module caching. With this engines could be chained together.
 - Calls each module passing first given arguments. This means modules can "chain" partial result by reference (using object or array).
 - Returns any given value to parent handler. This means as long as application uses `return next();` value returned could be popped to the caller (useful for synchronous application stack).  
 - Wraps modules in a `try..catch` to catch any exceptions that happen running the engine.
 - Forwards errors and exceptions passed to any next module directly to the error handler.  This means module don't have to worry about errors from previous modules.
 - Forwards result passed to any next module directly to the result handler. This avoids generic result handling in module's business logic  

errorHandler and resultHandler could be overridden by custom functions. As handler above these needs to be of the form:

	zenInstance.errorHandler = function(<proper>, <application>, <args>, err) {
	}
	zenInstance.resultHandler= function(<proper>, <application>, <args>, res) {
	}

## What Zen Does NOT Do

Due its general purpose, Zen does not provide any middleware modules of any kind. Take a look at http://github.com/pblabs/zen-garden 

## Background
Zen takes ideas from Connect, Stack and internal projects under construnction. 