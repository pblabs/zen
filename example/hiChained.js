var zen=require('../zen');
var hello=function(buffer,next){buffer.push("hello");next();}
var world=function(buffer,next){buffer.push("world!");next();}
var print=function(buffer,next){next(null,buffer.join(' '));}
var stack=zen(hello,world,print);

stack.resultHandler = function result(buffer, res) {
	console.log("result have:",buffer.length,"chunk(s)");
    console.log(res);
    return;
};

stack(["Yet another"]);