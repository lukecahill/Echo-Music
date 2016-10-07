var express = require('express');
var router = express.Router();

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
  res.render('index', { title: 'Lukes Node Site' });
});

router.get('/about', function(req, res) {
  res.render('about', {
    title: 'About'
  });
});

router.get('/books', function(req, res) {
  res.render('books', {
    title: 'All books'
  })
}); 

router.get('/authors', function(req, res) {
  var collection = database.collection('books');
  var items = collection.find().toArray(function(err, result) {
    if(err) {
      res.send(err);
    } else if(result.length) {
      console.log(result);
      res.render('authorlist', {
        'authorlist' : result
      });
    } else {
      res.send('No items found!');
    }
  });
});

router.get('/newAuthor', function(req, res) {
  res.render('newAuthor', {
    title: 'New Author'
  });
});

router.post('/addAuthor', function(req, res) {
  console.log(req);
  var collection = database.collection('books');
  var author = {
    'Author' : req.body.author_name,
    'Title' : req.body.book_name
  };
  collection.insert(author, function(err, result) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('authors');
    }
  });
});

module.exports = router;
