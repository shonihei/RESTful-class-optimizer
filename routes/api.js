var express = require('express');
var router = express.Router();
var request = require('request');
var jsdom = require('jsdom');
var buscraper = require('../node_modules/buscraper');

/* GET class info. */
router.get('/getclass', function(req, res) {
    let className = req.query.classname;
    let semester = req.query.semester;
    buscraper.getClass(semester, className, function(err, result) {
        if(err) {
            return res.json({
                status: "error",
                requestedclass: className,
                message: err
            });
        }
        res.json({
            status: "success",
            requestedclass: className,
            data : result
        });
    })
});

module.exports = router;
