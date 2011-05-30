/**
 * Default error handler
 */
errorHandler = function error(/*args,*/ /*err*/) {
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
resultHandler = function result(/*args,*/ /*res*/) {
	var res=(arguments.length >0)?arguments[arguments.length-1]:null;
	console.log(res);
	return;
};

module.exports= function (/*layers*/) {
	var error = function(/*args*/) {
		return handle.errorHandler.apply(self,arguments);
	},
	result= function(/*args*/) {
		return handle.resultHandler.apply(self,arguments);
	},
	layers=Array.prototype.concat([error],Array.prototype.slice.call(arguments).reverse());
	var handleArgs,self;
	var L=layers.length-1;
	var first=layers[L];
	var i=L;
	var next= function(err,res) {
		try {
			if (err) {
				handleArgs[handleArgs.length-1]=err; //overriding last arg
				return error.apply(self,handleArgs);
			}
			if (res) {
				handleArgs[handleArgs.length-1]=res; //overriding last arg				
				return result.apply(self,handleArgs);
			}
			return layers[--i].apply(self,handleArgs);
		} catch (err) {
			handleArgs[handleArgs.length-1]=err; //overriding last arg
			return error.apply(self,handleArgs);
		}
	}
	var handle= function (/*handleArgs*/) {
		self=this;
		try {
			handleArgs=Array.prototype.slice.call(arguments);
			handleArgs.push(next);
			return first.apply(self,handleArgs);
		} catch (err) {
			handleArgs[handleArgs.length-1]=err; //overriding last arg
			return error.apply(self,handleArgs);
		}
	}
	handle.errorHandler = errorHandler;
	handle.resultHandler = resultHandler;
	return handle;
};