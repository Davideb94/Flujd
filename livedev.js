//Defines which page to read. Default: index.html
var source = 'index.html';
if(process.argv[2]!=null)
	source = process.argv[2];
//--end

var toWatch = './';	//Defines which folder to watch.

//Defines which port to use. Default: 8888
var port = 8888;
if(process.argv[3]!=null)
	port = process.argv[3];
//--end

var fs = require('fs');		//Includes File System to use fs.watch
var express = require('express');	//Includes Express to start an express server
var app = express();	//Creates an instance of express
	app.use(express.static(__dirname + '/' + toWatch));		//Selects the directory where the server has to watch
var server = require('http').Server(app);	//Includes the http module and creates the server
var io = require('socket.io')(server);	//Includes socket.io to communicate between the server and the browser
var open = require('open');		//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window

//Defines what to do when the port is pinged
app.get('/', function(req,res){
	res.render('/' + toWatch + source);
});
//--end

io.on('connection',function(socket){	//Starts the watcher when the browser is launched. Allows to use the socket object.
	fs.watch(toWatch, { recursive:true } ,function(){	//Watches over the folder specified in toWatch. When it catches changes...
	 	socket.emit('wayon', {});	//...sends an empty object to the client
	});
	socket.on('wayback', function(data){	//Expects the answer from the client
		console.log(data.news + '    ' + data.date_time);
	});
});

server.listen(port);	//Starts the server on the port specified in port
console.log('\n----LIVE-DEV LAUNCHED----');
console.log("Listening on port: " + port + "\n");

open("http://localhost:"+port);	//Launches the browser