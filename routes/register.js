var express = require('express');
var router = express.Router();
var app = express();

var mongoose = require('mongoose');
var User = require('../models/user.js');

router.get('/', function(req, res, next) {
    res.render('register');
});

module.exports = router;