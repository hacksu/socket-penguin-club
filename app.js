// Create an express webserver.
var express = require('express');
var app = express();

var path = require('path');

// Using the same http server that express uses,
// initalize socket.io
// This allows both to use the same route.
var server = require('http').Server(app);
var io = require('socket.io')(server);

// This allows anything in the public folder to 
// be automatically served by our webserver.
app.use(express.static('public'));

// This will provide the socket.io client for 
// use on the frontend.
app.get('/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist/socket.io.js'));
});

// This is triggered when a client connects
// and provides a socket for the server to
// send or 'emit' messages to the client.
io.on('connection', (socket) => {
    
    console.log('connected');

});

server.listen(8080);