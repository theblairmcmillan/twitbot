console.log("bot is working");

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var params = {
	q: 'oprah',
	count: 1
}


// searching for 1 tweet containing twitter //
T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}

setInterval(tweetIt, 1000*60*60*24)


var r = Math. floor(Math.random()*100);
tweetIt();

function tweetIt() {
// creating tweet and posting //
	var tweet = {
		status:  r + '#OprahGiffrey'
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if(err) {
			console.log("something went wring");
		} else {
			console.log("it worked");
		}
	}
};
