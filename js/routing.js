
var initialLoad = false;

function replaceSpaces(string) {
	return string.replace(/\s+/g, '-');
}

function replaceHyphens(string) {
	return string.replace(/-/g, ' ');
}

function onLoad(loading, loaded) {
    if(document.readyState === 'complete'){
        return loaded();
    }
    loading();
    if (window.addEventListener) {
        window.addEventListener('load', loaded, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onload', loaded);
    }
}

function loadBio(cohort, student) {

	var loadStudent = $.grep( cohort.students, function( e ) {
		return e.name === replaceHyphens(student);
	});

	var theStudent = document.getElementById(loadStudent[0].id),
		card = $('#' + loadStudent[0].id);

	onLoad(
		function(){
			return;
		},
		function(){
			setTimeout(function(){
				$('.loader').remove();
			}, 500);
			setTimeout(function(){
				var $doc = $('html, body');
				$doc.animate({scrollTop: card.offset().top - 135});
				setTimeout(function(){
					cardClick(theStudent);
				}, 200);
			}, 500);
		}
	);

	popupIsOpen = true;
}

function initHasher() {
	// Crossroads Routes

	var route = crossroads.addRoute('/{cohort}/:student:', function(cohort, student) {
		if (!initialLoad) {
			var loadCohort = $.grep( cohorts, function( e ) {
				return e.cohort == cohort;
			});

			if (loadCohort.length === 0) {
				return;
			}

			$(".filters .button-group span").html(loadCohort[0].cohort + "<div class='arrow-down'></div>");

			buttonFilter = loadCohort[0].cohort;
			initStudents(loadCohort, function () {
				if (student) {
					loadBio(loadCohort[0], student);
				}
			});

			$window.off('scroll', lazyLoader);
		}
	});

	// Setup hasher
	function parseHash(newHash, oldHash){
		crossroads.parse(newHash);
	}

	hasher.initialized.add(parseHash); // parse initial hash
	hasher.changed.add(parseHash); //parse hash changes
	hasher.init(); //start listening for history change
}

