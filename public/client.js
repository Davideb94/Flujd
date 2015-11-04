var socket = io.connect();
  	socket.on('wayon', function (data) {
    	window.location.reload();
    	socket.emit('wayback', { news: 'Changes has been loaded.' });
  	});