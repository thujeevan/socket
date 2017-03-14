var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var sockets = [];
io.on('connection', function (socket) {
    sockets.push(socket);
    socket.on('join', function(name) {
        io.emit('joined', sockets.length);
        socket.name_ = name;
    });

    socket.on('disconnect', function() {
        io.emit('joined', sockets.length);
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('chat message', function(m) {
        var matches = m.match(/(\w*)\s*to\s*(\w+)/);

        if (matches.length < 3) return;

        var message = matches[1];
        var user = matches[2];
        var s = sockets.filter(function(s) {
            return s.name_ == user;
        });
        s.length && s[0].emit('chat message', message + ' received from ' + socket.name_);
    });
    console.log('a user connected');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});