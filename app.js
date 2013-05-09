var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
	socket.on('chat', function (data) {
		socket.broadcast.emit("chat", data);
		socket.emit("chat", data);
		console.log(data);
	});
});