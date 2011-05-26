var zen=require('../zen');
//These modules push strings in buffer, then forward it to the stack's resultHandler
var hello=function(buffer,next){buffer.push("hello");return next();}
var world=function(buffer,next){buffer.push("world!");return next();}
var print=function(buffer,next){return next(null,buffer.join(' '));}
var stack1=zen(hello,world,print);
// resultHandler simply returns res
stack1.resultHandler = function result(buffer, res) {
    return res;
};

// this module is part of another stack and is a tipical http request handler. 
// It runs the stack1 and pass result to next on callback 
var handler=function(request,response,next){var res=stack1(["Yet another"]);next(null,res);}

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