'use strict';

var express = require('express');
var controller = require('./search.controller');
var authenticate = require('../../components/utils.js').authenticate;

var router = express.Router();

router.post('/', authenticate, controller.search.query);

module.exports = router;