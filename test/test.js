var expect = require('chai').expect;
var stdout = require('test-console').stdout;
var flujd = require('../bin/flujd');

describe('Flujd tests:',function(){
	describe('Interface: ', function(){
		it('should pass if showWelcome() works correctly', function(){
			var actual_output = stdout.inspectSync(function() {
				flujd.showWelcome()	
			});
			var  presumed_output = new Array(
			      "\u001b[36m           _____ _       _     _\u001b[39m\n",
			      "\u001b[36m          |  ___| |     (_)   | |\u001b[39m\n",
			      "\u001b[36m          | |_  | |_   _ _  __| |\u001b[39m\n",
			      "\u001b[36m          |  _| | | | | | |/ _` |\u001b[39m\n",
			      "\u001b[36m          | |   | | |_| | | (_| |\u001b[39m\n",
			      "\u001b[36m          \\_|   |_|\\__,_| |\\__,_|\u001b[39m\n",
			      "\u001b[36m                       _/ |      \u001b[39m\n",
			      "\u001b[36m                      |__/       \u001b[39m\n",
			      "\u001b[36m\n    Started and istening on port: 8888\n\u001b[39m\n",
			      "\u001b[33mCouldn't find --source parameter, falling back to index.html\n\u001b[39m\n"
			); 
			expect(presumed_output).to.deep.equal(actual_output);
		});
		it('should pass if openBrowser() works correctly', function(){
			expect(1).to.equal(0);
		});
		it('should pass if prepareSmartExit() works correctly', function(){
			expect(1).to.equal(0);
		});
	});

	describe('Control: ', function(){
		it('should pass if startRouting() works correctly', function(){
			expect(1).to.equal(0);
		});
		it('should pass if prepareSocket() works correctly', function(){
			expect(1).to.equal(0);
		});
		it('should pass if startServer() works correctly', function(){
			expect(1).to.equal(0);
		});
	});
});
