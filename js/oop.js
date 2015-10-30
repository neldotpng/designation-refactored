/*
** Cohort Constructor
*/

function Cohort(cohort) {
	this.year = cohort.year;
	this.cohort = cohort.cohort;
	this.logo = cohort.logo;
}

Cohort.prototype.constructor = Cohort;

/*
** Student Constructor
*/

function Student(student, cohort) {
	this.id = student.id;
	this.name = student.name;
	this.headshot = student.headshot;
	this.skills = student.skills;
	this.location = student.location;
	this.bio = student.bio;
	this.portfolio = student.portfolio;
	this.twitter = student.twitter;
	this.linkedin = student.linkedin;
	this.cohort = cohort.cohort;
	this.year = cohort.year;
}

Student.prototype.constructor = Student;

/*
** Ajax Call
** Create Student Objects
*/

var cohorts = [],
	students = [];

function parseStudents(data) {
	var all = data.cohorts;
	console.log(all);
	for ( var i = 0; i < all.length; i++ ) {
		var allStudents = all[i].students;
		cohort = new Cohort( all[i] );
		cohorts.push( cohort );

		for ( var j = 0; j < allStudents.length; j++ ) {
			var student = new Student( allStudents[j], cohort );
			students.push( student );
		}
	}
	console.log(students);
}

function ajaxCall(callback) {
	$.ajax({
		url: '../json/main.json',
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

ajaxCall(parseStudents);