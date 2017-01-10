var nextID = 1;

var collegeList = [
    "CAS", "CFA", "CGS", "COM", "ENG", "GMS", "GRS",
    "LAW", "MED", "MET", "OTP", "PDP", "SAR", "SDM",
    "SED", "SHA", "SPH", "SSW", "STH", "UHC", "UNI",
    "XAS", "XRG", "SMG", "QST"];

// DOM Ready =============================================================
$(document).ready(function() {
    loadOptions();
    $('.combobox').combobox();
    $('div.form-group#1 input.combobox').attr({
        'id': '1',
        'maxlength': '3',
        "data-toggle": 'tooltip',
        "data-placement": "bottom",
        "data-trigger": 'manual',
        "title": "Missing College"
    });
    $('div.form-group#1 input.combobox').focus();
    disable('.form-group#2')

    $('input.combobox[data-toggle="tooltip"]').tooltip();
    $('.courseNum').on('keypress', function(e) {
        return numberOnly(e);
    });
    $('.search').on('click', search);
});

// Functions =============================================================
function addClassInput() {
}

function search(event) {
    event.preventDefault();

    var input = {
        classes: ["Hello", "Goodbye"]
    }

    $.ajax({
        type: 'GET',
        url: '/classes/getclasses/CASCS111',
    }).done(function(data) {
        $.each(data , function(key, val) {
            console.log(key + ": " + val);
        });
    })
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

function loadOptions() {
    $('.combobox').append("<option value=''>Colleges</option>")
    $.each(collegeList, function(index, value) {
        $('.combobox').append("<option value=" + value + ">" + value + "</option>")
    });
}

function numberOnly(event) {
    var key = event.keyCode;
    if (key == 13) {
        return checkInput(event);
    }
    return ((key >= 48 && key <= 57) || key == 8);
};

function alphaOnly(event) {
    var key = event.keyCode;
    if (key == 13) {
        checkInput(event);
    }
    return ((key >= 65 && key <= 90) || key == 8);
};

function addTextBox() {
    $("<input class='form-control course-input' type='text' placeholder='Enter Class Here'>")
    .on('keypress', function (e) {
        checkKey(e);
    })
    .appendTo($(".form-group"))
    .focus();
}

function checkInput(event) {
    var container = $(event.target).closest('div.form-group');
    var id = $(container).attr("id");
    var collegebox = $(container).find("input[type='hidden']");

    var err = false;

    if ($(collegebox).attr('value') == "") {
        $("input.combobox[data-toggle='tooltip'][id='" + id + "']").tooltip("show");
        err = true;
    }
    var college = $(collegebox).attr('value');
    var department = $(container).find("input.department").val();
    if (department == "") {
        $("input.department[data-toggle='tooltip'][id='" + id + "']").tooltip("show");
        err = true;
    }
    var courseNum = $(container).find("input.courseNum").val();
    if (courseNum == "") {
        $("input.courseNum[data-toggle='tooltip'][id='" + id + "']").tooltip("show");
        err = true;
    }
    //var input = college.concat(department, courseNum);
    if(!err) {
        var container = $(event.target).closest('div.form-group');
        var id = $(container).attr("id");
        var next = (parseInt(id) + 1).toString();
        enable('.form-group#' + next);
    }
}

function validateCourseID(str) {
    //CASCS111
    if(str.length == 8) {
        var college = str.slice(0, 3);
        var department = str.slice(3, 5);
        var courseNum = str.slice(5);

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
