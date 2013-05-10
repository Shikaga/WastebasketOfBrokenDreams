function getWords() {
	console.log("lobbyId", lobbyId);
	if (lobbyId != null ) {
		console.log("Win!")
		socket.emit("drawWords", {lobbyId: lobbyId, password:password});
	} else {
		socket.emit("drawWords");
	}
}

var timerId;

function ReadySetArt() {
	getWords();
	var timer = new Timer();
	timer.startTimer();
	var hoursDiv = document.getElementById("hours");
	var minutesDiv = document.getElementById("minutes");
	var secondsDiv = document.getElementById("seconds");
	if (timerId) {
		clearInterval(timerId)
	}
	timerId = setInterval(function() {
		var time = timer.getTimeRemaining();
		hoursDiv.innerHTML = time.hours;
		minutesDiv.innerHTML = time.minutes;
		secondsDiv.innerHTML = time.seconds;
	}, 50);
}

var Timer = function() {

	this.timeStarted;
	this.millisecondsIn90Minutes = 1000 * 60 * 90;
}

Timer.prototype.startTimer = function() {
		this.timeStarted = new Date().getTime();
	}

Timer.prototype.getTimeRemaining = function() {
	var timeRemaining = this.timeStarted + this.millisecondsIn90Minutes - new Date().getTime();
	var hours = Math.floor(timeRemaining/1000 / 3600);
	var minutes = Math.floor((timeRemaining/1000- (hours * 3600)) / 60);
	var seconds = Math.floor(timeRemaining/1000 % 60);
	return {hours: hours, minutes: minutes, seconds: seconds};
}

var socket = io.connect('http://localhost:8001');
socket.on('chat', function (data) {
	console.log(data);
	lobbyHandler.receiveChatMessage(data);
});

var LobbyHandler = function() {
	this.lobbyId;
	this.password;
}

LobbyHandler.prototype.createLobby = function() {
	var self = this;
	socket.emit("createLobby")
	socket.on("lobbyCreated", function(data) {
		this.lobbyId = data.lobbyId;
		this.password = data.password;
		console.log("Lobby created", data);
		var adminUrl = data.lobbyId + "A" + data.password;
		var guestUrl = data.lobbyId;

		document.getElementById("adminUrl").value = document.location.href + "#" + adminUrl;
		document.getElementById("guestUrl").value = document.location.href + "#" + guestUrl;

		document.location.hash = adminUrl;
		self.loginAdmin(data.lobbyId, data.password);
	});
}

LobbyHandler.prototype.joinLobbyFromUrl = function() {
	var hash = document.location.hash.substring(1);
	if (hash != "") {
		var lobbyIdentifier;
		if (hash.indexOf("A") !== -1) {
			lobbyIdentifier = hash.split("A")[0];
			var password = hash.split("A")[1];
			this.password = password;
		} else {
			lobbyIdentifier = hash;
		}
		if (password) {
			this.loginAdmin(lobbyIdentifier,password);
		} else if (lobbyIdentifier ){
			this.loginGuest(lobbyIdentifier);
		} else {
			console.log("WTF?");
		}
		this.lobbyId = parseInt(lobbyIdentifier);
	} else {
		console.log("Anonymous user")
	}
}

LobbyHandler.prototype.loginAdmin = function(lobbyId, password) {
	console.log("Login Admin", lobbyId, password);
	socket.emit("loginAdmin", {lobbyId:lobbyId, password: password});
}

LobbyHandler.prototype.loginGuest = function(lobbyId) {
	console.log("Login Guest", lobbyId);
	socket.emit("loginGuest", {lobbyId: lobbyId});
}

LobbyHandler.prototype.receiveChatMessage = function(data) {
	console.log(data);
	var messagesDiv = document.getElementById("chatMessages");
	var messageDiv = document.createElement("div");
	messageDiv.innerHTML = data.user + ": " + data.message;
	messagesDiv.appendChild(messageDiv);
}

LobbyHandler.prototype.chatButtonClicked = function() {
	var message = document.getElementById("chatMessage").value;
	var username = document.getElementById("username").value;
	document.getElementById("chatMessage").value = "";
	socket.emit('chat', { lobby: this.lobbyId, user: username, message: message });
}



socket.on("wordsDrawn", function(data) {
	console.log(data);
	var div1 = document.getElementById("idea1");
	var div2 = document.getElementById("idea2");
	div1.innerHTML = data.word1;
	div2.innerHTML = data.word2;
});

var lobbyHandler = new LobbyHandler();
lobbyHandler.joinLobbyFromUrl();

function chatButtonClicked() {
	lobbyHandler.chatButtonClicked();
}

function createLobby() {
	lobbyHandler.createLobby();
}