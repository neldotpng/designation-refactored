var $window = $(window);

/*
** Cohort Constructor
*/

function Cohort(cohort) {
	this.year = cohort.year;
	this.cohort = cohort.cohort;
	this.logo = cohort.logo;
	this.students = [];
	this.filtered = [];
}

Cohort.prototype.sortCohort = function(sortFunc) {
	this.students.sort(alphabetize);
};

/*
** Student Constructor
*/

function Student(student, cohort) {
	this.id = student.id;
	this.name = student.name;
	this.headshot = student.headshot;
	this.headshot_funny = student.headshot_funny;
	this.skills = student.skills;
	this.location = student.location;
	this.available = student.available;
	this.bio = student.bio;
	this.portfolio = student.portfolio;
	this.email = student.email;
	this.linkedin = student.linkedin;
	this.cohort = cohort.cohort;
	this.year = cohort.year;
}

Student.prototype.renderSkills = function() {
	var skills = '';
	if (this.skills.length > 1) {
		for (var i = 0; i < this.skills.length; i++) {
			if (this.skills[i] === this.skills[0]) {
				skills += this.skills[i].toUpperCase();
			}
			else {
				skills += ' / ' + this.skills[i].toUpperCase();
			}
		}
	} else {
		if (this.skills[0] === 'ux') {
			skills += 'User Experience Design';
		}
		else if (this.skills[0] === 'ui') {
			skills += 'User Interface Design';
		}
		else if (this.skills[0] === 'dev') {
			skills += 'Front-End Development';
		}
	}

	return skills;
};

Student.prototype.renderLocation = function() {
	var location = '';
	if (this.location.length > 1) {
		for (var i = 0; i < this.location.length; i++) {
			if (this.location[i] === this.location[0]) {
				location += this.location[i];
			}
			else {
				location += ' / ' + this.location[i];
			}
		}
	} else {
		location += this.location[0];
	}

	return location;
};

Student.prototype.renderLinks = function() {
	var portfolio,
		linkedin,
		email;

	if ( this.portfolio === 'N/A' ) {
		portfolio = '';
	} else {
		portfolio =
			'<a class="student-portfolio" target="_blank" href="http://' + this.portfolio + '">' +
				'<span>Portfolio</span>' +
				'<i class="fa fa-briefcase"></i>' +
			'</a>';
	}

	if ( this.linkedin === 'N/A' ) {
		linkedin = '';
	} else {
		linkedin =
			'<a class="student-linkedin" target="_blank" href="' + this.linkedin + '">' +
				'<span>LinkedIn</span>' +
				'<i class="fa fa-linkedin"></i>' +
			'</a>';
	}

	if ( this.email === 'N/A' ) {
		email = '';
	} else {
		email =
			'<a class="student-email" target="_blank" href="mailto:' + this.email + '">' +
				'<span>Email</span>' +
				'<i class="fa fa-envelope"></i>' +
			'</a>';
	}

	var links =	'<p>' + portfolio + linkedin + email + '</p>';

	return links;
};

Student.prototype.renderStudentBio = function() {
	var skills = this.renderSkills(),
		location = this.renderLocation(),
		studentLinks = this.renderLinks();

	return '<div class="popup" data-card="' + this.id + '">' +
			'<div class="arrow-up"></div>' +
			'<img src="'+ this.headshot + '" alt="" class="img-pop">' +
				'<div class="bio-container"><div class="bio-content">' +
					'<h2>' + this.name + '</h2>' +
					'<h3>Graduated ' + this.year + '</h3>' +
					'<h4>' +
						'<span class="student-skills">' + skills + '</span><br>' +
						'<span class="student-location">' + location + '</span><br>' +
							capitalizeFirstLetter(this.cohort) + ' Cohort' +
					'</h4>' +
					'<p class="bio">' +
						this.bio +
					'</p>' +
					studentLinks +
				'</div>' +
				'<span class="close">&plus;</span>' +
			'</div>' +
		'</div>';
};

/*
** String Manipulation Function
*/

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
** Ajax Call
** Create Student Objects
*/

var cohorts = [],
	students = [];

function ajaxCall(callback) {
	$.ajax({
		url: 'json/main.json',
		success: callback,
		done: function() {
			console.log('success');
		},
		fail: function() {
			console.log('failed');
		},
		always: function() {
			console.log('complete');
		}
	});
}

function parseStudents(data) {
	var all = data.cohorts;

	for ( var i = 0; i < all.length; i++ ) {
		var allStudents = all[i].students;
		cohort = new Cohort( all[i] );
		cohorts.push( cohort );

		for ( var j = 0; j < allStudents.length; j++ ) {
			var student = new Student( allStudents[j], cohort );
			cohort.students.push( student );
			students.push( student );
		}
	}

	for ( var k = 0; k < cohorts.length; k++ ) {
		cohorts[k].sortCohort();
	}
}

function myCallback() {
	var shuffledStudents = [];

	var w = window,
		width = w.innerWidth,
		height = w.innerHeight,
		imgCount;

	shuffledStudents = shuffle(students);
	imgCount = calcImg(width, height);

	renderHeader(shuffledStudents, 15);

	getCohortTemplate('#target', cohorts[0]);
	getFilters(cohorts);

	initHasher();

	initialLoad = true;
}

/*
** Sorting and Initialization
*/

function alphabetize(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function init() {
	ajaxCall(parseStudents);
	setTimeout(function(){
		ajaxCall(myCallback);
	}, 500);
}

/*
** Debounce Function
*/

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


var count = 0;

function lazyLoading() {
	if($(window).scrollTop() + $(window).height() == $(document).height()) {
		count++;
		getCohortTemplate('#target', cohorts[count]);
    }
}

var lazyLoader = debounce(lazyLoading, 50);

$window.on('scroll', lazyLoader);

var cachedWidth = $(window).width();

$window.on('resize', debounce(function(){
	if (popupIsOpen) {
		var newWidth = $window.width();

		if (newWidth !== cachedWidth) {
			hasher.replaceHash(hasher.getHashAsArray()[0]);
			bioClose();
			$('.popup').remove();
			popupIsOpen = false;
			cachedWidth = newWidth;
		}
	}
}, 50));

$(document).scroll(function() {
    var scrollTopPos = $('main section').offset().top - 145;
    var scrollCurrPos = $('body').scrollTop();
    var firefoxScroll = $('html').scrollTop();

    if (scrollCurrPos >= scrollTopPos || firefoxScroll >= scrollTopPos) {
        $('nav.sidebar').addClass('fixed');
    } else if (scrollCurrPos < scrollTopPos || firefoxScroll >= scrollTopPos) {
        $('.fixed').removeClass('fixed');
        $('.active-filter').removeClass('active-filter');
        $('.filters').removeClass('filters-animate');
        $('.active').removeClass('active');
    }
});

// Prevent scrolling while loader is present on page
$('.loader').bind('mousewheel DOMMouseScroll', function(e) {
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

$window.on('load', function(){
	setTimeout(function(){
		$('.loader').remove();
	}, 500);
});

init();