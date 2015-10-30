/*
** Click Interactions
** Card / Popup
*/

(function(){

	var leftPos;

	function cardClick(e) {
		var cardId = $(e).attr('id'),
			thisCard = $('#' + cardId),
			student = _.findWhere(students, { id: cardId }),
			bio = renderStudentBio(student);

		var topPos = thisCard.offset().top - $('main section').offset().top,
			popHeight = thisCard.height(),
			margin = parseFloat(thisCard.css('margin-top')),
			popDownPos = margin + margin + popHeight,
			popDownHeight = popDownPos + popHeight;

		leftPos = thisCard.position().left;

		$('main section').append(bio);

		$('.popup').css('top', topPos).css('height', popHeight);
		$('.img-pop').css('left', leftPos);

		$('.img-pop').animate({
			"left": "0"
		}, 200, "linear");

		$('.popup').addClass('popup-animate');
		$(".img-pop").addClass("img-pop-animate");

		setTimeout(function() {
			$(".bio-container").addClass("bio-container-animate");
		}, 600);
	}

	function bioClose() {
		$('.bio-container-animate').removeClass('bio-container-animate');

		setTimeout(function() {
			$('.img-pop').animate({
				'left': leftPos
			}, 200, 'linear');
		}, 300);

		setTimeout(function() {
			$('.popup-animate').removeClass('popup-animate');
		}, 500);

		setTimeout(function() {
			$('.popup').remove();
		}, 850);
	}

	$(document).on('click', '.card', function() {
		$('.popup').remove();
		cardClick(this);
	});

	$(document).on('click', '.close', function() {
		bioClose();
	});

})();