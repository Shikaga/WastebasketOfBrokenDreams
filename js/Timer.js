var Timer = function() {
	this.timerId;
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

Timer.prototype.readySetArt = function() {
	getWords();
	this.startTimer();
	var hoursDiv = document.getElementById("hours");
	var minutesDiv = document.getElementById("minutes");
	var secondsDiv = document.getElementById("seconds");
	if (this.timerId) {
		clearInterval(this.timerId)
	}
	this.timerId = setInterval(function() {
		var time = timer.getTimeRemaining();
		hoursDiv.innerHTML = time.hours;
		minutesDiv.innerHTML = time.minutes;
		secondsDiv.innerHTML = time.seconds;
	}, 50);
}
