//npm modules imported into this server application
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//create an instance of express()
var app = express();

//array of user info
var infoArray = [];
//parse POST requests
app.use(bodyParser.json()); 	//support json bodies
app.use(bodyParser.urlencoded({ extended: true })); //support url-encoded bodies
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//use available port. default to port 3000 unless otherwise specified.
var PORT = process.env.PORT || 3000;

//create a server listener for incoming requests from clients
app.listen(PORT, function(){
	console.log('Listening on port: ' + PORT);
});

//built-in Express middleware to serve static files in specified directory

// app.use('/static', express.static(__dirname + '/app/public'));

//use path module to display images
app.use(express.static(path.join(__dirname, '/app/public')));

//run this function in response to http get request for the root directory
app.get('/', function(req, res){
	res.sendFile(__dirname + '/app/public/index.html');
});

app.get('/survey', function(req, res){
	res.sendFile(__dirname + '/app/public/survey.html');
});


app.get('/api', function(req, res){
	res.json(infoArray);
});

app.post('/api/data', function(req, res){
	var mydata = req.body;
	processData(mydata, infoArray, displayDiffarray, res);
	infoArray.push(mydata);
	res.json(mydata);
});



//use postData() as callback to prevent asynchrony conflicts
function processData(mydata, infoArray, callback, res){
	var numberOfQs = 3;
	//array of sumOfDiff (see below). The user with the lowest sumOfDiff will be the most compatible.
	var diffArray = [];

	for (var i = 0; i < infoArray.length; i++){
		
		let sumOfDiff = 0;
		for (let j = 0; j< numberOfQs; j++){
			//the score of the current user at question [j]
			let currentQ = mydata.userScores[j];
			//the score of the previous user[i] at question [j]
			let arrayQ = infoArray[i].userScores[j];
			//the absolute number of the difference between currentQ and arrayQ
			let differential = Math.abs(currentQ - arrayQ);
			//the running total of the difference in scores in the responses given by the two users
			sumOfDiff += differential;
		}
		diffArray.push(sumOfDiff);		
	}
	callback(diffArray, res);
};


function displayDiffarray(diffArray, res){
	console.log('array of differences: ' + diffArray);
	
	var lowestDiff = diffArray[0];

	for (var i = 0; i < diffArray.length; i++){
		if (diffArray[i] <= lowestDiff){
			lowestDiff = diffArray[i];
		}

		if (i === diffArray.length){
			let compatible = diffArray.indexOf(lowestDiff);
			console.log(sentData);
			sentData = infoArray[compatible];
			// res.json(sentData);
		}
	}

	// callback(diffArray, lowestDiff);

	console.log('lowest diff: ' + lowestDiff);

	console.log('index #: ' + diffArray.indexOf(lowestDiff));

}

// function displayIndex(diffArray, lowestDiff){
// 	// console.log(diffArray.indexOf(lowestDiff));
// 	var compatible = diffArray.indexOf(lowestDiff);
// 	console.log(infoArray[compatible]);
// }

// require('./app/routing/api-routes.js')(app);
// require('./app/routing/html-routes.js')(app);