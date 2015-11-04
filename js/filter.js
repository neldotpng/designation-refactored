app.filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : JSON.stringify(value).replace(/ |"/g, '');
    };
});

//filter to capitalize first letter of given string

app.filter('capitalizeFirstLetter', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
});

app.filter('nocomma', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/,| /g, '');
    };
});