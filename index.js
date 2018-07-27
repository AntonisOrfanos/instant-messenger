var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

let users = {};


io.on('connection', function(socket){

    console.log(io.sockets);

    socket.on('login name', function(name){
        users[socket.id] = name;
        socket.emit("chat message", "You have connected to the server.");
        io.emit('chat message', name + " just connected");
        console.log(name+ " user connected", socket.handshake.address);
        console.log(users);
        
    });

    socket.on('disconnect', function(){
        var msg = users[socket.id] + " disconnected";
        console.log(msg);
        io.emit('chat message', msg.toUpperCase());
        delete users[socket.id];
    });
    socket.on('chat message', function(msg){
        console.log(socket.id);
        io.emit('chat message', users[socket.id] + ": " + msg);
    });
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
