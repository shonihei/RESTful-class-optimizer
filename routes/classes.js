var express = require('express');
var router = express.Router();
var request = require('request');
var jsdom = require('jsdom');
var buscraper = require('../node_modules/buscraper');


/* GET class info. */
router.get('/getclasses/:classname', function(req, res) {

    res.json(result);
});



module.exports = router;
