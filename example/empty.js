var zen=require('../zen');
// an empty handler
var hw=function(next){next()};
//build app
var stack=zen(hw);
//run
stack();
