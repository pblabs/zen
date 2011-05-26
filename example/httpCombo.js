var zen=require('../zen');

var hello=function(buffer,next){buffer.push("hello");return next();}
var world=function(buffer,next){buffer.push("world!");return next();}
var print=function(buffer,next){return next(null,buffer.join(' '));}
var stack1=zen(hello,world,print);
stack1.resultHandler = function result(buffer, res) {
    return res;
};

var handler=function(request,response,next){var res=stack1(["Yet another"]);next(null,res);}

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

require('http').createServer(stack2).listen(8080);
console.log('app listen on port 8080');