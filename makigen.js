// Generates the sentences
var http = require("http");
var config = require('./config.js');
var connectionMongoDB = null;
var MongoClient = require('mongodb').MongoClient;

function genEnd(text){
	text = "<html><head><meta charset=\"utf-8\" /><title>Weibo Life Generator</title></head><body style='text-align:center; padding-top:50px;'><h2>" + text + "</h2>";
	text += '-- <a href="https://github.com/NunotabaS/maki" style="color:#555;">Maki</a> | <a href="javascript:window.location.reload()" style="color:#555;">刷新</a> ';
	text += "</body></html>"; 
	return text;
}

function findWord(word, callback, depth){
	var collection = connectionMongoDB.collection('weibo-learn');
	collection.findOne({"word": word}, function(err, results){
		if(!err){
			callback(results, depth);
		}
	});
}

function findRandom(callback){
	var collection = connectionMongoDB.collection('weibo-learn');
	collection.findOne({}, {skip: Math.round(Math.random() * 1000)} ,function(err, results){
		if(!err){
			callback(results);
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

function notEnd(f){
	var x = ["。","！" ,"？","》","：","_"];
	return x.indexOf(f) < 0;
}

var totalize = [];
MongoClient.connect(config.db.url, function(err, db) {
	if(!err) {
		connectionMongoDB  = db;
	}else{
		console.log("[Err] MongoDB Connect Failed");
		process.exit();
	}
});

var server = http.createServer(function(req, res){
	res.writeHead(200, {"Content-Type":"text/html"});
	var initWord = "人生";
	totalize = [initWord];
	var fww = function(data, d){
		if(d > 0){
			var next = getRandomNext(data);
			if(next && notEnd(next)){
				findWord(next, fww, d );
				totalize.push(next);
			}else{
				res.end(genEnd(totalize.join("")));
				totalize = [initWord];
				return;
			}
		}else{
			res.end(genEnd(totalize.join("")));
			totalize = [initWord];
			return;
		}
	};
	findWord("人生", fww , 30);
});

server.listen(8080);

