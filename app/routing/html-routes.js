//run this function in response to http get request for the root directory
app.get('/', function(req, res){
	res.sendFile(__dirname + '/app/public/index.html');
});

app.get('/survey', function(req, res){
	res.sendFile(__dirname + '/app/public/survey.html');
});

