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

MongoClient.connect('mongodb://localhost:27017/shop_database', function(err, db) {
    if(!err) {
        console.log('Connected to MongoDb');
        database = db;
    }
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.username
    }, function(err, user) {
        if(err) throw err;

        if(!user) {
            res.json({
                success: false, 
                message: 'Authentication failed.'
            });
        } else if(user.password != req.body.password) {
            res.json({
                success: false,
                message: 'Authentication failed'
            });
        } else {
            var token = jwt.sign(user, 'supersecret', {
                expiresIn: 9999
            });

            res.json({
                success: true,
                message: 'Token gained',
                token: token
            });
        }
    })
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Echo Music' 
    });
});

router.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
    });
});

router.get('/albums', function(req, res) {
    var collection = database.collection('books');
    var items = collection.find().toArray(function(err, result) {
        if(err) {
            res.send(err);
        } else if(result.length) {
            console.log(result);
            res.render('albums', {
                'albumList' : result,
                title: 'Albums'
            });
        } else {
            res.send('No items found!');
        }
    });
}); 

router.get('/artists', function(req, res) {
    var collection = database.collection('books');
    var items = collection.find().toArray(function(err, result) {
        if(err) {
            res.send(err);
        } else if(result.length) {
            console.log(result);
            res.render('artistList', {
                'artistList' : result
            });
        } else {
            res.send('No items found!');
        }
    });
});

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

router.get('/newAlbum', function(req, res) {
    res.render('newAlbum');
})

router.get('/newArtist', function(req, res) {
    res.render('newArtist', {
        title: 'New Artist'
    });
});

router.post('/addArtist', function(req, res) {
    console.log(req);
    var collection = database.collection('artists');
    var book = {
        'Artist' : req.body.book_name
    };

    collection.insert(book, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('albums');
        }
    });
});

router.post('/addAlbum', function(req, res) {
    console.log(req);
    var collection = database.collection('artists');
    var author = {
        'Artist' : req.body.artist_name,
        'Album' : req.body.book_name
    };
    collection.insert(author, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('artists');
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