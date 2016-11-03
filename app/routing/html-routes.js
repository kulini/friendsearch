var path = require('path');
var express = require('express');

module.exports = function(app){
	var publicPath = path.resolve(__dirname, '/../public');

	app.get('/survey', function(req, res) {
		res.sendFile(path.resolve(__dirname + '/../public/survey.html'));
	});

	app.get('/', function(req, res){
		res.sendFile(path.resolve(__dirname + '/../public/index.html'));
	});	

	app.get('/api', function(req, res){
		res.json(infoArray);
	});

	// app.use(express.static(__dirname + '/../public'));

	app.use(express.static(publicPath));

	// app.use(function(req, res){
	// 	res.sendFile(path.join(__dirname + '/../public/index.html'));
	// });
}