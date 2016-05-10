console.log('The bot is starting');

var Twit = require('twit');
var giphy = require('giphy-api')();
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
request = require('request');
// Setting up a user stream
var stream = T.stream('user');

function followed(eventMsg) {
  console.log("Follow event!");
  var name = eventMsg.source.name;
  var screenName = eventMsg.source.screen_name;
  tweetIt('.@' + screenName + ' I love bread');
};

function tweetEvent(eventMsg) {
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
	// giphy // 
	giphy.random('oprah').then(function(res){
		console.log("giphy direct url",res.data.image_original_url);
		var currentGiphy = res.data.image_original_url;

		var download = function(uri, filename, callback){
		  	request.head(uri, function(err, res, body){
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);
		    var r = request(uri).pipe(fs.createWriteStream(filename));
		    r.on('close', callback);
		    });
		};

		download(currentGiphy, 'currentGif', function(){
		    console.log('Done downloading..');
		});

		var b64content = fs.readFileSync('currentGif', { encoding: 'base64' })

		T.post('media/upload', {media_data: b64content }, function (err, data, response) {
			var mediaIdStr = data.media_id_string
			var altText = "This should be a gif of Oprah!"
			var meta_params = {media_id: mediaIdStr, alt_text: { text: altText}}

			T.post('media/metadata/create', meta_params, function (err, data, response) {
	    		if (!err) {
					var params = { status: txt, media_ids: [mediaIdStr] }

	      			T.post('statuses/update', params, function (err, data, response) {
	        			console.log("tweeted a gif of Oprah")
	      			})
	    		}
	  		})
		})

		function tweeted(err, data, response) {
			console.log("got to tweeted function");
			if (err) {
				console.log("Something went wrong!");
			} else {
				console.log("It worked!");
			}
		}
	});
};

// Anytime someone follows me
stream.on('follow', followed);
// handling replies to twitter bot //
stream.on('tweet', tweetEvent);

// calling tweetIt and setting interval to one day// 
dailyTweet();
setInterval(dailyTweet, 1000*60*60*24);
console.log("getting to tweet it set interval function");


















