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

function setWords() {
	console.log("Winner!");
	setWordsToDivs(document.getElementById("idea1"), document.getElementById("idea2"));
}