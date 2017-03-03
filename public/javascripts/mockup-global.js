$(document).ready(function() {
    $('.next').on('click', requestData);
});

function requestData() {
    var input = collectUserInput();

    return null;
}

function collectUserInput() {
    var containers = $('.form-container').find('.courseinput');
    console.log(containers)
}
