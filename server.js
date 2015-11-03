var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	open = require('open'),
	fs = require('fs'),
	port = 3000,
	defaultPath = "./",
	dt = new Date();
	argv = require('minimist')(process.argv);


var watchFolder = ( argv["folder"] != undefined ) ? argv["folder"] : defaultPath; 
var port = ( argv["port"] != undefined ) ? argv["port"] : port;

printLog("Starting on folder " + watchFolder + " and port "+ port);

server.listen(port); 

app.use(express.static('public'));
startSocketConnection();

function startSocketConnection(){

	printLog("Engaging socket connection...");

	io.on('connection', function(socket){

		printLog("Connection established!");

		fs.watch(watchFolder, { recursive:true } ,function( event, fsOption, filename ){
			printLog("Detected update on filesystem. Reloading...");
	 		socket.emit('updateSignal', { update: true});
		});
		socket.on('ack', function(data){
			printLog("Edits correctly deployed.")
		});

	});	
}

function printLog(logMessage){
	var utcDate = dt.toUTCString();
	console.log(utcDate+": "+logMessage);
}
 
open("http://localhost:"+port);