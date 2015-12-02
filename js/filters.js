/*
** Filter Click Events
** Layout and Filter functionality change with window resolution
*/

// Cohort Filter
var buttonFilter = 'all';

(function(){

    var isFilterOpen = false;

    // Standard Width
    // Opening Filter Menus Click Events

	$(document).on('click', '.filter span', function(e) {
        e.preventDefault();

		$(this).toggleClass('active-filter');
        $(this).parent().siblings('.filter').children('.filter-items').removeClass('active');
        $(this).parent().siblings('.filter').children('span').removeClass('active-filter').children().removeClass('active-filter');

        $(this).siblings('.filter-items').toggleClass("active");
	});


    // Width < 885px

	$(document).on('click', '.filter-label', function(e) {
        e.preventDefault();

        var scrollTopPos = Math.floor( $('main section').offset().top - 140 );
        var $doc = $('html, body');
        var scrollCurrPos = $(document).scrollTop();

        $('.active-filter').removeClass('active-filter');
        $('.active').removeClass('active');

        if (scrollCurrPos < scrollTopPos) {
            $doc.animate({
                scrollTop: scrollTopPos
            }, 300);
            setTimeout(function() {
                $('.filters').addClass('filters-animate');
            }, 301);
        } else {
            $('.filters').toggleClass('filters-animate');
        }
    });
    

    /*
    ** Prevent Scrolling outside of container
    ** when bottom of scroll bar in filter is reached.
    */

    $('.filter-items').bind('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;

        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        }
        else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }

        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });

    /*
    ** Filtering Functionality
    ** By Cohorts
    */
    var $cohortOption = $('.button-group');

    $cohortOption.on('click', '.filter-item .button', function() {
        // Reset Popup
        $('.popup').remove();
        popupIsOpen = false;

        // Set button filter value
        buttonFilter = $(this).attr('data-filter');

        // Set URL
        hasher.replaceHash(buttonFilter);

        var cohort = $.grep( cohorts, function( e ) {
            return e.cohort == buttonFilter;
        });

        // Uncheck all filters
        $('input:checkbox').removeAttr('checked');

        if (buttonFilter == "all") {
            $(".filters .button-group span").html( buttonFilter + " cohorts <div class='arrow-down'></div>");
            getStudents('js/templates/cohorts.html', cohorts[0]);
            count = 0;
            $(window).on('scroll', lazyLoader);
        } else {
            $(".filters .button-group span").html( buttonFilter + "<div class='arrow-down'></div>");
            getStudents('js/templates/cohorts.html', cohort[0]);
            $(window).off('scroll', lazyLoader);
        }
    });


    /*
    ** Filtering Functionality
    ** Checkboxes
    */
    var $checkboxes = $(".filter-group .filter-item input"),
        skillFilters = [],
        availFilters = [];

    var filteredSkillList = [],
        filteredAvailList = [];

    $checkboxes.on('change', function() {
        // Reset popup
        $('.popup').remove();
        popupIsOpen = false;

        // Reset Hash
        hasher.replaceHash(hasher.getHashAsArray()[0]);

        var newStudentArray = [],
            newCohortArray = [];

        // Set filterable student array equal to cohort filter
        if ( buttonFilter === 'all' ) {
            newCohortArray = cohorts;
            newStudentArray = students.sort(alphabetize);
        }
        // Find and set cohort filter equal to filterable array
        else {
            newCohortArray = $.grep( cohorts, function( e ) {
                return e.cohort == buttonFilter;
            });
            newStudentArray = newCohortArray[0].students;
        }

        // Click event for skills checkboxes
        if ( $(this).closest('.filter-group').hasClass('skill-filters') ) {
            skillFilters = filterArrays(skillFilters, availFilters);
            filteredSkillList = checkFilters(newStudentArray, 'skills', skillFilters);
        }
        // Click event for availability checkboxes
        else if ( $(this).closest('.filter-group').hasClass('availability-filters') ) {
            availFilters = filterArrays(availFilters, skillFilters);
            filteredAvailList = uniq( checkMultiFilters(newStudentArray, 'available', availFilters) );
        }

        newStudentArray = filterClick(newStudentArray);

        // Filter students and appends to filtered students array
        for ( var i = 0; i < newCohortArray.length; i++ ) {
            newCohortArray[i].filtered = findDuplicates( newCohortArray[i].students.concat(newStudentArray) );
        }

        // Append new filtered student data to DOM
        if ( newStudentArray.length > 0 ) {
            getStudents('js/templates/filtered-students.html', newCohortArray);
            $(window).off('scroll', lazyLoader);
        }
        else if ( newStudentArray.length === 0 && $checkboxes.is(':checked') === false ) {
            getStudents('js/templates/cohorts.html', newCohortArray[0]);
            count = 0;
            if ( buttonFilter === 'all' ) {
                $(window).on('scroll', lazyLoader);
            }
        }
        else if ( newStudentArray.length === 0 ) {
            $('#target').html('<p class="no-students">No students available.</p>');
        }
    });

    function filterClick() {
        var arr = [];

        // Joins arrays and finds and pushes duplicates to the arr
        // If both availability filters and skill filters checked
        if ( $('.skill-filters input').is(':checked') === true && $('.availability-filters input').is(':checked') === true ) {
            arr = findDuplicates( filteredSkillList.concat(filteredAvailList) );
        }
        // Else sets the arr equal to the non-empty array
        else if ( $('.skill-filters input').is(':checked') === true ) {
            arr = filteredSkillList;
        }
        else if ( $('.availability-filters input').is(':checked') === true ) {
            arr = filteredAvailList;
        }

        return arr.sort(alphabetize);
    }


    function filterArrays(arr, checker) {
        var newArr = [];
        $checkboxes.each( function() {

            if ( $(this).is(':checked') === true ) {

                // Prevent duplicates and other array elements being pushed
                if ( arr.indexOf( $(this).attr('data-filter') ) === -1 && checker.indexOf( $(this).attr('data-filter') ) === -1 ) {
                    newArr.push( $(this).attr('data-filter') );
                }

            } else {
                arr.remove( $(this).attr('data-filter') );
            }

        });

        return newArr.concat(arr);
    }

    // Checks if arr1 contains key elements in arr2 and if so, pushes object to new array
    function checkFilters(arr1, key, arr2) {
        var newArr = [];

        for ( var i = 0; i < arr1.length; i++ ) {
            if ( containsAll(arr2, arr1[i][key]) ) {
                newArr.push(arr1[i]);
            }
        }

        return newArr;
    }

    function checkMultiFilters(arr1, key, arr2) {
        var newArr = [];

        for ( var i = 0; i < arr1.length; i++ ) {
            for ( var j = 0; j < arr2.length; j++ ) {
                if ( $.inArray( arr2[j], arr1[i][key] ) > -1 ) {
                    newArr.push(arr1[i]);
                }
            }
        }

        return newArr;
    }

    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }

    // http://stackoverflow.com/questions/9204283/how-to-check-whether-multiple-values-exist-within-an-javascript-array
    function containsAll(needles, haystack) {
        for ( var i = 0, len = needles.length; i < len; i++ ) {
            if ( $.inArray(needles[i], haystack) === -1 ) return false;
        }
        return true;
    }

    function findDuplicates(array) {
        var a = array,
            dupeArr = [];

        for( var i = 0; i < a.length; ++i ) {
            for( var j = i+1; j < a.length; ++j ) {
                if( a[i] === a[j] ) {
                    dupeArr.push(a[i]);
                }
            }
        }

        return dupeArr;
    }

    /*
    ** Index Retrieval Function
    ** Finds index of item by matching key value
    ** Used for finding the matching cohort's index value
    ** Needed for resetting infinite scroll
    */

    // function getIndexBy(array, name, value) {
    //     for (var i = 0; i < array.length; i++) {
    //         if (array[i][name] == value) {
    //             return i;
    //         }
    //     }
    // }


    /*
    ** Search Functionality
    */
    $(".search").on("click", function() {
        var newStudentArray = [];
            newCohortArray = cohorts;

        buttonFilter = 'all';

        // use value of search field to filter
        var $quicksearch = $('.search').keyup( debounce( function() {
            hasher.replaceHash(buttonFilter);
            popupIsOpen = false;

            var name = $('.search').val();

            if ( name === '' ) {
                getStudents('js/templates/cohorts.html', cohorts[0]);
                $(window).on('scroll', lazyLoader);
                count = 0;
            }
            else {
                $('.filters .button-group span').html("All cohorts <div class='arrow-down'></div>");
                $checkboxes.removeAttr("checked");

                for ( var i = 0; i < newCohortArray.length; i++ ) {
                    newCohortArray[i].filtered = [];

                    for ( var j = 0; j < newCohortArray[i].students.length; j++ ) {

                        if ( newCohortArray[i].students[j].name.toLowerCase().indexOf(name.toLowerCase()) > -1 ) {
                            newCohortArray[i].filtered.push( newCohortArray[i].students[j] );
                        }
                    }
                }

                getStudents('js/templates/filtered-students.html', newCohortArray);
                $(window).off('scroll', lazyLoader);
            }
        }, 200) );
    });

    // Remove specific items from array
    Array.prototype.remove = function(){
    var what,
        a = arguments,
        L = a.length,
        ax;

        while(L && this.length){
            what = a[--L];
            while((ax = this.indexOf(what)) != -1){
                this.splice(ax, 1);
            }
        }
        return this;
    };
})();