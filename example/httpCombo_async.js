var zen=require('../zen');
//These modules push strings in buffer, then forward it to the stack's resultHandler
var hello=function(buffer,cb,next){buffer.push("hello"); next();}
var world=function(buffer,cb,next){buffer.push("world!"); next();}
var print= function(buffer,cb,next) {
	process.nextTick( function() { //ASYNC!
		next(null,buffer.join(' '));
	});
}
var stack1=zen(hello,world,print);
// resultHandler gets result and pass it to a callback
stack1.resultHandler = function result(buffer,cb,res) {
    cb(res);
    return;
};

// this module is part of another stack and is a tipical http request handler. 
// It runs the stack1 and pass result to next on callback 
var handler= function(request,response,next) {
	stack1(
		["Yet another"], 
		function(res) { //callback
			next(null,res);
		}
	);
}
//new stack created
var stack2=zen(handler);

stack2.resultHandler = function result(request,response, res) {
	response.writeHead(200,{'Content-type':'text/plain'})
	response.end(res);
    return;
};

stack2.errorHandler = function result(request,response, err) {
	if (err) {
		response.writeHead(500,{'Content-type':'text/plain'})
		response.end(err.stack||err);
	}
	response.writeHead(404,{'Content-type':'text/plain'})
	response.end('Not Found');
    return;
};
//http server puts requests to stack2 
require('http').createServer(stack2).listen(8080);
console.log('app listen on port 8080');