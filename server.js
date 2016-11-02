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

//use available port. default to port 8000 unless otherwise specified.
var PORT = process.env.PORT || 8000;

//create a server listener for incoming requests from clients
app.listen(PORT, function(){
	console.log('Listening on port: ' + PORT);
});


require('./app/routing/api-routes.js')(app);
require('./app/routing/html-routes.js')(app);