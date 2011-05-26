var zen=require('../zen');
//a simple handler
var hw=function (next){ next(null,"hello world!")};
//build stack
var stack=zen(hw);
//run
stack();
