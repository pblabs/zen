var zen=require('../zen');
// an empty handler
var hw= function(next) {next()};

var zapp=zen(hw);

zapp();