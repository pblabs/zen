var zen=require('../zen');

this.core = {
  '0. Zen should run without handler ': function (test) {	
	//build app
	var zapp=zen();
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	//run
	zapp();

	test.expect(1);
    test.done();
	
  	},
  	'1. Zen should run one handler': function (test) {	
	var hw=function(){test.ok(true, 'The handler was executed');};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};		
	zapp();

	test.expect(1);
    test.done();
	
  	},
    '2. Zen should run errorHandler on errors': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next('error')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},
  	'3. Zen should run resultHandler on result': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next(null,'result')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(true, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},	
  	'4. Zen should run errorHandler on last empty "next()"': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next()};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();	
  	},	
  '5. Zen should run with parameter and without handler ': function (test) {	
	var zapp=zen();
	zapp.errorHandler=function(value1){
		test.ok(arguments.length===1, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
	};		
	zapp(1);

	test.expect(2);
    test.done();
	
  	},
  	'6. Zen should run one handler with parameters': function (test) {	
	var hw=function(value1,next){
		test.ok(arguments.length===2, 'The handler was executed with the correct number of arguments');
		test.ok(typeof value1 !== 'undefined', 'The handler was executed with the value `' + value1 + '`.');
		test.ok(typeof next !== 'undefined', 'The handler was executed with the value `' + next + '`.');
	};
	var zapp=zen(hw);
	zapp(1);

	test.expect(3);
    test.done();
	
  	},
    '7. Zen should run errorHandler on errors': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next('error')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},
  	'8. Zen should run resultHandler on result': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next(null,'result')};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(false, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(true, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();
	
  	},	
  	'9. Zen should run errorHandler on last empty "next()"': function (test) {	
	var hw=function(next){test.ok(true, 'The handler was executed');next()};
	var zapp=zen(hw);
	zapp.errorHandler=function(){test.ok(true, 'The errorHandler was executed');};
	zapp.resultHandler=function(){test.ok(false, 'The resultHandler was executed');};
	zapp();

	test.expect(2);
    test.done();	
  	},	


	
};
