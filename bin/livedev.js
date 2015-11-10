#! /usr/bin/env node

var source = ( process.argv[2] != undefined ) ? process.argv[2] : 'index.html',	//Defines which page to read. Default: index.html
    port = (process.argv[3] != undefined) ? process.argv[3] : 8888;	//Defines which port to use. Default: 8888

var toWatch = './';	//Defines which folder to watch.
var fs = require('fs');		//Includes File System to use fs.watch
var express = require('express');	//Includes Express to start an express server
var app = express();	//Creates an instance of express
	app.use(express.static('.'));		//Selects the directory where the server has to watch
var server = require('http').Server(app);	//Includes the http module and creates the server
var io = require('socket.io')(server);	//Includes socket.io to communicate between the server and the browser
var open = require('open');		//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window
var dt = new Date();
//Defines what to do when the port is pinged
app.get('/', function(req,res){
	res.render('/' + toWatch + source);
});
//TODO: MISSING CODE DOCUMENTATION
app.get('/client.js', function(req,res){
	res.sendFile(__dirname+'/client.js');
});
//--end

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


server.listen(port);	//Starts the server on the port specified in port
console.log('\n----LIVE-DEV LAUNCHED----');
console.log("Listening on port: " + port + "\n");

open("http://localhost:"+port);	//Launches the browser

//TODO: MISSING CODE DOCUMENTATION
function printLog(logMessage){
	var utcDate = dt.toUTCString();
	console.log(utcDate+": "+logMessage);
}

//TODO: MISSING CODE DOCUMENTATION
//TODO: DOCUMENT THE quit FUNCTION IN THE readme.md
process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');//TODO: INCLUDE util AS A DEPENDENCY IN THE package.json

process.stdin.on('data', function (text) {
  console.log('	');
  if (text === 'quit\n') {
    done();
  }
});

//To smartly exit the application
function done() {
  console.log('See you soon:)');
  process.exit();
}
//--end