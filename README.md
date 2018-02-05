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