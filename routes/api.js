var express = require('express');
var router = express.Router();
var request = require('request');
var jsdom = require('jsdom');
var buscraper = require('../node_modules/buscraper');


/* GET classes info. */
router.get('/getclasses', function(req, res) {
    let classes = req.query.classname;
    let semester = req.query.semester;
    buscraper.getClasses(semester, classes, function(err, result) {
        if(err) {
            res.send(err);
        }
        res.json(result);
    })
});

/* GET class info. */
router.get('/getclass', function(req, res) {
    let className = req.query.classname;
    let semester = req.query.semester;
    buscraper.getClass(semester, className, function(err, result) {
        if(err) {
            res.status(400).send(err);
        }
        res.json(result);
    })
});

module.exports = router;
