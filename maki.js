var seg = require('segment').Segment,
	fs = require('fs'),
	config = require('./config.js'),
	weibo = require('weibo');

// Read in stopwords list
var stopwords = [];
fs.readFile(config.stopWordList, function (err, data) {
	if (err) {
		console.log(err);
	}
	stopwords = data.toString("utf8").split("\n");
	console.log("[Log] Loaded Stopwords (" + stopwords.length + ").");
});

var segmenter = new seg();
segmenter.useDefault();

var MongoClient = require('mongodb').MongoClient;

weibo.init('weibo', config.sina.appKey, config.sina.appSecret, config.sina.callbackUrl);
console.log("[Log] Maki Has Started");

var connectionMongoDB = null;

MongoClient.connect(config.db.url, function(err, db) {
	if(!err) {
		connectionMongoDB  = db;
		console.log("[Log] Connected to MongoDB");
		db.createCollection('weibo-learn', function(err, collection) {
			
		});
	}else{
		console.log("[Err] MongoDB Connect Failed");
		process.exit();
	}
});

// Read the public timeline and learn every 30 seconds rate
var timer = setInterval(function(){
	weibo.public_timeline({"blogtype": 'weibo', "access_token":"2.00IMFiWCZqTuZEd929cccff2Ljy4hD"}, {
		"count": 100, 
		"source": config.sina.appKey
	}, function (err, statuses) {
		console.log("[Log] Learning...");
		if (err) {
			console.log(err);
		} else {
			var collection = connectionMongoDB.collection('weibo-learn');
			
			var lastword = null;
			for(var i = 0; i < statuses["items"].length; i++){
				var stext = statuses["items"][i].text;
				for(var j = 0; j < stopwords.length; j++){
					stext = stext.replace(new RegExp(stopwords[j]),"");
				}
				var segResults  = segmenter.doSegment(stext);
				for(var j = 0; j < segResults.length; j++){
					if(!lastword){
						lastword = segResults[j].w;
						continue;
					}
					var curword = segResults[j].w;
					var cmd = {$inc:{}}
					cmd["$inc"]["ref." + curword] = 1;
					collection.update({"word":lastword}, cmd, {"upsert": true}, function(err, r){});
					lastword = curword;
				}
			}
		}
	});
}, 10000); // 10s
