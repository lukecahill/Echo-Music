var express = require('express');
var router = express.Router();

var server = require('http').createServer(express);
var io = require('socket.io')(server);
server.listen(8080, '127.0.0.1');

var MongoClient = require('mongodb').MongoClient;
var database;

MongoClient.connect('mongodb://localhost:27017/shop_database', function(err, db) {
    if(!err) {
        console.log('Connected to MongoDb');
        database = db;
    }
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

    socket.on('disconnect', function(socket) {
        console.log('Disconnect!');
    });

    socket.on('chat message', function(msg) {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
        var collection = database.collection('music_chat');
        var message = {
            'Sender' : msg,
            'Message' : msg
        };

        collection.insert(message, function(err, result) {
            if(err) {
                console.log(err);
            }
        });
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

module.exports = router;
