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

// A list of currently connected clients.
var clients = [];


function onClientConnect(socket) {
    clients.push({
        conn: socket
    });
    console.log('clients connected: ' + clients.length);
}

function onClientDisconnect(socket) {
    var numClients = clients.length;
    clients = clients.filter(item => item.conn !== socket);
    console.log('client disconnected ' + numClients + ' => ' + clients.length);
}

var currentClientNum = 0;

// This is triggered when a client connects
// and provides a socket for the server to
// send or 'emit' messages to the client.
io.on('connection', (socket) => {
    socket.clientNum = currentClientNum;
    currentClientNum++;
    onClientConnect(socket);
    socket.emit('playerId', socket.clientNum);

    socket.on('message', (msg) => {
        for (var i = 0; i < clients.length; i++){
            clients[i].conn.emit('fwd:msg', msg);
        }
    });

    socket.on('move', (location) => {
        for (var i = 0; i < clients.length; i++){
            clients[i].conn.emit('fwd:move',{
                player: socket.clientNum,
                loc: location
            } );
        }
    });
    
    socket.on('disconnect', () => {
        onClientDisconnect(socket);
        for (var i = 0; i < clients.length; i++){
            clients[i].conn.emit('fwd:disconnect', socket.clientNum);
        }
    });
});

server.listen(8080);