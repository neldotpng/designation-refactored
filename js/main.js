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
	this.twitter = student.twitter;
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
			'<a class="student-portfolio" target="_blank" href="' + this.portfolio + '">' +
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
		url: '/json/main.json',
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

	renderHeader(shuffledStudents, imgCount);

	getCohortTemplate('#target', cohorts[0]);
	getFilters(cohorts);
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
	ajaxCall(myCallback);
	console.log('initialized');
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

    console.log('iran');
}

var lazyLoader = debounce(lazyLoading, 50);

$(window).on('scroll', lazyLoader);

init();