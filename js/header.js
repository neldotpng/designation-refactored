/*
** Header Button
*/

$(".header-button").on("click", function() {
	var $doc = $("html,body");
	var $scrollTo = $('.sidebar');

	$doc.animate({scrollTop: $scrollTo.offset().top - $doc.offset().top - 60}, 400);
});

/*
** Dynamic Header
** Shuffle, Calc, Header functions
*/

function shuffle(array) {
	var arrLength = array.length,
		index,
		item;

	while ( arrLength ) {
		index = Math.floor( Math.random() * arrLength-- );

		item = array[arrLength];
		array[arrLength] = array[index];
		array[index] = item;
	}

	return array;
}

function calcImg(width, height) {
	var imgWidth = width / 5,
		numImages;

	numImages = Math.ceil( height / imgWidth ) * 5;

	return numImages;
}

function renderHeader(array, imgCount) {
	var header = document.getElementById('imgWrapper'),
		pic;

	while( imgCount ) {
		imgCount--;
		pic = array[imgCount].headshot;

		header.innerHTML = header.innerHTML + '<img src="' + pic + '" alt="prof pic">';
	}
}