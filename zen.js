/**
 * Default error handler
 */
errorHandler = function error(/*args,*/ err) {
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
resultHandler = function result(/*args,*/ res) {
	console.log(res);
	return;
};

module.exports= function (/*layers*/) {
	var error = function(/*args*/) {
		return handle.errorHandler.apply(this,arguments);
	},
	result= function(/*args*/) {
		return handle.resultHandler.apply(this,arguments);
	},
	handle = error;
	Array.prototype.slice.call(arguments).reverse().forEach( function (layer) {
		var child = handle;
		handle = function (/*arguments*/) {
			var self=this;
			var handleArgs=Array.prototype.slice.call(arguments);
			var layerArgs=Array.prototype.slice.call(handleArgs);
			layerArgs.push( function next (err,res) {
				try {
					if (err) {
						var errArgs=Array.prototype.slice.call(handleArgs);
						errArgs.push(res);
						return error.apply(self,errArgs);
					}
					if (res) {
						var resArgs=Array.prototype.slice.call(handleArgs);
						resArgs.push(res);
						return result.apply(self,resArgs);
					}
					return child.apply(this,handleArgs);
				} catch (err) {
					var errArgs=Array.prototype.slice.call(handleArgs);
					errArgs.push(res);
					return error.apply(this,errArgs);
				}
			});
			try {
				return layer.apply(this,layerArgs);
			} catch (err) {
				var errArgs=Array.prototype.slice.call(handleArgs);
				errArgs.push(err);
				return error.apply(this,errArgs);
			}
		};
	});
	handle.errorHandler = errorHandler;
	handle.resultHandler = resultHandler;
	return handle;
};