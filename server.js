/**
 * @author Nils Dehl <mail@nils-dehl.de>
 */
var http = require('http'),
		sys  = require('sys'),
		fs   = require('fs'),
		io   = require('socket.io');
express = require('express');

var app = express.createServer();


app.configure(function () {
  app.use(express.static(__dirname + '/www'));
});


app.listen(4000, function () {
  var addr = app.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

var socket = io.listen(app);

socket.on('connection', function(client) {

	var user;

	client.on('message', function(message) {
		if (!user) {
			user = message;
			client.send({ message: 'Welcome, ' + user.nickname + '!', nickname: 'server', gravatar: '' });
			return;
		}
		var response = {
			'nickname': user.nickname,
			'gravatar': user.gravatar,
			'message': message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
		};
		socket.broadcast(response);
	});

});

