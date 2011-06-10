/**
 * Zen for triadic handler. Plus proper http error handling and responder 
 */

/**
 * Default error handler
 */
var errorHandler = function error(req, resp, err) {
	if (err) {
		resp.writeHead(500, {
			"Content-Type": "text/plain"
		});
		resp.end(err.stack + "\n");
		return;
	}
	resp.writeHead(404, {
		"Content-Type": "text/plain"
	});
	resp.end("Not Found\n");
};
/**
 * Default result handler
 */
var resultHandler = function result(req, resp, result) {
	resp.writeHead(200, {
		"Content-Type": "octet/stream"
	});
	resp.end(result);
};
/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*layers*/) {
	var error = function(a, b, err) {
		return engine.errorHandler(a, b, err);
	};
	var layers=Array.prototype.concat([error],Array.prototype.slice.call(arguments).reverse());

	var L=layers.length-1;
	var first=layers[L];//first access optimization

	var nextHandler= function(a,b,err,res) {
		try {
			if (err) {
				return engine.errorHandler(a, b, err); //err
			}
			return engine.resultHandler(a, b, res);
		} catch (ex) {
			return engine.errorHandler(a, b, ex);
		}
	}
	
	// The real Zen Engine
	var engine= function (a,b) {
		var i=L;
		try {			
			var next= function(err,res) {
				if(!err&&!res) {					
					return layers[--i](a,b,next); 
				} 
				return nextHandler(a,b,err,res);
			}
			return first(a,b,next);
		} catch (err) {
			return engine.errorHandler(a, b, err);
		}
	}
	if (L==0){engine=first}; //no next
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	return engine;
};