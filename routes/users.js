var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
        res.json(users);
    })
     //res.send('respond with a resource');
});

module.exports = router;
