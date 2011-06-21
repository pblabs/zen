/**
 * Zen
 */

/**
 * Default error handler
 */
var errorHandler = function error(/*args,*/ /*err*/) {
	var err=(arguments.length >0)?arguments[arguments.length-1]:null;
	if (typeof err == "undefined" || !err)
		return console.error("Error:","This is the end, with no result given");
	var error=err;
	if (err.stack)
		error=err.stack;
	console.error("Error:",error);
	return;
};
/**
 * Default result handler
 */
var resultHandler = function result(/*args,*/ /*res*/) {
	var res=(arguments.length >0)?arguments[arguments.length-1]:null;
	if (res)
		console.log(res);
	return;
};
/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*handlers*/) {
	/**
	 * Default handler delegates to the error handler
	 */
	var defaultHandler = function(/*args*/) {
		try {
			var arg= Array.prototype.slice.call(arguments);
			arg.push(undefined);//err
			return engine.errorHandler.apply(this,arg);
		} catch (ex) {
			var arg= Array.prototype.slice.call(arguments);
			arg.push(ex);//err
			return errorHandler.apply(this,arg);
		}
	};
	var handlers=Array.prototype.slice.call(arguments).reverse();
	var L=handlers.length-1;
	
	var _engineRequests=[];
	var _enginePaused=false;
	var _engineStopped=false;
	// The real Zen Engine
	var engine= function (/*handleArgs*/) {
		
		if (_enginePaused===true) {_engineRequests.push(Array.prototype.slice.call(arguments));return;}
		if (_engineStopped===true) {return defaultHandler.apply(this,Array.prototype.slice.call(arguments));}
		
		var i=L;
		try {
			var handleArgs=Array.prototype.slice.call(arguments);
			var self=this;
			//handler optimization
			var argLength=arguments.length;
			function handle(handler) {
				switch (argLength) {
					// faster
					case 0:
						return handler.call(self, next);
						break;
					case 1:
						return handler.call(self, handleArgs[0],next);
						break;
					case 2:
						return handler.call(self, handleArgs[0],handleArgs[1], next);
						break;
					case 3:
						return handler.call(self, handleArgs[0],handleArgs[1], handleArgs[2],next);
						break;
					case 4:
						return handler.call(self, handleArgs[0],handleArgs[1], handleArgs[2], handleArgs[3], next);
						break;

					// slower
					default:
						var nextedArgs=Array.prototype.slice.call(handleArgs);
						nextedArgs.push(next)
						return handler.apply(self, nextedArgs);
				}
			}

			function next (err,res) {
				if(!res&&!err) {
					if (--i>=0)
						return handle(handlers[i]);
				} else if (res) {
					handleArgs.push(res);
					return engine.resultHandler.apply(this,handleArgs);
				}
				handleArgs.push(err);
				return engine.errorHandler.apply(this,handleArgs);
			}

			return handle(handlers[i]);
		} catch (err) {
			try {
				console.log(err.stack);
				handleArgs.push(err);
				return engine.errorHandler.apply(this,handleArgs);
			} catch (ex) {
				handleArgs[handleArgs.length-1]=ex;
				return errorHandler.apply(this,handleArgs);
			}
		}
	}
	if (L<0)
		engine=defaultHandler; //default
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	
	/*EXTRA FEATURE*/
	engine.pause=function (){_enginePaused=true;};	
	engine.stop =function (){_engineStopped=true;};	
	engine.resume=function(){
		_enginePaused=_engineStopped=false;
		var requests= Array.prototype.slice.call(_engineRequests);
		_engineRequests=[];
		var request=requests.shift();
		while(typeof request !=='undefined'){
			engine.apply(this,request);
			request=requests.shift();
		}		
	};

	
	return engine;
};