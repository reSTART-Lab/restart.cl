var retina = {
	init: function () {
		if(window.devicePixelRatio >= 1.2){
			$("[data-2x]").each(function(){
				if(this.tagName == "IMG"){
					$(this).attr("src",$(this).attr("data-2x"));
				} else {
					$(this).css({"background-image":"url("+$(this).attr("data-2x")+")"});
				}
			});
		}
	}
};

window.utils = {
	isFirefox: function () {
		return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	},

	isSafari: function () {
		return navigator.userAgent.toLowerCase().indexOf('safari') > -1;
	},

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	debounce: function (func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},

	isMobile: function () {
		if (window.innerWidth <= 1024) {
			return true
		} else {
			return false
		}
	},

	parallax_text: function ($selector, extra_top) {
		extra_top = typeof extra_top !== 'undefined' ? extra_top : 0;
		var lastScrollY = 0;
		var ticking = false;

		window.addEventListener('scroll', onScroll, false);

		function onScroll () {
			lastScrollY = window.scrollY;
			requestTick();
		}

		function requestTick () {
			if(!ticking) {
				requestAnimationFrame(update);
				ticking = true;
			}
		}

		function update () {
			var scroll = lastScrollY, 
				slowScroll = scroll/1.4,
				slowBg = (extra_top + slowScroll) + "px",
				opacity,
				transform = "transform" in document.body.style ? "transform" : "-webkit-transform";

			if (scroll > 0) {
				opacity = (1000 - (scroll*2.7)) / 1000;
			} else {
				opacity = 1;
			}

			$selector.css({
				"position": "relative",
				"top": slowBg,
				"opacity": opacity
			});

			ticking = false;
		}
	}
};

(function($){
	$(document).ready(function(){
		if (!window.utils.isMobile()) {
			skrollr.init();

			$(window).scroll(function() {
				var scroll = $(window).scrollTop(), 
				slowScroll = scroll/4,
				slowBg = 50 + slowScroll;

				$('.hero').css("background-position", "center " + slowBg + "%");
			});

			utils.parallax_text($(".hero .hero-text"), $(".hero-text").position().top);
		}

		$('.contact form').formValidation({
			framework: 'bootstrap'
		}).on('success.form.fv', function(e){
			e.preventDefault();

			var form = $(e.target);

			var url = '//restartlab.createsend.com/t/i/s/ckhlhd/';
			var data = form.serialize();

			$.ajax({
				url: url,
				data: data,
				type: 'POST',
				success: function(request){
					if (request.match(/Invalid Email Address/)) {
						form.find('[type=email]').val('');
						form.formValidation('revalidateField', 'cm-ckikyl-ckikyl');
					}
					else if (request.match(/Thank You/)) {
						form.fadeOut();

					}
				},
				error: function(){

				}
			});
		});
	});
})(jQuery);