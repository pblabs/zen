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
		var args= Array.prototype.slice.call(arguments);
		try {
			args[args.length-1]=undefined;//err
			return engine.errorHandler.apply(this,args);
		} catch (ex) {
			args[args.length-1]=ex;//err
			return errorHandler.apply(this,args);
		}
	};
	var handlers=Array.prototype.slice.call(arguments);
        handlers.push(defaultHandler);

	var _engineRequests=[];
	var _enginePaused=false;
	var _engineStopped=false;
	var firstM=handlers[0];
	// The real Zen Engine
	var engine= function (/*handleArgs*/) {
		
		var handleArgs=Array.prototype.slice.call(arguments);
		var handleArgsLength=handleArgs.length;
		
		if (_enginePaused || _engineStopped){
			if (_enginePaused) {_engineRequests.push(handleArgs);return;}
			handleArgs.push(undefined); return defaultHandler.apply(this,handleArgs);
		}
	
		var i=1;	
		var self=this;
		try {
			//handler optimization
			var handle;
			var ha0,ha1,ha2,ha3;
			switch (handleArgsLength) {
				// faster
				case 0:
					handle= function(_handler){ 
						return _handler.call(self,next);
					};
					break;
				case 1:
					ha0=handleArgs[0];
					handle= function(_handler){ 
						return _handler.call(self,ha0,next);
					};
					break;
				case 2:
					ha0=handleArgs[0];ha1=handleArgs[1];
					handle= function(_handler){ 
						return _handler.call(self,ha0,ha1, next);
					};
					break;
				case 3:
					ha0=handleArgs[0];ha1=handleArgs[1];ha2=handleArgs[2];
					handle= function(_handler){ 
						return _handler.call(self,ha0,ha1,ha2,next);
					};
					break;
				case 4:
					ha0=handleArgs[0];ha1=handleArgs[1];ha2=handleArgs[2];ha3=handleArgs[3];
					handle= function(_handler){ 
						return _handler.call(self,ha0,ha1,ha2,ha3, next);
					};
					break;
				// slower
				default:
					handle= function(_handler){ 
						return _handler.apply(self, handleArgs);
					}
					break;
			}

			function next (err,res) {
				if(res || err){
					if (res) {
						handleArgs[handleArgsLength]=res;
						return engine.resultHandler.apply(this,handleArgs);
					}
					handleArgs[handleArgsLength]=err;
					return engine.errorHandler.apply(this,handleArgs);
				}	
				return handle(handlers[i++]);
			}
		        handleArgs.push(next);
			return handle(firstM);
		} catch (err) {
			try {
				//console.log(err.stack);
				handleArgs[handleArgsLength]=err;
				return engine.errorHandler.apply(this,handleArgs);
			} catch (ex) {
				handleArgs[handleArgsLength]=ex;
				return errorHandler.apply(this,handleArgs);
			}
		}
	}
	/*if (handlers.length==1)
		engine=defaultHandler; //default */
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
