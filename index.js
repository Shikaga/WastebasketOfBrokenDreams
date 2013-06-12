var port = 5000;
if (process.env.PORT) {
	port = Number(process.env.PORT);
}

console.log("Using port: " + port);


//Install node-store: https://github.com/alexkwolfe/node-store
//var store = require('store')('data');
var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
////var async = require('async');
var words = [];

var app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
	io.set("origins", "*:*");
});
app.configure(function() {
	app.use("/", express.static(__dirname));
})
server.listen(port);

//var millisecondsIn90Minutes = 1000 * 60 * 90;
//
//fs.readFile('words.txt', function(err, data) {
//	if(err) throw err;
//	words = data.toString().split("\n");
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
//Use node rooms