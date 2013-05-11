
var express = require("express");
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
	response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});

////Install node-store: https://github.com/alexkwolfe/node-store
////var store = require('store')('data');
//var http = require('http');
//var url = require('url');
//var fs = require('fs');
//var util = require('util');
//var static = require('node-static');
////var async = require('async');
//var words = []
////var io = require('socket.io').listen(8001);
//var millisecondsIn90Minutes = 1000 * 60 * 90;
//
//var webroot = '.';
//fs.readFile('words.txt', function(err, data) {
//	if(err) throw err;
//	words = data.toString().split("\n");
//});
//var file = new(static.Server)(webroot, {
//	cache: 600,
//	headers: { 'X-Powered-By': 'node-static' }
//});
//var server = http.createServer(function (req, res) {
//	req.addListener('end', function() {
//		file.serve(req, res, function(err, result) {
//			if (err) {
//				console.error('Error serving %s - %s', req.url, err.message);
//				if (err.status === 404 || err.status === 500) {
//					file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
//				} else {
//					res.writeHead(err.status, err.headers);
//					res.end();
//				}
//			} else {
//				console.log('%s - %s', req.url, res.message);
//			}
//		});
//	});
//});
//
//function getRandomWords() {
//	return {word1: getRandomWord(), word2: getRandomWord()};
//}
//
//function getRandomWord() {
//	var word = words[Math.floor((Math.random() * words.length))];
//	var capitalizedWord = toTitleCase(word);
//	return capitalizedWord;
//}
//
//function toTitleCase(str)
//{
//	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
//}
//
//var port = process.env.PORT || 8000;
//server.listen(port);
//
//console.log("Server running at http://127.0.0.1:" + port + "/");


//io.sockets.on('connection', function (socket) {
//	socket.on('chat', function (data) {
//		sendChatMessages(data)
//	});
//	socket.on('createLobby', function() {
//		var data = createLobby();
//		socket.emit("lobbyCreated", data);
//	})
//	socket.on("loginAdmin", function(data) {
//		console.log("Login Admin", data);
//		var lobby = lobbies[data.lobbyId];
//		if (lobby != null) {
//			lobby.connectedSockets.push(socket);
//			sendWords(socket,lobby);
//		}
//	});
//	socket.on("loginGuest", function(data) {
//		var lobby = lobbies[data.lobbyId];
//		if (lobby != null) {
//			lobby.connectedSockets.push(socket);
//			sendWords(socket,lobby);
//		}
//	});
//	socket.on("drawWords", function(data) {
//		console.log("draw", data);
//		var randomWords = getRandomWords();
//		var timeNow = new Date().getTime();
//		var endTime = timeNow + millisecondsIn90Minutes
//		if (data) {
//			var lobby = lobbies[data.lobbyId];
//			if (lobby != null) {
//				lobby.word1 = randomWords.word1;
//				lobby.word2 = randomWords.word2;
//				lobby.endTime = endTime;
//				for (var i=0; i < lobby.connectedSockets.length; i++) {
//					sendWords(lobby.connectedSockets[i],lobby);
//				}
//			}
//		} else {
//			var timeRemaining = endTime - timeNow;
//			var returnMessage = randomWords;
//			returnMessage["timeRemaining"]=timeRemaining;
//			socket.emit("wordsDrawn", returnMessage);
//		}
//	});
//});
//
//function sendWords(socket, lobby) {
//	console.log("SEND WORDS", lobby);
//	if (lobby.word1 != null) {
//		console.log(0);
//		socket.emit("wordsDrawn",
//			{word1:lobby.word1, word2:lobby.word2, timeRemaining: lobby.endTime - new Date().getTime()});
//	}
//}
//
//var lobbies = [];
//
//function sendChatMessages(data) {
//	console.log(data);
//	console.log(data.lobby);
//	var lobby = lobbies[data.lobby];
//	for (var i=0; i < lobby.connectedSockets.length; i++) {
//		lobby.connectedSockets[i].emit("chat", data);
//	}
//}
//
//
//function createLobby() {
//	var password = Math.random().toString().substring(2);
//	lobbies.push({password: password, connectedSockets:[]});
//	return {lobbyId: lobbies.length-1, password: password};
//}
//
////Use node rooms