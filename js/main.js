var socket = io.connect('http://localhost:5000');
socket.on('chat', function (data) {
	console.log(data);
	lobbyHandler.receiveChatMessage(data);
});
socket.on("wordsDrawn", function(data) {
	console.log(data);
	var div1 = document.getElementById("idea1");
	var div2 = document.getElementById("idea2");
	div1.innerHTML = data.word1;
	div2.innerHTML = data.word2;
	timer.readySetArt(data.timeRemaining);
	hideDrawButton();
	showWordsButtons();
	showTime();
});

var chatOpen = false;
var timer = new Timer();
var lobbyHandler = new LobbyHandler();

lobbyHandler.joinLobbyFromUrl();

function chatButtonClicked() {
	lobbyHandler.chatButtonClicked();
}

function createLobby() {
	lobbyHandler.createLobby();
}

function getWords() {
	console.log("lobbyId", lobbyHandler.lobbyId);
	if (lobbyHandler.lobbyId != null ) {
		console.log("Win!")
		socket.emit("drawWords", {lobbyId: lobbyHandler.lobbyId, password:lobbyHandler.password});
	} else {
		socket.emit("drawWords");
	}
}

function ReadySetArt() {
	getWords();
}

function showWordsButtons() {
	var button = document.getElementById("words");
	button.style["display"] = "block";
}

function showTime() {
	var button = document.getElementById("time");
	button.style["display"] = "block";
}

function showLobby() {
	var button = document.getElementById("lobby");
	button.style["display"] = "block";
}

function showChat() {
	chatOpen = true;
	var button = document.getElementById("chat");
	button.style["display"] = "block";
	setChatSize();

}

function setChatSize() {
	if (chatOpen) {
		var width = document.width - 450;
		var main = document.getElementById("main");
		main.style["width"] = width + "px";
	}
}

function hideCreateLobby() {
	var div = document.getElementById("createLobby");
	div.style["display"] = "none";
	var orDiv = document.getElementById("OrDiv");
	orDiv.style["display"] = "none";
}

function hideDrawButton() {
	var div = document.getElementById("drawIdeasButton");
	div.style["display"] = "none";
}

$("#chatMessage").keyup(function (e) {
	if (e.keyCode == 13) {
		lobbyHandler.chatButtonClicked();
	}
});

window.onresize = function(e) {
	setChatSize();
}