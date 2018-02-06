# Socket IO Penguin Club

## What is SocketIO?
SocketIO is a javascript library that allows real-time two way communication between a client and server.

## Setup of a new project
1. Create a new folder
2. Set up npm and install dependencies

```
npm init
npm install express --save
npm install socket.io --save
```

## Follow along
1. Install Git and NodeJS
2. Clone the repo.
```
git clone https://github.com/hacksu/socket-penguin-club.git
```
3. Install dependencies.
```
npm install
```
4. Run the app.
```
node app.js
```

## A bit about SocketIO
SocketIO has two main operations, sending data and recieving data.
To send data, use the `emit()` method passing in the name of the 
of the event and the data object to send.
```javascript
    socket.emit('event', data);
```
To recieve data, create an event handler using the `on()` method.
The first parameter should be the name of the event and the second
parameter is a function to handle the data.
```javascript
    socket.on('event', (data) => {
        // Do operations here.
    });
```

## Rebroadcasting a message to all clients.
1. Save a list of all clients.
```javascript
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

io.on('connection', (socket) => {
    onClientConnect(socket);
    
    socket.on('disconnect', () => {
        onClientDisconnect(socket);
    });
});
```

2. Send a message from the client.
```html
 <input onclick="sendMessage()" 
        value="Send a message" 
        type="button"
        />
    ...
    <script>
        function sendMessage() {
            socket.emit('message', 'A test message');
        }
    </script>        
```
3. Listen for a message on the server.
```javascript
socket.on('message', (msg) => {
    console.log(msg);
});
```

4. Forward message to all connected clients
```javascript
socket.on('message', (msg) => {
    for (var i = 0; i < clients.length; i++){
        clients[i].conn.emit('fwd:msg', msg);
    }
});
```

5. Recieve forwarded messages clientside.
```html
<script>
    ...
    socket.on('fwd:msg', (msg) => {
        console.log(msg);
    });
    ...
</script>
```

## Having some fun

1. Add some resources to the head of our HTML.
```html
<head>
    ...
    <script src="/mechanics.js"></script>
    <link rel="stylesheet" href="/style.css"></link>
</head>
```

2. Render our character on the screen.
```html
<body>
    <img src="/penguin.gif" class="penguin" id="me" />
</body>
```

3. Move our socket code into mechanics.js inside the `window.onload` callback function.
```javascript
window.onload = () => {
    // Put socket code here.
};
```

4. Get a reference to our character and wire it up in the key press handlers so that he moves.
```javascript
    var me = penguin(document.getElementById('me'));
    ...
    document.addEventListener('keydown', event => {
    if (event.keyCode == 87){
        // Up key
        console.log('up');
        me.up();                // <--- This line.
    }
    // Fill out the others too.
    ...
```

5. Send the move data to the server in `update()`.
```javascript
    socket.emit('move', {
        xPos: x,
        yPos: y
    });
```

6. In the server, add a handler for the move event that sends the player number and the move to each of the other clients.
```javascript
    socket.on('move', (location) => {
        for (var i = 0; i < clients.length; i++){
            clients[i].conn.emit('fwd:move',{
                player: socket.clientNum,
                loc: location
            } );
        }
    });
```

7. Listen for fowarded movements clintside and move the sprites accordingly.
```javascript
    socket.on('fwd:move', move => {
        console.log(move);
        if (me.id === move.player) return; 

        moveOrCreatePenguin(move);
    });
```

8. Add some player ids to the server to keep track of clients.
```javascript
var currentClientNum = 0;

io.on('connection', (socket) => {
    socket.clientNum = currentClientNum;
    currentClientNum++;
    onClientConnect(socket);
    socket.emit('playerId', socket.clientNum);
    ...
```

9. Add a short handler to update your player number.
```javascript
    socket.on('playerId', id => {
        me.id = id;
    });
```

10. And finally, remove penguins when someone disconnects.
```javascript
    /// client side
    socket.on('fwd:disconnect', playerId => {
        console.log(playerId);
        var toRemove = penguins.find(p => p.player === playerId);
        if (toRemove) {
            document.body.removeChild(toRemove.sprite);
        }
        penguins = penguins.filter(p => p.player !== playerId); 
    });
```
11. And on the serverside too.
```javascript
    /// server side, update onDisconnect to look like this.
    socket.on('disconnect', () => {
        onClientDisconnect(socket);
        for (var i = 0; i < clients.length; i++){
            clients[i].conn.emit('fwd:disconnect', socket.clientNum);
        }
    });
```

Add that secret sauce of debugging, and voilà! A basic club penguin rip off.

## Completed Code
The complete project can be found on Github at: https://github.com/hacksu/socket-penguin-club/tree/completed

## Challenge
Create a speech bubble and show a message for a penguin. Maybe even with [browser notifications](https://developer.mozilla.org/en-US/docs/Web/API/notification)?
