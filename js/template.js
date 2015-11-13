function getCohortTemplate(target, cohort) {
    var source;
    var template;

    $.ajax({
        url: 'js/templates/cohorts.html', //ex. js/templates/mytemplate.handlebars
        cache: true,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);
            $(target).append(template(cohort));
        }
    });
}

function getFilters(datum) {
    var source;
    var template;

    $.ajax({
        url: 'js/templates/filter-item.html', //ex. js/templates/mytemplate.handlebars
        cache: true,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);
            $('#cohort-list').append(template(datum));
        }
    });
}

function getStudents(path, datum) {
    var source;
    var template;

    $.ajax({
        url: path, //ex. js/templates/mytemplate.handlebars
        cache: true,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);
            $('#target').html(template(datum));
        }
    });
}

Handlebars.registerHelper( 'noCommaSpace', function(value) {
    var output;
    output = value.replace(/,| /g, '');

    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper( 'capitalizeFirstLetter', function(string) {
    return capitalizeFirstLetter(string);
});