var $grid = $('.grid');
var filters = [];
var checkboxFilters = [];
var buttonFilter = "";
var windowWidth;
var newWindowWidth = 0;

$(document).ready(function() {
  windowWidth = $(window).width();

  //reset the search items when page loads
  window.scrollTo(0,0);
  $(".search").val('');

  $(window).scroll(function() {
    var $doc = $("html,body");
    var $scrollTo = $('main');
    if ($(window).scrollTop() > 400) {
      $('main section .grid .cohort').addClass("fade-in");
    }
  });
  //append locations to sidebar without duplicate locations
  var duplicates = [];
  var locArray = [];

  $.ajax({
    url: "json/main.json",
    async: false,
    success: function(data){
      for (var cohort in data.cohorts) {
        for (var student in data.cohorts[cohort].students) {

          for (var loc in data.cohorts[cohort].students[student].location) {
            var studentLoc = data.cohorts[cohort].students[student].location[loc];
            if (locArray.indexOf(studentLoc) == -1) {
              locArray.push(studentLoc);
            }
          }
        }
      }

      var locArraySorted = locArray.sort();
      for (var locItem in locArraySorted) {
          var studentLocItem = locArraySorted[locItem];
          var studentLocClass = studentLocItem.replace(/,| /g, '');

          $("#location-list .filter-items").append("<li class='filter-item'><input type='checkbox' id='" + studentLocClass + "' data-filter='." + studentLocClass + "'><label for='" + studentLocClass + "'> " + studentLocItem + "</label></li>");
      }
      $checkboxes = $(".filter-group .filter-item input");
    }
  });
    //call all filter functionality
    attrFilters();
    cohortFilters();
    searchFilter();
});




function initIso() {
    $grid.isotope({
    itemSelector: '.cohort-logo, .popup, .card',
    layoutMode: 'fitRows'
    });
}

function attrFilters() {
  $checkboxes.live("change", function() {
    initIso();


    checkboxFilters = [];
    filters = [];

    $checkboxes.filter(':checked').each(function(){
      checkboxFilters.push( $(this).attr("data-filter") );
    });

    if (checkboxFilters.length === 0) {
      filters.push(buttonFilter);
      $grid.isotope({filter : buttonFilter});
      // IsEmptyAfterFilter();
    }
    else {
      for (var i = 0; i < checkboxFilters.length; i++ ) {

          filters.push(buttonFilter + checkboxFilters[i]);
      }

      var comboFilters = filters.join("");
      $grid.isotope({ filter: comboFilters });
       // IsEmptyAfterFilter();
    }
  });
}


function cohortFilters() {
  var $cohortOption = $(".button-group");

  $cohortOption.on("click", '.filter-item .button', function() {

      initIso();

      buttonFilter = $(this).attr("data-filter");
      //uncheck all filters
      $('input:checkbox').removeAttr('checked');

      $grid.isotope({filter: buttonFilter});

      // isEmptyTimeout();
      // changePos();

      if (buttonFilter == ".all") {
        $(".filters .button-group span").html( buttonFilter.replace(/\./g, "") + " cohorts <div class='arrow-down'></div>");

      } else {
        $(".filters .button-group span").html( buttonFilter.replace(/\./g, "") + "<div class='arrow-down'></div>");

      }

  });
}


  
function searchFilter() {
  $(".search").on("click", function() {
    $('.filters .button-group span').html("All cohorts <div class='arrow-down'></div>");
    $checkboxes.removeAttr("checked");

    $(".search").val('');
    resetFilters();
    // quick search regex
    var qsRegex;
    
    // init Isotope
    var $container = $('.grid').isotope({
      itemSelector: '.cohort-logo, .card',
      layoutMode: 'fitRows',
      filter: function() {
        return qsRegex ? $(this).text().match( qsRegex ) : true;
      }
    });

    $container.isotope('reloadItems');
  
    // use value of search field to filter
    var $quicksearch = $('.search').keyup( debounce( function() {
      qsRegex = new RegExp( $quicksearch.val(), 'gi' );
      $container.isotope();
    }, 500) );
  });
};

  

  // search - debounce so filtering doesn't happen every millisecond
function debounce(func, wait, immediate) {

   var timeout;
   // Calling debounce returns a new anonymous function
   return function() {
       // reference the context and args for the setTimeout function
     var context = this,
         args = arguments;

     var callNow = immediate && !timeout;
     clearTimeout(timeout);

     // Set the new timeout
     timeout = setTimeout(function() {
          timeout = null;

          if (!immediate) {

            func.apply(context, args);
          }
     }, wait);
   };
 }

$(window).resize(function() {
  debounce(initIso(), 1000);
});

$(".header-button").on("click", function() {
  var $doc = $("html,body");
  var $scrollTo = $('nav');

  $doc.animate({scrollTop: $scrollTo.offset().top - $doc.offset().top, scrollLeft: 0},750);
});

function resetFilters() {
  filters = [];
  buttonFilter = "";
}