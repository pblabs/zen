/**
 * Optimized HTTP request,response Zen
 */

/**
 * Default error handler
 */
errorHandler = function error(req, resp, err) {
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
resultHandler = function result(req, resp, result) {	
	resp.writeHead(200, {
		"Content-Type": "octet/stream"
	});
	resp.end(result);
};

module.exports= function (/*layers*/) {
	var error = function(req, resp, err) {
		return handle.errorHandler(req, resp, err);
	};
	var layers=Array.prototype.concat([error],Array.prototype.slice.call(arguments).reverse());

	var L=layers.length-1;
	var first=layers[L];//first access optimization

	var nextHandler= function(req,resp,err,res) {	
		try {
			if (err){
				return handle.errorHandler(req, resp, err); //err				
			}
			if (resp)				
				return handle.resultHandler(req, resp, res);
		} catch (ex) {
			return handle.errorHandler(req, resp, ex);
		}
		return;
	}
	var handle= function (req, resp) {
		var i=L;
		var next= function(err,res) {			
			if (err||res) //response optimization
				return nextHandler(req,resp,err,res);
			else	
				return layers[--i](req,resp,next);
		}
		try {
			return first(req,resp,next);
		} catch (err) {
			return handle.errorHandler(req, resp, err);
		}
	}
	handle.errorHandler = errorHandler;
	handle.resultHandler = resultHandler;
	return handle;
};