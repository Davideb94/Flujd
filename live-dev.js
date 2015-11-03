var fs = require("fs");		//Includes File System to use the watchFile
var open = require("open");	//Includes node-open (https://github.com/pwnall/node-open) to automatically open a browser's window

//Define which page to read. Default: index.html
var source = "index.html";
if(process.argv[2]!=null)
	source = process.argv[2];
//--end
//Define which page to watch. Default: the same we read
var toWatch = source;
if(process.argv[3]!=null)
	toWatch = process.argv[3];
//--end
//Define which port to use. Default: 8888
var port = "8888";
if(process.argv[4]!=null)
	port = process.argv[4];
//--end

function onRequest(req,res){	//Function called by the server that reads the file specified in source
	fs.readFile(source, function(err,data){
		if(err)
			throw err;
		res.writeHead(200,{"Content-Type": "text/html"});
		res.end(data);
	});
}

var app = require('http').createServer(onRequest);	//Includes the http module and creates the server
var io = require("socket.io")(app);	//Includes socket.io to communicate between the server and the browser
app.listen(port);	//Starts the server on the port specified in port

console.log("\n----LIVE-DEV LAUNCHED----");
console.log("Listening on port: '" + port + "'");
console.log("Watching over: '" + toWatch + "'\n");

io.on('connection',function(socket){	//Starts the watcher when the browser is launched. Allows to use the socket object.
	fs.watchFile(toWatch, function (curr, prev) {		//Watches over the file specified in toWatch. When it catches changes...
		socket.emit('wayon',{});						//...sends an empty object to the client
		socket.on('wayback',function(data){console.log(data.news);});	//...expect the answer from the client
	});
});

open("http://localhost:"+port);	//Launches the browser