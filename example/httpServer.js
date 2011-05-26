var zen=require('../zen');
var hello=function(request,response,next){next(null,"hello world!");}

var stack=zen(hello);

stack.resultHandler = function result(request,response, res) {
	response.writeHead(200,{'Content-type':'text/plain'})
	response.end(res);
    return;
};

stack.errorHandler = function result(request,response, err) {
	if (err) {
		response.writeHead(500,{'Content-type':'text/plain'})
		response.end(err.stack||err);
	}
	response.writeHead(404,{'Content-type':'text/plain'})
	response.end('Not Found');
    return;
};


require('http').createServer(stack).listen(8080);
console.log('app listen on port 8080');
