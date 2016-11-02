var express = require('express');
var router = express.Router();
var app = express();

var server = require('http').createServer(express);
var io = require('socket.io')(server);
server.listen(8080, '127.0.0.1');

var MongoClient = require('mongodb').MongoClient;
var database;

var jwt = require('jsonwebtoken');
var config = require('../config.js');
var User = require('../models/user.js');

router.get('/chat', function(req, res) {
    res.render('chat');
});

io.on('connection', function(socket) {
    console.log('A user connected!');

    var collection = database.collection('music_chat');
    var messages;
    var items = collection.find().toArray(function(err, result) {
        if(err) {
            console.log(err);
        } else if(result.length) {
            messages = result;
        }
    });

    socket.on('join', function(data) {
        socket.emit('messages', messages)
    });

    socket.on('disconnect', function(socket) {
        console.log('Disconnect!');
    });

    socket.on('chat message', function(msg) {
        var message = {
            'Sender' : msg.Sender,
            'Message' : msg.Message
        };

        collection.insert(message, function(err, result) {
            if(err) {
                console.log(err);
            }
        });
        
        io.emit('chat message', msg);
    });

    socket.on('typing', function(data) {
        if(data.Typing) {
            io.emit('userTyping', data.Name);
        } else {
            io.emit('noLongerTyping');
        }
    });
});

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, 'supersecret', function(err, decoded) {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
});

module.exports = router;