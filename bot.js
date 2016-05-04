console.log('The follow bot is starting');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

// Setting up a user stream
var stream = T.stream('user');

// Anytime someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
  console.log("Follow event!");
  var name = eventMsg.source.name;
  var screenName = eventMsg.source.screen_name;
  tweetIt('.@' + screenName + ' I love bread');
}


tweetIt();
setInterval(tweetIt, 1000*60*60*24);
console.log("getting to tweet it repeat");

function tweetIt() {

	var r = Math.floor(Math.random()*100);

	var tweet = {
	  status: "bread bread bread" + r
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
	  if (err) {
	  	console.log("Something went wrong!");
	  } else {
	    console.log("It worked!");
	  }
	}
}
