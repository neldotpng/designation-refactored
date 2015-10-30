function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderSkills(student) {
	var skills = '';
	if (student.skills.length > 1) {
		for (var i = 0; i < student.skills.length; i++) {
			if (student.skills[i] === student.skills[0]) {
				skills += student.skills[i].toUpperCase();
			}
			else {
				skills += ' / ' + student.skills[i].toUpperCase();
			}
		}
	} else {
		if (student.skills[0] === 'ux') {
			skills += "User Experience Design";
		}
		else if (student.skills[0] === "ui") {
			skills += "User Interface Design";
		}
		else if (student.skills[0] === "dev") {
			skills += "Front-End Development";
		}
	}

	return skills;
}

function renderLocation(student) {
	var location = '';
	if (student.location.length > 1) {
		for (var i = 0; i < student.location.length; i++) {
			if (student.location[i] === student.location[0]) {
				location += student.location[i];
			}
			else {
				location += ' / ' + student.location[i];
			}
		}
	} else {
		location += student.location[0];
	}

	return location;
}

function renderStudentBio(student) {
	var skills = renderSkills(student),
		location = renderLocation(student);

	return '<div class="popup">' +
			'<div class="arrow-up"></div>' +
			'<img src="'+ student.headshot + '" alt="" class="img-pop">' +
				'<div class="bio-container"><div class="bio-content">' +
					'<h2>' + student.name + '</h2>' +
					'<h3>Graduated ' + student.year + '</h3>' +
					'<h4>' +
						'<span class="student-skills">' + skills + '</span><br>' +
						'<span class="student-location">' + location + '</span><br>' +
							capitalizeFirstLetter(student.cohort) + ' Cohort' +
					'</h4>' +
					'<p class="bio">' +
						student.bio +
					'</p>' +
					'<p>' +
						'<a class="student-portfolio" target="_blank" href="http://www.' + student.portfolio + '">' +
							'<span>Portfolio</span>' +
							'<i class="fa fa-briefcase"></i>' +
						'</a>' +
						'<a class="student-twitter" target="_blank" href="http://www.twitter.com/' + student.twitter + '">' +
							'<span>Twitter</span>' + 
							'<i class="fa fa-twitter"></i>' +
						'</a>' + 
						'<a class="student-linkedin" target="_blank" href="http://www.' + student.linkedin + '">' + 
							'<span>LinkedIn</span>' + 
							'<i class="fa fa-linkedin"></i>' +
						'</a>' + 
					'</p>' +
				'</div>' +
				'<span class="close">&plus;</span>' +
			'</div>' +
		'</div>';
}