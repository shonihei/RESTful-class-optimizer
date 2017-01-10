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

    var url = "https://www.bu.edu/link/bin/uiscgi_studentlink.pl/1483972520?ModuleName=univschr.pl&SearchOptionDesc=Class+Number&SearchOptionCd=S&KeySem=" + semesterID + "&ViewSem=Spring+2017&College=" + college + "&Dept=" + dept + "&Course=" + coursenumber + "&Section=";

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
                    // var header = $('table tr').find('th');
                    // $.each(header, function(i, item) {
                    //     $.each($(item).children(), function(key, value) {
                    //         if($(value).text() != "") {
                    //             var valuestr = $(value).text().trim();
                    //             hello[valuestr] = null;
                    //             console.log(key + " : " + $(value).text().trim());
                    //         }
                    //     });
                    // });
                    // console.log();
                    // console.log();
                    // console.log();
                    // console.log();
                    // console.log();
                    var classesInfo = mainTableRows.slice(0, -1);
                    var nextPageInfo = mainTableRows.slice(-1);

                    $.each(classesInfo, function(i, tr) {
                        var newClass = new Object();
                        $.each($(tr).children(), function(key, value) {
                            if ($(value).find('br').length) {
                                console.log("found br");
                            }
                            if($(value).text() != "") {
                                console.log(key + " : " + $(value, "font").html().split('br'));
                            }
                        });
                        console.log();
                    });
                    res.json(result);
                }
            });
        }
    });
});



module.exports = router;
