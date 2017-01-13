var express = require('express');
var router = express.Router();
var request = require('request');
var jsdom = require('jsdom');
var buscraper = require('../node_modules/buscraper');


/* GET class info. */
router.get('/getclasses/:semester/:classname', function(req, res) {
    buscraper.getClass(req.params.semester, req.params.classname, function(err, result) {
        if(err) {
            res.send(err);
        }
        res.json(result);
    })
});

module.exports = router;
