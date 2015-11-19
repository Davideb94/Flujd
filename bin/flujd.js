#! /usr/bin/env node

var Flujd = {

	source: null,
	port: null,
	toWatch: null,
	fs: null,
	express: null,
	app: null,
	server: null,
	io: null,
	open: null,
	dt: null,
	stdin: null,
	argv: null,

	init: function () {
		this.dt = new Date();
		this.colors = require('colors/safe');//To use colors in console.log
		this.argv = require('minimist')(process.argv);
		this.source = ( this.argv['source'] != undefined ) ? this.argv['source'] : 'index.html';	//Defines which page to read. Default: index.html
		this.port = (this.argv['port'] != undefined) ? this.argv['port'] : 8888;	//Defines which port to use. Default: 8888
		this.toWatch = './';	//Defines which folder to watch.
		this.fs = require('fs');		//Includes File System to use fs.watch
		this.express = require('expess');	//Includes Express to start an express server
		this.app = this.express();	//Creates an instance of express
			this.app.use(this.express.static('.'));		//Selects the directory where the server has to watch
		this.server = require('http').Server(this.app);	//Includes the http module and creates the server
		this.io = require('socket.io')(this.server);	//Includes socket.io to communicate between the server and the browser
		this.open = require('open');		//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window
		this.stdin = process.stdin;
	},

	run: function(){
		try{
			this.init();
		}catch(err){
			Flujd.interface.printLog('Error initializing modules:','error');
			Flujd.interface.printLog(err, 'error');
			process.exit();
		}
		Flujd.controller.init();
		Flujd.interface.init();
	},

	interface:{

		init: function () {
			Flujd.interface.showWelcome();
			Flujd.interface.openBrowser();
			Flujd.interface.prepareSmartExit();
		},

		showWelcome: function () {
			console.log(Flujd.colors.cyan('           _____ _       _     _'));
			console.log(Flujd.colors.cyan('          |  ___| |     (_)   | |'));
			console.log(Flujd.colors.cyan('          | |_  | |_   _ _  __| |'));
			console.log(Flujd.colors.cyan('          |  _| | | | | | |/ _` |'));
			console.log(Flujd.colors.cyan('          | |   | | |_| | | (_| |'));
			console.log(Flujd.colors.cyan('          \\_|   |_|\\__,_| |\\__,_|'));
			console.log(Flujd.colors.cyan('                       _/ |      '));
			console.log(Flujd.colors.cyan('                      |__/       '));
			
			console.log(Flujd.colors.cyan('\n    Started and istening on port: ' + Flujd.port + '\n'));
		},

		openBrowser: function () {
			Flujd.open("http://localhost:"+Flujd.port+"/"+Flujd.source);	//Launches the browser
		},

		colorText: function (text,color) {
			switch(color){
				case 'red':
					return Flujd.colors.red(text);
					break;
				case 'yellow':
					return Flujd.colors.yellow(text);
					break;
				case 'cyan':
					return Flujd.colors.cyan(text);
					break;
				default:
					return text;
			}
		},

		printLog: function (logMessage,logType){
			var utcDate = Flujd.dt.toUTCString();
			var entireMessage = utcDate+": "+logMessage;
			var coloredMessage;
			switch(logType){
				case 'error':
					coloredMessage = Flujd.interface.colorText(entireMessage,'red');
					break;
				case 'warning':
					coloredMessage = Flujd.interface.colorText(entireMessage,'yellow');
					break;
				default:
					coloredMessage = entireMessage;
			}

			console.log(coloredMessage);
		},

		prepareSmartExit: function  () {
			var stdin = Flujd.stdin;
			stdin.setRawMode( true );	// without this, we would only get streams once enter is pressed
			stdin.resume();
			stdin.setEncoding( 'utf8' );	//otherwise it sets on binary
			stdin.on( 'data', function( key ){
			  if ( key === 'q'|| key === 'Q'|| key === '\u0003' ) { //if the user types 'q' or ctrl c it exits the app
			    process.exit();
			  }
			});
		}
	},

	controller:{
		init: function() {
			Flujd.controller.startRouting();
			Flujd.controller.prepareSocket();
			Flujd.controller.startServer();	
		},

		defineRoute: function(path,mode) {
			Flujd.app.get(path, function (req,res) {			
				res.sendFile(__dirname+path);
			});
		},

		startRouting: function () {
			//Defines what to do when the port is pinged
			Flujd.controller.defineRoute('/client.js','sendFile');
			//--end
		},

		prepareSocket: function () {
			Flujd.io.on('connection',function(socket){	//Starts the watcher when the browser is launched. Allows to use the socket object.
				Flujd.model.watch(socket);
				socket.on('wayback', function(data){	//Expects the answer from the client
					Flujd.interface.printLog(data.news);
				});
			});
		},

		startServer: function () {
			Flujd.server.listen(Flujd.port);	//Starts the server on the port specified in port
		}
	},

	model: {
		watch: function (socket) {
			Flujd.fs.watch(Flujd.toWatch, { recursive:true } ,function(){	//Watches over the folder specified in toWatch. When it catches changes...
				setTimeout(function(){	//Waiting for writing event to be completed
			  		socket.emit('wayon', {});	//...sends an empty object to the client
				}, 500);
			});
		}
	}
}

Flujd.run();