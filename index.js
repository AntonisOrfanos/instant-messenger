var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    console.log('a user connected', socket.handshake.address);

    //index2.html logic
    socket.on('enter press', ()=>{
        io.emit('enter press', RandomMultiple(30));
    });

    
    //index.html logic
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
    // socket.on('chat message', function(msg){
    //     io.emit('chat message', msg);
    // });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});

let RandomMultiple = (mult)=>{
    let r = Math.round(Math.random()*10);
    // console.log(r);
    let pos = {
        top: mult * r,
        left: mult * r
    }
    return pos;
};