/**
 * Module dependencies.
 */

var express = require('express')
	, stylus = require('stylus')
	, nib = require('nib')
	, sio = require('socket.io')
	, fs = require('fs');

/**
 * App.
 */

var app = express.createServer();

/**
 * App configuration.
 */

app.configure(function () {
	app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname);
	app.set('view engine', 'jade');

	function compile (str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib());
	};
});

/**
 * App routes.
 */

app.get('/', function (req, res) {
	res.render('index', { layout: false });
});

/**
 * App listen.
 */

var port = process.env.PORT || 3000;
app.listen(port, function () {
	var addr = app.address();
	console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

/**
 * Socket.IO server (single process only)
 */

var io = sio.listen(app);

// Set our transports
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 20);
});


var port = 5000;
if (process.env.PORT) {
	port = Number(process.env.PORT);
}

console.log("Using port: " + port);

var millisecondsIn90Minutes = 1000 * 60 * 90;

fs.readFile('words.txt', function(err, data) {
	if(err) throw err;
	words = data.toString().split("\n");
});

function getRandomWords() {
	return {word1: getRandomWord(), word2: getRandomWord()};
}

function getRandomWord() {
	var word = words[Math.floor((Math.random() * words.length))];
	var capitalizedWord = toTitleCase(word);
	return capitalizedWord;
}

function toTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

io.sockets.on('connection', function (socket) {
	socket.on('chat', function (data) {
		sendChatMessages(data)
	});
	socket.on('createLobby', function() {
		var data = createLobby();
		socket.emit("lobbyCreated", data);
	})
	socket.on("loginAdmin", function(data) {
		console.log("Login Admin", data);
		var lobby = lobbies[data.lobbyId];
		if (lobby != null) {
			lobby.connectedSockets.push(socket);
			sendWords(socket,lobby);
		}
	});
	socket.on("loginGuest", function(data) {
		var lobby = lobbies[data.lobbyId];
		if (lobby != null) {
			lobby.connectedSockets.push(socket);
			sendWords(socket,lobby);
		}
	});
	socket.on("drawWords", function(data) {
		console.log("draw", data);
		var randomWords = getRandomWords();
		var timeNow = new Date().getTime();
		var endTime = timeNow + millisecondsIn90Minutes
		if (data) {
			var lobby = lobbies[data.lobbyId];
			if (lobby != null) {
				lobby.word1 = randomWords.word1;
				lobby.word2 = randomWords.word2;
				lobby.endTime = endTime;
				for (var i=0; i < lobby.connectedSockets.length; i++) {
					sendWords(lobby.connectedSockets[i],lobby);
				}
			}
		} else {
			var timeRemaining = endTime - timeNow;
			var returnMessage = randomWords;
			returnMessage["timeRemaining"]=timeRemaining;
			socket.emit("wordsDrawn", returnMessage);
		}
	});
});

function sendWords(socket, lobby) {
	console.log("SEND WORDS", lobby);
	if (lobby.word1 != null) {
		console.log(0);
		socket.emit("wordsDrawn",
			{word1:lobby.word1, word2:lobby.word2, timeRemaining: lobby.endTime - new Date().getTime()});
	}
}

var lobbies = [];

function sendChatMessages(data) {
	console.log(data);
	console.log(data.lobby);
	var lobby = lobbies[data.lobby];
	for (var i=0; i < lobby.connectedSockets.length; i++) {
		lobby.connectedSockets[i].emit("chat", data);
	}
}


function createLobby() {
	var password = Math.random().toString().substring(2);
	lobbies.push({password: password, connectedSockets:[]});
	return {lobbyId: lobbies.length-1, password: password};
}

//Use node rooms