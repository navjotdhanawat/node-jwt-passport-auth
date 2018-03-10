var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var api = require('./routes/api');
var app = express();
var http = require('http');
var port = process.env.PORT || 3000;
var passport = require('passport');
var mongoose = require('mongoose');
var database = require('./config/database');
mongoose.connect(database.url);

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, multipart/form-data");
	next();
});
app.use(passport.initialize());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use('/', api);

// Handle route
app.get('*', function (req, res) {
	res.redirect('/');
});

var server = http.createServer(app);


// require('./routes/mqtt')(server, app);
server.listen(port);
server.on('error', function (error) {
	console.log('Error', error);
});
server.on('listening', function () {
	console.log('Listening to port: ' + port);
});