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

    //console.log(io.sockets);

    socket.on('login name', function(name){
        var time = new Date(new Date().getTime()).toLocaleTimeString();
        users[socket.id] = name;
        socket.emit("chat message", time + " | You have connected to the server.");
        io.emit('chat message', time + " | " + name + " just connected");
        console.log(time + " | " +name+ " connected", socket.handshake.address);
        //console.log(users);
        
    });

    socket.on('disconnect', function(){
        var time = new Date(new Date().getTime()).toLocaleTimeString();
        var msg = users[socket.id] + " disconnected";
        console.log(msg);
        io.emit('chat message', time + " | " + msg.toUpperCase());
        delete users[socket.id];
    });
    socket.on('chat message', function(msg){
        var time = new Date(new Date().getTime()).toLocaleTimeString();
        console.log(time + " | " + users[socket.id] + ": " + msg);
        io.emit('chat message', time + " | " + users[socket.id] + ": " + msg);
    });
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
