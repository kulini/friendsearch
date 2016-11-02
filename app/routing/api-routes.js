// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friends = require('../data/friends.js');
var infoArray = friends;


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){
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
			
			var sumOfDiff = 0;
			for (var j = 0; j< numberOfQs; j++){
				//the score of the current user at question [j]
				var currentQ = mydata.userScores[j];
				//the score of the previous user[i] at question [j]
				var arrayQ = infoArray[i].userScores[j];
				//the absolute number of the difference between current user's Q response and that of the user in the DB
				var differential = Math.abs(currentQ - arrayQ);
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
};

