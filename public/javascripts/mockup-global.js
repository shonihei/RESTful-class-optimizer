// FOR DEBUGGING PURPOSES
requestedData = {};
currentlyLoading = {};
let semester = "20174";

$(document).ready(function() {
    console.log("Document ready!")

    // Initialize autotab.js
    $('input').autotab();

    // Add submission event listener
    $('.next').on('click', requestData);
    $('h1').on('click', initializeSchedule);
});

// validate userinput and request appropriate data
function requestData(e) {
    // Stop form from submitting by default
    e.preventDefault();

    // Collect user input
    let input = collectUserInput();

    // Check input is atleast 1
    if (!input || input.length == 0) {
        alert("Please enter at least one class");
        return null;
    }

    // Create wrapper method for AJAX
    let ajax_caller = function(data) {
        return $.ajax({
            url: data.url,
            method: data.method,
        }).done(function(result) {
            if (result.status == "success") {
                // Stop loading sign and display success
                let courseInput = currentlyLoading[result.requestedclass];
                switchLoading(courseInput, false);
                switchSuccess(courseInput, true);
                delete currentlyLoading[result.requestedclass];

                requestedData[result.requestedclass] = result.data;
            }
            else {
                // Stop loading sign and display error
                let courseInput = currentlyLoading[result.requestedclass];
                switchLoading(courseInput, false);
                switchWarning(courseInput, true);
                delete currentlyLoading[result.requestedclass];
            }
        })
    };

    // Create an array of AJAX calls iteratively
    let ajax_calls = [];
    for (var i = 0; i < input.length; i++) {
        // Search if the current input has already been fetched
        if (requestedData[input]) {
            continue;
        }

        //console.log("Adding " + input[i] + " to queue")

        ajax_calls.push(ajax_caller({
            url: '/api/getclass?semester=' + semester + '&classname=' + input[i],
            method: 'GET',
        }));
    }

    // Send requests asynchnously and do something when everything is complete
    $.when.apply(this, ajax_calls).done(function() {
        console.log("AJAX completed...");

    });
}

// Initialize the schedule module
function initializeSchedule() {
    // Clear form data
    $('.form-container').empty();
    $('.form-container').append($("<div id='target'></div>"));

    // create settings object
    let settings = {
        fontColor: "#c7774d",
        hoverColor: "#f9bd84",
        selectionColor: "#f6963b",
        fontSize: "1.5em",
        fontFamily: '"Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif'
    }

    // Initialize with settings
    $('#target').weekly_schedule(settings);

    // Customize styles
    $('.form-container').css({
        paddingTop: "5%",
        paddingLeft: "0"
    });
    $('.schedule').css({
        height: "90%"
    });
    $('.schedule .days-wrapper .hour-header .hour-header-item').css({
        display: "inline-block"
    });
    $('.schedule h5, .schedule h3').css({
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: "200"
    });
}

// Collect user input from input DOMS
function collectUserInput() {
    // Error flag
    let hasError = false;

    // Get each input rows
    let containers = $('.form-container').find('.courseinput');

    // Initialize return array
    let userInput = [];

    // Loop through each row in containers and collect input
    // in jQuery, return non-falsey value from .each acts as "continue"
    $.each(containers, function(index, value) {
        let fields = $(value).find('input');

        // Initialize parsedString
        let parsedString = ""

        // Create a string
        $.each(fields, function(index, value) {
            parsedString += $(value).val();
        });

        // Uppercasify
        parsedString = parsedString.toUpperCase();

        // If the row was left empty, don't validate
        if (parsedString.length === 0) {
            return true;
        }

        // If current input has already been fetched, don't do anything
        if (requestedData[parsedString]) {
            return true;
        }

        // Check whether valid
        let valid = validInput(parsedString, containers[index]);

        if (valid) {
            currentlyLoading[parsedString.toUpperCase()] = containers[index];
            userInput.push(parsedString.toUpperCase());
        }
    });

    return userInput;
}

// Validate the string input by the user
// Valid input : CASCS111
// length == 8
// First 5 must be chars, last 3 must be numbers
function validInput(str, courseInput) {

    // Check that the string is exactly 8 characters long
    if (str.length !== 8) {
        switchLoading(courseInput, false);
        switchWarning(courseInput, true);

        return false;
    }

    // Use regex to do minimal validation
    let isLetters = (/^[A-Za-z]+$/.test(str.slice(0, 5)))
    let isNumbers = (/^[0-9]+$/.test(str.slice(5)))

    // if first 5 characters are not letters
    if (!isLetters) {
        switchLoading(courseInput, false);
        switchWarning(courseInput, true);

        return false;
    }

    // if last 3 characters are not numbers
    if (!isNumbers) {
        switchLoading(courseInput, false);
        switchWarning(courseInput, true);

        return false;
    }

    // Passed validation!
    switchLoading(courseInput, true);
    switchWarning(courseInput, false);
    return true;
}

function switchLoading(courseInput, state) {
    // Get feedback container and icon
    let feedbackContainer = $(courseInput).find('.feedback');
    let icon = $(feedbackContainer).find('i');

    // If requested state is false, turn the logos off
    if (state === false) {
        // Remove loading spinner
        $(feedbackContainer).removeClass('showLoad');
        $(icon).removeClass('fa-spinner fa-pulse');
    }

    // else, turn it on
    else {
        $(feedbackContainer).addClass('showLoad');
        $(icon).addClass('fa-spinner fa-pulse');
    }
}

function switchWarning(courseInput, state) {
    // Get feedback container and icon
    let feedbackContainer = $(courseInput).find('.feedback');
    let icon = $(feedbackContainer).find('i');

    // If requested state is false, turn the logos off
    if (state === false) {
        $(feedbackContainer).removeClass('hasError');
        $(icon).removeClass('fa-exclamation-triangle');
    }

    // else, turn it on
    else {
        $(feedbackContainer).addClass('hasError');
        $(icon).addClass('fa-exclamation-triangle');
    }
}

function switchSuccess(courseInput, state) {
    // Get feedback container and icon
    let feedbackContainer = $(courseInput).find('.feedback');
    let icon = $(feedbackContainer).find('i');

    // If requested state is false, turn the logos off
    if (state === false) {
        $(feedbackContainer).removeClass('hasSuccess');
        $(icon).removeClass('fa-check');
    }

    // else, turn it on
    else {
        $(feedbackContainer).addClass('hasSuccess');
        $(icon).addClass('fa-check');
    }
}
