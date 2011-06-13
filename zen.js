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
	if (res) console.log(res);
	return;
};


/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*layers*/) {
	/**
	 * Default handler delegates to the error handler
	 */
	var defaultHandler = function(/*args*/) {
		var arg= Array.prototype.slice.call(arguments);
		arg.push(undefined);//err
		return engine.errorHandler.apply(this,arg);
	};
	
	var layers=Array.prototype.slice.call(arguments).reverse();	
	var L=layers.length-1;
		
	// The real Zen Engine
	var engine= function (/*handleArgs*/) {
		var handleArgs=Array.prototype.slice.call(arguments);
		var self=this;
		var i=L;
				
		//handler optimization
		var argLength=arguments.length;
		try {
			function handle(handler){
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
					if (--i>=0) return handle(layers[i]);
				} 
				if (res) {
					handleArgs.push(res);
					return engine.resultHandler.apply(this,handleArgs);
				}
				handleArgs.push(err);
				return engine.errorHandler.apply(this,handleArgs);		
			}
														
			return handle(layers[i]);
		} catch (err) {
			handleArgs.push(err);
			try{
			return engine.errorHandler.apply(self,handleArgs);
			} catch(ex) {
				handleArgs[handleArgs.length-1]=ex;
				return errorHandler.apply(self,handleArgs);
			}
		}
	}
	if (L<0){engine=defaultHandler}; //default
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	return engine;
};
