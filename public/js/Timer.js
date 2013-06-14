var Timer = function() {
	this.timerId;
	this.timeStarted;
	this.endTime;

	this.hoursDiv = document.getElementById("hours");
	this.minutesDiv = document.getElementById("minutes");
	this.secondsDiv = document.getElementById("seconds");
}

Timer.prototype.startTimer = function(timeRemaining) {
	this.timeStarted = new Date().getTime();
	this.endTime = timeRemaining + this.timeStarted;

}

Timer.prototype.getTimeRemaining = function() {
	var timeRemaining = this.endTime - new Date().getTime();
	if (timeRemaining < 0) {
		this.showPensDown();
	}
	var hours = Math.floor(timeRemaining/1000 / 3600);
	var minutes = Math.floor((timeRemaining/1000- (hours * 3600)) / 60);
	var seconds = Math.floor(timeRemaining/1000 % 60);
	return {hours: hours, minutes: minutes, seconds: seconds};
}

Timer.prototype.showPensDown = function() {
	clearInterval(this.timerId);
	hideTime();
	var pensDownDiv = document.getElementById("pensDown");
	pensDownDiv.style.display = "block";
}

Timer.prototype.readySetArt = function(timeRemaining) {
	this.startTimer(timeRemaining);
	if (this.timerId) {
		clearInterval(this.timerId)
	}
	var self = this;
	this.timerId = setInterval(function() {
		var time = timer.getTimeRemaining();
		self.hoursDiv.innerHTML = time.hours;
		self.minutesDiv.innerHTML = time.minutes;
		self.secondsDiv.innerHTML = time.seconds;
	}, 50);
}
