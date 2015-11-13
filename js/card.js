(function(){

	// Card Position
	var leftPos;

	var $window = $(window);

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

		leftPos = thisCard.position().left;

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
				popupArrow = leftPos + (thisCard.height()/2.4);

			thisCard.removeClass('nojQuery');
			thisCard.css('height', popDownHeight);
            thisCard.children('.disciplines').css('visibility', 'hidden');

			$('main section').append(bio);

            $('.popup').css('top', topPos + popDownPos)
				.css('height', popHeight);

			// Mobile Popup Height			
            if ( $window.width() <= 550 ) {
				$('.popup').css('height', popDownHeight / 1.1);
				thisCard.css('height', (popDownHeight / 1.1) + popDownPos);
            }

            $('.arrow-up').css('left', popupArrow);

            setTimeout(function() {
				$('.popup').addClass('popup-animate');
                $('.arrow-up').addClass('arrow-up-animate');
                $('.bio-content').addClass('bio-content-animate');
            }, 200);
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

			setTimeout(function() {
				$('.popup').remove();
				popupIsOpen = false;
			}, 850);
		
		// Collapse in modal animation

		} else if ( $window.width() <= 885 ) {
			var card = $('.popup').data().card;

			$('.popup').removeClass('popup-animate');

			setTimeout(function() {
				$('.popup').remove();
				popupIsOpen = false;
				$('#' + card).addClass('nojQuery').css('height', '')
					.children('.disciplines').css('visibility', '');
			}, 300);
		}
	}

	/*
	** Clear Timeouts Function
	*/

	// function clearTimeouts() {
	// 	var id = window.setTimeout(function() {}, 0);
	// 	while (id--) {
	// 		window.clearTimeout(id); // will do nothing if no timeout with id is present
	// 	}
	// }

	/*
	** Click Events
	** Need to be bound to document for loading reasons
	*/

	var popupIsOpen = false;

	$(document).on('click', '.nojQuery', function(e) {
		if ( popupIsOpen ) {
			var card = $('.popup').data().card;
			$('#' + card).addClass('nojQuery').css('height', '')
				.children('.disciplines').css('visibility', '');
		}

		$('.popup').remove();
		cardClick(this);

		popupIsOpen = true;
	});

	$(document).on('click', '.close', function() {
		bioClose();
	});
})();