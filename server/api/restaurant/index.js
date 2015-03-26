'use strict';

var express = require('express');
var controller = require('./restaurant.controller');
var authenticate = require('../../components/utils.js').authenticate;

var router = express.Router();

router.post('/new', authenticate, controller.restaurants.create);
router.post('/rating', authenticate, controller.restaurants.rating);
router.post('/getrating', authenticate, controller.restaurants.getRating);

module.exports = router;