console.log('The bot is starting');

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
// Setting up a user stream
var stream = T.stream('user');

function followed(eventMsg) {
  console.log("Follow event!");
  var name = eventMsg.source.name;
  var screenName = eventMsg.source.screen_name;
  tweetIt('.@' + screenName + ' I love bread');
};

function tweetEvent(eventMsg) {
	var fs = require('fs');
	var json = JSON.stringify(eventMsg,null,2);
	// fs.writeFile("tweet.json", json);
	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	console.log(replyto + ' ' + from);

	if(replyto === "OprahGiffrey") {
		var newtweet = '@' + from + ' send bread!';
		tweetIt(newtweet);
	}
};

function dailyTweet() {
	// generating random number to identify each tweet//
	var r = Math.floor(Math.random()*100);
	var status = "bread bread bread" + r;
	tweetIt(status);
}

function tweetIt(txt) {

	var tweet = {
	  status: txt
	};

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
	  if (err) {
	  	console.log("Something went wrong!");
	  } else {
	    console.log("It worked!");
	  }
	}
};

// Anytime someone follows me
stream.on('follow', followed);
// handling replies to twitter bot //
stream.on('tweet', tweetEvent);

// calling tweetIt and setting interval to one day// 
dailyTweet();
setInterval(dailyTweet, 1000*60*60*24);
console.log("getting to tweet it set interval function");

