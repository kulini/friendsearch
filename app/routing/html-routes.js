var path = require('path');

module.exports = function(app){
	app.get('/survey', function(req, res) {
		res.sendFile(path.join(__dirname + '/../public/survey.html'));
	});

	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});	

	app.get('/api', function(req, res){
		res.json(infoArray);
	});

	// app.use(express.static(__dirname + '/../public'));


	app.use(function(req, res){
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});
}