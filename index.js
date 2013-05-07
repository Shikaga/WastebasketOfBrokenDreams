//Install node-store: https://github.com/alexkwolfe/node-store
//var store = require('store')('data');
var http = require('http');
var url = require('url');
var fs = require('fs');
//var async = require('async');
var words = []

fs.readFile('words.txt', function(err, data) {
	if(err) throw err;
	words = data.toString().split("\n");
});

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	if (request.url != "/favicon.ico") {
		response.writeHead(200,
			{"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"});
		var queryData = url.parse(request.url, true).query;
		if (queryData["getWords"] != null) {
			response.write(getRandomWords());
			response.end("");
		} else {
			response.end();
		}
	}
});

function getRandomWords() {
	return JSON.stringify({word1: getRandomWord(), word2: getRandomWord()});
}

function getRandomWord() {
	var word = words[Math.floor((Math.random() * words.length))];
	var capitalizedWord = toTitleCase(word);
	return capitalizedWord;
}

function toTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");


