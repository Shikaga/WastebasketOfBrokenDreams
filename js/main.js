function getWords(callback) {
	$.ajax({
		url: "http://localhost:8000/?getWords",
		context: document.body
	}).done(function(data) {
			callback(data.word1, data.word2);
		});
}

function setWordsToDivs(div1, div2) {
	getWords(
		function(word1, word2) {
			div1.innerHTML = word1;
			div2.innerHTML = word2;
		}
	)
}

var timerId;

function ReadySetArt() {
	setWordsToDivs(document.getElementById("idea1"), document.getElementById("idea2"));
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
	receiveChatMessage(data);
});

function sendChatMessage(user,message) {
}

function receiveChatMessage(data) {
	console.log(data);
	var messagesDiv = document.getElementById("chatMessages");
	var messageDiv = document.createElement("div");
	messageDiv.innerHTML = data.user + ": " + data.message;
	messagesDiv.appendChild(messageDiv);
}

function chatButtonClicked() {
	var message = document.getElementById("chatMessage").value;
	var username = document.getElementById("username").value;
	document.getElementById("chatMessage").value = "";
	socket.emit('chat', { lobby: lobbyIdA, user: username, message: message });
}

function createLobby() {
	socket.emit("createLobby")
	socket.on("lobbyCreated", function(data) {
		lobbyIdA = data.lobbyId;
		console.log("Lobby created", data);
		var adminUrl = data.lobbyId + "A" + data.password;
		var guestUrl = data.lobbyId;

		document.getElementById("adminUrl").value = document.location.href + "#" + adminUrl;
		document.getElementById("guestUrl").value = document.location.href + "#" + guestUrl;

		document.location.hash = adminUrl;
		loginAdmin(data.lobbyId, data.password);
	});
}

var lobbyIdA;

function joinLobbyFromUrl() {
	var hash = document.location.hash.substring(1);
	if (hash != "") {
		if (hash.indexOf("A") !== -1) {
			var lobbyId = hash.split("A")[0];
			var password = hash.split("A")[1];
		} else {
			var lobbyId = hash;
		}
		if (password) {
			loginAdmin(lobbyId,password);
		} else if (lobbyId ){
			loginGuest(lobbyId);
		} else {
			console.log("WTF?");
		}
		lobbyIdA = parseInt(lobbyId);
	} else {
		console.log("Anonymous user")
	}
}

function loginAdmin(lobbyId, password) {
	console.log("Login Admin", lobbyId, password);
	socket.emit("loginAdmin", {lobbyId:lobbyId, password: password});
}

function loginGuest(lobbyId) {
	console.log("Login Guest", lobbyId);
	socket.emit("loginGuest", {lobbyId: lobbyId});
}

joinLobbyFromUrl();
