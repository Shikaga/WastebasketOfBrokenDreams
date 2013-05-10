

function ReadySetArt() {
	timer.readySetArt();
}

var timer = new Timer();
//timer.readySetArt();

var socket = io.connect('http://localhost:8001');
socket.on('chat', function (data) {
	console.log(data);
	lobbyHandler.receiveChatMessage(data);
});

function getWords() {
	console.log("lobbyId", lobbyHandler.lobbyId);
	if (lobbyHandler.lobbyId != null ) {
		console.log("Win!")
		socket.emit("drawWords", {lobbyId: lobbyId, password:password});
	} else {
		socket.emit("drawWords");
	}
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