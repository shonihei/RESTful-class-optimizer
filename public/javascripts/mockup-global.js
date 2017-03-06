// FOR DEBUGGING PURPOSES
let semester = "20174"

// add event listeners
$(document).ready(function() {
    console.log("Document ready!")
    $('.next').on('click', requestData);
});

function requestData(e) {
    // Stop form from submitting by default
    e.preventDefault();

    // Collect user input
    let input = collectUserInput();

    // Check input is atleast 1
    if (input.length == 0) {
        /*
        Visual indication and custom error message goes here
        */
        return null;
    }

    // Initialize result collections
    let resultCollection = [];
    let errorCollection = [];

    // Create wrapper method for AJAX
    let ajax_caller = function(data) {
        return $.ajax({
            url: data.url,
            method: data.method,
        }).done(function(result) {
            if (result.status == "success") {
                resultCollection.push(result.data);
            }
            else {
                errorCollection.push(result.requestedclass);
            }
        })
    };

    // Create an array of AJAX calls iteratively
    let ajax_calls = [];
    for (var i = 0; i < input.length; i++) {
        ajax_calls.push(ajax_caller({
            url: '/api/getclass?semester=' + semester + '&classname=' + input[i],
            method: 'GET',
        }));
    }

    // Send requests asynchnously and do something when everything is complete
    $.when.apply(this, ajax_calls).done(function() {
        // resultCollection = Successful requests
        // errorCollection = Nonexistent classes were requested
        console.log("AJAX completed...")
        console.log(resultCollection);
        console.log(errorCollection);
    });
}

// Collect user input from input DOMS
function collectUserInput() {
    // Get each input rows
    let containers = $('.form-container').find('.courseinput');

    // Initialize return array
    let userInput = [];

    // Loop through each row in containers and collect input
    $.each(containers, function(index, value) {
        let fields = $(value).find('input');
        let parsedString = ""
        $.each(fields, function(index, value) {
            parsedString += $(value).val();
        });

        // If the row was left empty, don't validate
        let leftEmpty = parsedString.length === 0;

        if (!leftEmpty && validInput(parsedString)) {
            userInput.push(parsedString.toUpperCase());
        }
    });

    return userInput;
}

// Validate the string input by the user
// Valid input : CASCS111
// length == 8
// First 5 must be chars, last 3 must be numbers
function validInput(str) {
    // Check that the string is exactly 8 characters long
    if (str.length !== 8) {
        /*
        Visual indication and custom error message goes here
        */
        alert(str + " is not a valid class format")
        return false;
    }

    // Use regex to do minimal validation
    let isLetters = (/^[A-Za-z]+$/.test(str.slice(0, 5)))
    let isNumbers = (/^[0-9]+$/.test(str.slice(5)))

    // if first 5 characters are not letters
    if (!isLetters) {
        /*
        Visual indication and custom error message goes here
        */
        alert(str + " is not a valid class format")
        return false;
    }

    // if last 3 characters are not numbers
    if (!isNumbers) {
        /*
        Visual indication and custom error message goes here

        */
        alert(str + " is not a valid class format")

        return false;
    }

    // Passed validation!
    return true;
}
