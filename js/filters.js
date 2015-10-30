(function(){
	$(document).on('click', '.filter span', function() {
		$(this).toggleClass('active-filter');
        $(this).parent().siblings('.filter').children('.filter-items').hide();
        $(this).parent().siblings('.filter').children('span').removeClass('active-filter').children().removeClass('active-filter');
        $(this).siblings('.filter-items').slideToggle(200);
	});

	$(document).on('click', '.filter-label', function() {
        var scrollTopPos = $('main section').offset().top - 80;
        var scrollCurrPos = $('body').scrollTop();

        $('.active-filter').removeClass('active-filter');
        $('.filter-items').hide();

        if (scrollCurrPos < scrollTopPos) {
            $('body').animate({
                scrollTop: scrollTopPos
            }, 300);
            setTimeout(function() {
                $('.filters').addClass('filters-animate');
            }, 301);
        } else {
            $('.filters').toggleClass('filters-animate');
        }
    });

    $('.filter-items').bind('mousewheel DOMMouseScroll', function(e) {
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
})();