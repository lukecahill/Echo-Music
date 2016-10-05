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
  var items = collection.find();
  items.each(function(err, i) {
    if(i == null) {
      database.close();
      return;
    }
    console.log(i.Author)
  });
  
  database.close();
  res.render('authors');
}); 

router.post('/authors', function(req, res) {
  console.log(req);
  console.log(res);
});

module.exports = router;
