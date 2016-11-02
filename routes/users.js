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
        return res.render('unauthorised', {
            success: false,
            message: 'No token provided'
        })
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

module.exports = router;
