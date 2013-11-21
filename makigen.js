// Generates the sentences
var config = require('./config.js');
var connectionMongoDB = null;
var MongoClient = require('mongodb').MongoClient;

function findWord(word, callback, depth){
	var collection = connectionMongoDB.collection('weibo-learn');
	collection.findOne({"word": word}, function(err, results){
		if(!err){
			callback(results, depth);
		}
	});
}

function getRandomNext(wordData){
	if(!wordData){
		return null;
	}
	var total = 0, totalFreq = 0;
	var rnd = Math.random();
	for(var ref in wordData.ref){
		total += wordData.ref[ref];
	}
	for(var ref in wordData.ref){
		totalFreq += wordData.ref[ref] / total;
		if(totalFreq > rnd){
			return ref;
		}
	}
	return null;
}

var totalize = ["人生"];
MongoClient.connect(config.db.url, function(err, db) {
	if(!err) {
		var fww = function(data, d){
			if(d > 0){
				var next = getRandomNext(data);
				if(next){
					findWord(next, fww, d - 1 );
					totalize.push(next);
				}else{
					console.log(totalize.join(""));
					process.exit();
				}
			}else{
				console.log(totalize.join(""));
				process.exit();
			}
		};
		connectionMongoDB  = db;
		findWord("人生", fww , 30);
	}else{
		console.log("[Err] MongoDB Connect Failed");
		process.exit();
	}
});

