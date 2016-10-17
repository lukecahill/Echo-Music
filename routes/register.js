var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var User = require('../models/user.js');

router.get('/', function(req, res) {
    res.render('login');
});

router.post('/newRegistration', function(req, res) {
    User.findOne({
        name: req.body.username
    }, function(err, user) {
        if(err) throw err;

        if(user) {
            res.json({
                success: false, 
                message: 'User already exists.'
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
    });
});

module.exports = router;
