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

function ReadySetArt() {
	setWordsToDivs(document.getElementById("idea1"), document.getElementById("idea2"));
	var timer = new Timer();
	timer.startTimer();
	var hoursDiv = document.getElementById("hours");
	var minutesDiv = document.getElementById("minutes");
	var secondsDiv = document.getElementById("seconds");
	setInterval(function() {
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