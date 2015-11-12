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

	init: function () {
		this.source = ( process.argv[2] != undefined ) ? process.argv[2] : 'index.html';	//Defines which page to read. Default: index.html
		this.port = (process.argv[3] != undefined) ? process.argv[3] : 8888;	//Defines which port to use. Default: 8888
		this.toWatch = './';	//Defines which folder to watch.
		this.fs = require('fs');		//Includes File System to use fs.watch
		this.express = require('express');	//Includes Express to start an express server
		this.app = this.express();	//Creates an instance of express
			this.app.use(this.express.static('.'));		//Selects the directory where the server has to watch
		this.server = require('http').Server(this.app);	//Includes the http module and creates the server
		this.io = require('socket.io')(this.server);	//Includes socket.io to communicate between the server and the browser
		this.open = require('open');		//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window
		this.dt = new Date();
		this.stdin = process.stdin;
		this.colors = require('colors/safe');//To use colors in console.log
	},

	run: function(){
		this.init();
		this.controller.routing();
		this.controller.prepareSocket();
		this.controller.startServer();
		this.interface.showWelcome();
		this.interface.openBrowser();
		this.interface.prepareSmartExit();
	},

	interface:{
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
			Flujd.open("http://localhost:"+Flujd.port);	//Launches the browser
		},

		printLog: function (logMessage){
			var utcDate = Flujd.dt.toUTCString();
			console.log(utcDate+": "+logMessage);
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
		routing: function () {
			//Defines what to do when the port is pinged
			Flujd.app.get('/', function (req, res) {
			  res.redirect(Flujd.source);
			});
			Flujd.app.get('/client.js', function (req,res){	//Includes client.js in the files watched by the server 
				res.sendFile(__dirname+'/client.js');
			});
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