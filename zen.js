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
	return;
};
/**
 * Zen uses a 'setup' pattern, returning a callable engine function
 */
module.exports= function (/*layers*/) {
	var error = function(/*args*/) {
		return engine.errorHandler.apply(this,arguments);
	},
	layers=Array.prototype.concat([error],Array.prototype.slice.call(arguments).reverse());

	var L=layers.length-1;
	var first=layers[L]; //first access optimization

	var nextHandler= function(/* args, err, res */) {
		var args=Array.prototype.slice.call(arguments);
		var res=args.pop();
		var err=args.pop();
		try {
			if (err) {
				args.push(err);
				return engine.errorHandler.apply(this,args);
			} else if (res) {
				args.push(res);
				return engine.resultHandler.apply(this,args);
			}
		} catch (ex) {
			args.push(ex);
			return engine.errorHandler.apply(this,args);
		}
	}
	// The real Zen Engine
	var engine= function (/*handleArgs*/) {
		var handleArgs=Array.prototype.slice.call(arguments);
		var self=this;
		var i=L;
		var next= function(err,res) {
			if(err||res) {
				handleArgs[handleArgs.length-1]=err; //overriding last arg
				return nextHandler.apply(self,Array.prototype.concat(handleArgs,[res]));
			} else
				return layers[--i].apply(self,handleArgs);
		}
		handleArgs.push(next);
		try {
			return first.apply(self,handleArgs);
		} catch (err) {
			handleArgs[handleArgs.length-1]=err; //overriding last arg
			return handle.errorHandler.apply(self,handleArgs);
		}
	}
	engine.errorHandler = errorHandler;
	engine.resultHandler = resultHandler;
	return engine;
};