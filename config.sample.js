// Configuration Sample File

exports.db = {
	"engine": "mongo",
	"url":"mongodb://localhost:27017/maki"
};

exports.sina = {
	appKey : "",
	appSecret : "",
	callbackUrl : "http://maki.railgun.in/",
	rateLimit : 1000
};

exports.stopWordList = "stopwords.txt";
