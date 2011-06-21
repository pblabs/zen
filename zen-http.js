/**
 * Zen for triadic handler. Plus proper http error handling and responder
 */

/**
 * Default error handler
 */
var errorHandler = function error(req, resp, err) {
	if (err) {
		if (resp.writeHead) resp.writeHead(500, {
			"Content-Type": "text/plain"
		});
		if (resp.end) resp.end(err.stack + "\n");
		console.error(err.stack + "\n");
		return;
	}
	if (resp.writeHead) resp.writeHead(404, {
		"Content-Type": "text/plain"
	});
	if (resp.end) resp.end("Not Found\n");
	console.log("Not Found\n");
};
/**
 * Default result handler
 */
var resultHandler = function result(req, resp, result) {
	if (resp.writeHead) resp.writeHead(200, {
		"Content-Type": "octet/stream"
	});
	if (resp.end) resp.end(result);
	console.log("result");
};
/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*handlers*/) {
	/**
	 * Default handler delegates to the error handler
	 */
	var defaultHandler = function(a,b) {
		try {
			return engine.errorHandler(a,b,undefined); //explicit undef error passing
		} catch (ex) {
			return errorHandler(a,b,ex);
		}
	};
	var handlers=Array.prototype.slice.call(arguments).reverse();
	var L=handlers.length-1;

	var _engineRequests=[];
	var _enginePaused=false;
	var _engineStopped=false;
	// The real Zen Engine
	var engine= function (a,b) {		
		if (_enginePaused===true) {_engineRequests.push([a,b]);return;}
		if (_engineStopped===true) {return defaultHandler(a,b);}
	
		var i=L;
		try {
			function next (err,res) {
				if(!res&&!err) {
					if (--i>=0)
						return handlers[i](a,b,next);
				} else if (res)
					return engine.resultHandler(a,b,res)
				return engine.errorHandler(a,b,err);
			}

			return handlers[i](a,b,next);
		} catch (err) {
			try {
				return engine.errorHandler(a,b, err);
			} catch (ex) {
				return errorHandler(a,b,ex);
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
			engine(request[0],request[1]);
			request=requests.shift();
		}		
	};
	
	return engine;
};