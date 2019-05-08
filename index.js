var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userColors = ["color1", "color2", "color3", "color4", "color5"];

app.use(express.static('public'))
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index2.html');
});

var users = {};

let msgObj = {
    sender: "",
    text: "",
    time: "",
    href: ""
};

const usernamesByIP = {
    "::ffff:10.0.0.47": "aorf",
    "::ffff:10.0.0.63": "itzafas",
    "::ffff:10.0.0.104": "agra",
}

io.on('connection', function (socket) {

    //console.log(io.sockets);

    socket.on('login name', function (name) {

        var time = new Date(new Date().getTime()).toLocaleTimeString();
        var colorIndex = Math.floor(Math.random() * userColors.length);
        users[socket.id] = {
            name: name.toUpperCase(),
            // name: usernamesByIP[socket.handshake.address].toUpperCase(),
            color: userColors[colorIndex],
            ip: socket.handshake.address
        };

        msgObj = {
            sender: "Server",
            text: "You have connected to the server.",
            time: time,
            color: "serverColor",
            href: null
        };

        socket.emit('chat message', msgObj);
        console.log(socket.handshake.address);

    });

    socket.on('disconnect', function () {
        if (!users[socket.id]) return;
        var time = new Date(new Date().getTime()).toLocaleTimeString();
        var msg = users[socket.id].name + " disconnected";

        msgObj = {
            sender: "Server",
            text: msg,
            time: time,
            color: "serverColor",
            href: null
        };

        console.log(msg);
        io.emit('chat message', msgObj);
        delete users[socket.id];
    });
    socket.on('chat message', function (msg) {
        var time = new Date(new Date().getTime()).toLocaleTimeString();
        var href = null;
        if (isLink(msg)) {
            href = createHref(msg);
        }
        msgObj = {
            sender: users[socket.id].name,
            text: capitalizeFirstLetter(msg),
            time: time,
            color: users[socket.id].color,
            href: href
        };

        console.log(msgObj);
        io.emit('chat message', msgObj);
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

isLink = function (txt) {
    var re = /http.*|www[.][a-zA-Z0-9]*[.][a-zA-Z]{2,5}/;
    return re.test(txt);
};

createHref = function (url) {
    if (/http:\/\//.test(url)) {
        return url;
    } else if (/https:\/\//.test(url)) {
        return url;
    } else {
        return "http://" + url;
    }
};

capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}