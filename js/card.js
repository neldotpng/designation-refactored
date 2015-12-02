// Card Position
var leftPos;

/*
** Card Click Functionality
** Animation Adjusts with Window Size
*/

function cardClick(e) {
	var cardId = $(e).attr('id'),
		thisCard = $('#' + cardId),

		student = $.grep( students, function( e ) {
			return e.id == cardId;
		}),
		bio = student[0].renderStudentBio();

	var topPos = thisCard.offset().top - $('main section').offset().top,
		popHeight = thisCard.height(),
		margin = parseFloat(thisCard.css('margin-top'));

	// Parent card position
	leftPos = thisCard.position().left;

	// Set Hasher
	var name = replaceSpaces(student[0].name),
		cohort = student[0].cohort;
	hasher.replaceHash(cohort + '/' + name);

	// Image Slide Animation

	if ( $window.width() > 885 ) {
		$('main section').append(bio);

		$('.popup').css('top', topPos).css('height', popHeight);
		$('.img-pop').css('left', leftPos);

		$('.img-pop').animate({
			"left": "0"
		}, 200, "linear");

		$('.popup').addClass('popup-animate');
		$('.img-pop').addClass('img-pop-animate');

		setTimeout(function() {
			$('.bio-container').addClass('bio-container-animate');
			$('.bio-content').addClass('bio-content-animate');
		}, 600);


	// Modal view for popup on lower resolution screens

	} else if ( $window.width() <= 885 ) {
		var popDownPos = margin + margin + popHeight,
			popDownHeight = popDownPos + popHeight,
			popupArrow = leftPos + (thisCard.height()/2.3);

		console.log('early', thisCard.offset().top);

		thisCard.removeClass('nojQuery');
		thisCard.children('.disciplines').css('visibility', 'hidden');
		thisCard.css('height', popDownHeight);

		if ( $window.width() <= 480 ) {
			thisCard.append(bio);
			$('.popup').css('top', popHeight + margin + margin)
				.css('height', popHeight).css('width', '100%').css('left', '0');
		} else {
			$('main section').append(bio);
			$('.popup').css('top', topPos + popDownPos)
				.css('height', popHeight);
		}

		// Mobile Popup Height			
        if ( $window.width() <= 550 ) {
			$('.popup').css('height', popDownHeight);
			thisCard.css('height', popDownHeight + popDownPos);
        }

        $('.arrow-up').css('left', popupArrow);

        setTimeout(function() {
			$('.popup').addClass('popup-animate');
            $('.arrow-up').addClass('arrow-up-animate');
            $('.bio-content').addClass('bio-content-animate');
        }, 200);

        var $doc = $('html, body');
        setTimeout(function(){
			console.log('later', thisCard.offset().top);
			$doc.animate({
				scrollTop: thisCard.offset().top - 130
			}, 200);
        }, 300);
	}
}

/*
** Close Biography Popup
*/

function bioClose() {

	// Image Slide Animation

	if ( $window.width() > 885 ) {
		$('.bio-container-animate').removeClass('bio-container-animate');
		$('.bio-content-animate').removeClass('bio-content-animate');

		setTimeout(function() {
			$('.img-pop').animate({
				'left': leftPos
			}, 150, 'linear');
		}, 200);

		setTimeout(function() {
			$('.popup-animate').removeClass('popup-animate');
		}, 550);

		// Reset Popup and Hash
		setTimeout(function() {
			$('.popup').remove();
			popupIsOpen = false;
			hasher.replaceHash(buttonFilter);
		}, 850);
	
	// Collapse in modal animation

	} else if ( $window.width() <= 885 ) {
		var card = $('.popup').data().card;

		$('.popup').removeClass('popup-animate');

		// Reset popup and hash
		setTimeout(function() {
			$('.popup').remove();
			$('#' + card).addClass('nojQuery').css('height', '')
				.children('.disciplines').css('visibility', '');
			hasher.replaceHash(buttonFilter);
			popupIsOpen = false;
		}, 300);
	}
}

/*
** Click Events
** Need to be bound to document for loading reasons
*/

var popupIsOpen = false;

$(document).on('click', '.nojQuery', function(e) {
	e.preventDefault();

	if ( popupIsOpen ) {
		var $card = $('.popup').data().card;
		$('#' + $card).addClass('nojQuery').removeAttr('style');
	}

	$('.popup').remove();
	cardClick(this);

	popupIsOpen = true;
});

$(document).on('touchend click', '.close', function(e) {
	e.preventDefault();
	bioClose();
});
