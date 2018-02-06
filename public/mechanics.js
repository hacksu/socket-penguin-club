window.onload = function() {

    var socket = io('http://localhost:8080');

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('fwd:msg', (msg) => {
        console.log(msg);
    });

    function sendMessage() {
        socket.emit('message', 'test message');
    }

    function penguin(element) {
        var x = 0;
        var y = 0;
        var update = () => {
            element.style.top = x;
            element.style.left = y;
            socket.emit('move', {
                xPos: x,
                yPos: y
            });
        };
        return {
            up: () => {
                x += 10;
                update();
            },
            down: () => {
                x -= 10;
                update();
            },
            left: () => {
                y -= 10;
                update();
            },
            right: () => {
                y += 10;
                update();
            },
        };
    };

    var me = penguin(document.getElementById('me'));

    var penguins = [];

    socket.on('playerId', id => {
        me.id = id;
    });

    socket.on('fwd:disconnect', playerId => {
        console.log(playerId);
        var toRemove = penguins.find(p => p.player === playerId);
        if (toRemove) {
            document.body.removeChild(toRemove.sprite);
        }
        penguins = penguins.filter(p => p.player !== playerId); 
    });
    
    socket.on('fwd:move', move => {
        console.log(move);
        if (me.id === move.player) return; 

        var penguin = penguins.find(item => item.player === move.player);
        if (penguin){
            console.log('update');
            penguin.sprite.style.top =  move.loc.xPos;
            penguin.sprite.style.left = move.loc.yPos;
        } else {
            console.log('create new');
            var img = new Image();
            img.className = 'penguin';
            img.id = 'player' + move.player;
            img.src = '/penguin.gif';
            document.body.appendChild(img);
            img.style.top = move.xPos;
            img.style.left = move.yPos;
            move.sprite = img;
            penguins.push(move)
        }
    });

    document.addEventListener('keydown', event => {
        if (event.keyCode == 87){
            // Up key
            console.log('up');
            me.down();
        } else if (event.keyCode == 83) {
            // Down key
            console.log('down');
            me.up();
        } else if (event.keyCode == 65) {
            // Left key
            console.log('left');
            me.left();
        } else if (event.keyCode == 68) {
            // Right key
            console.log('right');
            me.right();
        } else if (event.keyCode == 84) {
            // Talk key
            var message = prompt('Send a message.');
            console.log(message);
        }
    });
}