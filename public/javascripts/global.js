var nextID = 2;
var extraFields = null;
var collegeList = [
    "CAS", "CFA", "CGS", "COM", "ENG", "GMS", "GRS",
    "LAW", "MED", "MET", "OTP", "PDP", "SAR", "SDM",
    "SED", "SHA", "SPH", "SSW", "STH", "UHC", "UNI",
    "XAS", "XRG", "SMG", "QST"];

// DOM Ready =============================================================
$(document).ready(function() {
    extraFields = $('.courseinput').clone();
    disable('.form-group#2')
    $('.form-group#1 .college').focus();
    $('.college, .department, .courseNum').on('keypress', function(e) {
        if (e.keyCode == 13) {
            checkInput(e);
        }
    });
    $('.search').on('click', search);
});

// Functions =============================================================
function addExtraFields() {
    var toBeAdded = $(extraFields).clone();
    $(toBeAdded).attr('id', nextID);
    $(toBeAdded).find('label').text(nextID + ": ");
    nextID++;
    $('#Inputs').append(toBeAdded);
}

function search(event) {
    event.preventDefault();

    var input = {
        classes: ["Hello", "Goodbye"]
    }

    $.ajax({
        type: 'GET',
        url: '/api/getclasses/20174/CASCS111',
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

function checkInput(event) {
    var container = $(event.target).closest('.courseinput');
    var id = $(container).attr("id");
    var colInput = $(container).find(".college");
    var deptInput = $(container).find(".department");
    var coursInput = $(container).find(".courseNum");
    var err = false;

    if ($(colInput).val().length == 3) {
        var index = collegeList.indexOf($(colInput).val().toUpperCase());
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

    var department = $(deptInput).val().toUpperCase();
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

    var courseNum = $(coursInput).val();
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
    //var input = college.concat(department, courseNum);
    if(!err) {
        addExtraFields();
        $('.form-group#' + (nextID-1) + ' .college').focus();
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
