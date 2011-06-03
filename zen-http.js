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
	var error = function(req, resp, err) {
		return engine.errorHandler(req, resp, err);
	};
	var layers=Array.prototype.concat([error],Array.prototype.slice.call(arguments).reverse());

	var L=layers.length-1;
	var first=layers[L];//first access optimization

	var nextHandler= function(req,resp,err,res) {
		try {
			if (err) {
				return engine.errorHandler(req, resp, err); //err
			}
			if (resp)
				return engine.resultHandler(req, resp, res);
		} catch (ex) {
			return engine.errorHandler(req, resp, ex);
		}
		return;
	}
	// The real Zen Engine
	var engine= function (req, resp) {
		var i=L;
		try {
			var next= function(err,res) {
				if (err||res) //response optimization
					return nextHandler(req,resp,err,res);
				else
					return layers[--i](req,resp,next);
			}
			return first(req,resp,next);
		} catch (err) {
			return engine.errorHandler(req, resp, err);
		}
	}
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	return engine;
};