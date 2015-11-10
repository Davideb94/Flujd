#! /usr/bin/env node

var source,
	port,
	toWatch,
	fs,
	express,
	app,
	server,
	io,
	open,
	dt,
	stdin;

init();
routing();
prepareSocket();
startServer();
showWelcome();
openBrowser();
prepareSmartExit();

function init () {
	source = ( process.argv[2] != undefined ) ? process.argv[2] : 'index.html';	//Defines which page to read. Default: index.html
	port = (process.argv[3] != undefined) ? process.argv[3] : 8888;	//Defines which port to use. Default: 8888
	toWatch = './';	//Defines which folder to watch.
	fs = require('fs');		//Includes File System to use fs.watch
	express = require('express');	//Includes Express to start an express server
	app = express();	//Creates an instance of express
		app.use(express.static('.'));		//Selects the directory where the server has to watch
	server = require('http').Server(app);	//Includes the http module and creates the server
	io = require('socket.io')(server);	//Includes socket.io to communicate between the server and the browser
	open = require('open');		//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window
	dt = new Date();
	stdin = process.stdin;
}

function routing (argument) {
	//Defines what to do when the port is pinged
	app.get('/', function (req, res) {
	  res.redirect(source);
	});
	app.get('/client.js', function (req,res){	//Includes client.js in the files watched by the server 
		res.sendFile(__dirname+'/client.js');
	});
	//--end
}

function prepareSocket () {
	io.on('connection',function(socket){	//Starts the watcher when the browser is launched. Allows to use the socket object.
		fs.watch(toWatch, { recursive:true } ,function(){	//Watches over the folder specified in toWatch. When it catches changes...
			setTimeout(function(){	//Waiting for writing event to be completed
		  		socket.emit('wayon', {});	//...sends an empty object to the client
			}, 500);
		});
		socket.on('wayback', function(data){	//Expects the answer from the client
			printLog(data.news);
		});
	});
}

function startServer () {
	server.listen(port);	//Starts the server on the port specified in port
}

function showWelcome () {
	console.log('\n----FLUJD LAUNCHED----');
	console.log("Listening on port: " + port + "\n");
}

function openBrowser () {
	open("http://localhost:"+port);	//Launches the browser
}

function printLog(logMessage){
	var utcDate = dt.toUTCString();
	console.log(utcDate+": "+logMessage);
}

function prepareSmartExit () {
	stdin.setRawMode( true );	// without this, we would only get streams once enter is pressed
	stdin.resume();
	stdin.setEncoding( 'utf8' );	//otherwise it sets on binary
	stdin.on( 'data', function( key ){
	  if ( key === 'q'||key === '\u0003' ) { //if the user types 'q' or ctrl c it exits the app
	    process.exit();
	  }
	});
}