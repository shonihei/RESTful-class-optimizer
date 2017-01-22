var nextID = 2;
var extraFields = null;
const collegeList = [
    "CAS", "CFA", "CGS", "COM", "ENG", "GMS", "GRS",
    "LAW", "MED", "MET", "OTP", "PDP", "SAR", "SDM",
    "SED", "SHA", "SPH", "SSW", "STH", "UHC", "UNI",
    "XAS", "XRG", "SMG", "QST"];

const semToNumber = {
    "Summer 1" : "1",
    "Summer 2" : "2",
    "Fall" : "3",
    "Spring" : "4"
}

// DOM Ready =============================================================
$(document).ready(function() {
    extraFields = $('.courseinput').clone();
    disable('.form-group#2')
    $('.form-group#1 .college').focus();
    $(document).on('keypress', '.college, .department, .courseNum', function(e) {
        if (e.keyCode == 13) {
            if(checkInput(e)) {
                addExtraFields();
                $('.form-group#' + (nextID-1) + ' .college').focus();
            }
        }
    });
    $('.courseinput#1 .college').autotab({ format: 'alpha', target: '.courseinput#1 .department'});
    $('.courseinput#1 .department').autotab({ format: 'alpha', target: '.courseinput#1 .courseNum', previous: '.courseinput#1 .college'});
    $('.courseinput#1 .courseNum').autotab({ format: 'number', previous: '.courseinput#1 .department'});
    $('#Submit .year').autotab({format: 'number', target: '#Submit .semester'});
    $('.search').on('click', search);
});

// Functions =============================================================
function addExtraFields() {
    let toBeAdded = $(extraFields).clone();
    $(toBeAdded).attr('id', nextID);
    $(toBeAdded).find('label').text(nextID + ": ");
    $('#Inputs').append(toBeAdded);
    $('.courseinput#' + nextID+ ' .college').autotab({ format: 'alpha', target: '.courseinput#' + nextID+ ' .department'});
    $('.courseinput#' + nextID+ ' .department').autotab({ format: 'alpha', target: '.courseinput#' + nextID+ ' .courseNum', previous: '.courseinput#' + nextID+ ' .college'});
    $('.courseinput#' + nextID+ ' .courseNum').autotab({ format: 'number', previous: '.courseinput#' + nextID+ ' .department'});
    nextID++;
}

function search(event) {
    console.log("begin search...");
    event.preventDefault();

    let input = collectInputs();
    // Check the user has put in at least one input
    if (input.length < 1) {
        return false;
    }

    // Check that the user has chosen a valid semester code
    let semester = collectSemester();
    if (semester.length != 5) {
        return false;
    }

    let resultCollection = [];

    let ajax_caller = function(data) {
        return $.ajax({
            url: data.url,
            method: data.method,
        }).done(function(result) {
            if (result.status == "success") {
                resultCollection.push(result.data);
            }
        })
    };

    let ajax_calls = [];
    for (var i = 0; i < input.length; i++) {
        ajax_calls.push(ajax_caller({
            url: '/api/getclass?semester=' + semester + '&classname=' + input[i],
            method: 'GET',
        }));
    }

    $.when.apply(this, ajax_calls).done(function() {
        console.log("finished")
        console.log(resultCollection);
    });
}

function collectSemester() {
    let submitDOMs = $('form#Submit').find('input, select');
    let year = $(submitDOMs[0]).val();
    let sem = semToNumber[$(submitDOMs[1]).find(':selected').text()];
    return year + sem;
}

function collectInputs() {
    let input = [];

    let inputDOMs = $('form#Inputs').children('div.courseinput');
    $.each(inputDOMs, function(index, courseRow) {
        let parsedString = "";
        let inputCollection = $(courseRow).find('input');
        $.each(inputCollection, function(i, v) {
            parsedString = parsedString.concat($(v).val().toUpperCase());
        });
        // Check if input is valid
        if (parsedString.length == 8) {
            input.push(parsedString);
        }
    });
    return input;
}

function disable(element) {
    $(element)
        .addClass('disableddiv')
        .find('input').each(function() {
            $(this).attr('tabindex', '-1');
        });
}

function enable(element) {
    $(element)
        .removeClass('disableddiv')
        .find('input').each(function() {
            $(this).removeAttr('tabindex')
        })
    $(element).find('.college').focus();
}

function checkInput(event) {
    let container = $(event.target).closest('.courseinput');
    let id = $(container).attr("id");
    let colInput = $(container).find(".college");
    let deptInput = $(container).find(".department");
    let coursInput = $(container).find(".courseNum");
    let err = false;

    if ($(colInput).val().length == 3) {
        let index = collegeList.indexOf($(colInput).val().toUpperCase());
        if (index < 0) {
            $(colInput).parent().removeClass('has-success');
            $(colInput).parent().addClass('has-error');
            err = true;
        }
        else {
            $(colInput).parent().removeClass('has-error');
            $(colInput).parent().addClass('has-success');
        }
    }
    else {
        $(colInput).parent().removeClass('has-success');
        $(colInput).parent().addClass('has-error');
        err = true;
    }

    let department = $(deptInput).val().toUpperCase();
    if (department.length == 2) {
        if(/^[A-Z]+$/.test(department)) {
            $(deptInput).parent().removeClass('has-error');
            $(deptInput).parent().addClass('has-success');
        }
        else {
            $(deptInput).parent().removeClass('has-success');
            $(deptInput).parent().addClass('has-error');
            err = true;
        }
    }
    else {
        $(deptInput).parent().removeClass('has-success');
        $(deptInput).parent().addClass('has-error');
        err = true;
    }

    let courseNum = $(coursInput).val();
    if (courseNum.length == 3) {
        if(/^[0-9]+$/.test(courseNum)) {
            $(coursInput).parent().removeClass('has-error');
            $(coursInput).parent().addClass('has-success');
        }
        else {
            $(coursInput).parent().removeClass('has-success');
            $(coursInput).parent().addClass('has-error');
            err = true;
        }
    }
    else {
        $(coursInput).parent().removeClass('has-success');
        $(coursInput).parent().addClass('has-error');
        err = true;
    }

    return !err;
}

function validateCourseID(str) {
    //CASCS111
    if(str.length == 8) {
        let college = str.slice(0, 3);
        let department = str.slice(3, 5);
        let courseNum = str.slice(5);

        if(collegeList.indexOf(college) > -1) {
            if(/^[A-Z]+$/.test(department)) {
                if(/^\d+$/.test(courseNum)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function upperCaseF(a){
    setTimeout(function(){
        a.value = a.value.toUpperCase();
    }, 1);
}
