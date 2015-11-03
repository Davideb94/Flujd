var socket = io();
socket.on('wayon',function(data){	//Expects the event 'wayon' to be received from the server
	window.location.reload();	//Refreshes the browser
	socket.emit('wayback',{news: 'Changes has been detected.'});	//Throws back the answer to the server
});