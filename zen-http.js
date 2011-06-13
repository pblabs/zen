/**
 * Optimized HTTP request,response Zen
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
		console.error(err.stack + "\n");
		return;
	}
	resp.writeHead(404, {
		"Content-Type": "text/plain"
	});
	resp.end("Not Found\n");
	console.log("Not Found\n");
};
/**
 * Default result handler
 */
var resultHandler = function result(req, resp, result) {
	resp.writeHead(200, {
		"Content-Type": "octet/stream"
	});
	resp.end(result);
	console.log("result");
};
/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*handlers*/) {
	/**
	 * Default handler delegates to the error handler
	 */
	var defaultHandler = function(req, resp) {
		try {
			return engine.errorHandler(req, resp,undefined); //explicit undef error passing
		} catch (ex) {
			return errorHandler(req,resp,ex);
		}
	};
	var handlers=Array.prototype.slice.call(arguments).reverse();
	var L=handlers.length-1;
	// The real Zen Engine
	var engine= function (req, resp) {
		var i=L;
		try {
			function next (err,res) {
				if(!res&&!err) {
					if (--i>=0)
						return handlers[i](req,resp,next);
				} else if (res)
					return engine.resultHandler(req,resp,res)
				return engine.errorHandler(req,resp,err);
			}

			return handlers[i](req,resp,next);
		} catch (err) {
			try {
				return engine.errorHandler(req, resp, err);
			} catch (ex) {
				return errorHandler(req,resp,ex);
			}
		}
	}
	if (L<0)
		engine=defaultHandler; //default
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	return engine;
};