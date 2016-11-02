//npm modules imported into this server application
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//import database array stored in an external file
var friends = require('./app/data/friends.js');
//create an instance of express()
var app = express();

//database array of user info, imported from 'friends'
var infoArray = friends;

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

//use path module to use the correct path to display images
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
	//the data posted by the client in the ajax post call
	var mydata = req.body;
	//data sent back to client as best match
	res.json(processData(mydata,infoArray));
	//add client data (mydata) to the db (infoArray)
	infoArray.push(mydata);

});


function processData(mydata, infoArray){
	//the number of questions in the survey
	var numberOfQs = 5;
	//with each loop, bestMatch will be updated if the user in db (infoArray) is more compatible than current bestMatch, 
	//i.e. has smaller sumofDiff than current bestMatch.friendDifference
	var bestMatch = {
		name: "",
		photo: "",
		//start with an arbitrarily large number that is supplanted by any smaller sumOfDiff
		friendDifference: 1000
	};

	//the inner loop calculates the compatibility number (sumOfDiff) between two users, the current client and client in the db at index[i]
	//the outer loop goes through each client in the db (infoArray) to determine which is most compatible with the current client
	for (var i = 0; i < infoArray.length; i++){
		
		let sumOfDiff = 0;
		for (let j = 0; j< numberOfQs; j++){
			//the score of the current user at question [j]
			let currentQ = mydata.userScores[j];
			//the score of the previous user[i] at question [j]
			let arrayQ = infoArray[i].userScores[j];
			//the absolute number of the difference between current user's Q response and that of the user in the DB
			let differential = Math.abs(currentQ - arrayQ);
			//the running total of the difference in scores in the responses given by the two users
			sumOfDiff += differential;
		}
		//if client at infoArray[i] is more compatible with current client than the previous bestMatch, the latter becomes bestMatch
		if (sumOfDiff < bestMatch.friendDifference){
			bestMatch['name'] = infoArray[i].userName;
			bestMatch['photo'] = infoArray[i].userPhoto;
			bestMatch['friendDifference'] = sumOfDiff;

			// console.log(bestMatch.friendDifference);
		}	
	}//END for loop
	return bestMatch;
};

// require('./app/routing/api-routes.js')(app);
// require('./app/routing/html-routes.js')(app);