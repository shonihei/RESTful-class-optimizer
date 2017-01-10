var express = require('express');
var router = express.Router();
var request = require('request');
var jsdom = require('jsdom');

/* GET class info. */
router.get('/getclasses/:classname', function(req, res) {
    var input = req.params.classname;
    var college = input.slice(0, 3);
    var dept = input.slice(3, 5);
    var coursenumber = input.slice(5);
    var semesterID = "20174";
    var result = new Object();
    result.courseID = input;

    var url = "https://www.bu.edu/link/bin/uiscgi_studentlink.pl/1483972520? \
        ModuleName=univschr.pl&SearchOptionDesc=Class+Number&SearchOptionCd=S&\
        KeySem=" + semesterID + "&ViewSem=Spring+2017&\
        College=" + college + "&\
        Dept=" + dept + "&\
        Course=" + coursenumber + "&\
        Section=";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            jsdom.env({
                html: body,
                scripts: [
                    'http://code.jquery.com/jquery-1.5.min.js'
                ],
                done: function (err, window) {
                    var $ = window.jQuery;
                    // Note: last index of classesInfo contains form input to move to the next page
                    //       which can be used to test if additional page need to be loaded.
                    var mainTableRows = $('table').find('tr[align="center"][valign="top"]');
                    var classesInfo = mainTableRows.slice(0, -1);
                    var nextPageInfo = mainTableRows.slice(-1);
                    console.log(classesInfo.length);
                    //console.log($(classesInfo).text());
                    //console.log(classesInfo[1]);
                    console.log(typeof classesInfo[1]);
                    console.log();
                    $.each(classesInfo, function(i, tr) {
                        $.each($(tr).children(), function(key, value){
                            if($(value).text() != "") {
                                console.log(key + " : " + $(value).text().trim());
                            }
                        });
                        console.log();
                    });
                    res.json({input: result});
                }
            });
        }
    });
});



module.exports = router;
