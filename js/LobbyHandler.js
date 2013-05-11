var LobbyHandler = function() {
	this.lobbyId;
	this.password;
}

LobbyHandler.prototype.createLobby = function() {
	var self = this;
	socket.emit("createLobby")
	socket.on("lobbyCreated", function(data) {
		debugger;
		self.lobbyId = data.lobbyId;
		self.password = data.password;
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