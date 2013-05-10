//Install node-store: https://github.com/alexkwolfe/node-store
//var store = require('store')('data');
var http = require('http');
var url = require('url');
var fs = require('fs');
//var async = require('async');
var words = []
var io = require('socket.io').listen(8001);

fs.readFile('words.txt', function(err, data) {
	if(err) throw err;
	words = data.toString().split("\n");
});

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	if (request.url != "/favicon.ico") {
		response.writeHead(200,
			{"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"});
		var queryData = url.parse(request.url, true).query;
		if (queryData["getWords"] != null) {
			response.write(getRandomWords());
			response.end("");
		} else {
			response.end();
		}
	}
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

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");


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
		}
	});
	socket.on("loginGuest", function(data) {
		var lobby = lobbies[data.lobbyId];
		if (lobby != null) {
			lobby.connectedSockets.push(socket);
		}
	});
	socket.on("drawWords", function(data) {
		console.log(data);
		if (data) {

			var lobby = lobbies[data.lobbyId];
			if (lobby != null) {
				var randomWords = getRandomWords();
				for (var i=0; i < lobby.connectedSockets.length; i++) {
					lobby.connectedSockets[i].emit("wordsDrawn", randomWords)
				}
			}
		} else {
			socket.emit("wordsDrawn", getRandomWords());
		}
	});
});

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