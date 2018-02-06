window.onload = function() {

    function penguin(element) {
        var x = 0;
        var y = 0;
        var update = () => {
            element.style.top = x;
            element.style.left = y;
            // Notifiy the server when we move
            // Use the event name 'move'
        };
        return {
            down: () => {
                x += 10;
                update();
            },
            up: () => {
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

    function moveOrCreatePenguin(move) {
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
    }

    // TODO: create a penguin from the onscreen image.

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

        moveOrCreatePenguin(move);
    });

    document.addEventListener('keydown', event => {
        if (event.keyCode == 87){
            // Up key
            console.log('up');
            
        } else if (event.keyCode == 83) {
            // Down key
            console.log('down');
            
        } else if (event.keyCode == 65) {
            // Left key
            console.log('left');
            
        } else if (event.keyCode == 68) {
            // Right key
            console.log('right');
            
        } else if (event.keyCode == 84) {
            // Talk key
            var message = prompt('Send a message.');
            console.log(message);
        }
    });
};