
//Public Members
var numberOfActiveSlides = 1;
var numberOfTotalSlides = 1;
var slidesPerClick = 1;
var infitineScroll = false;
var firstActiveSlide = 0;
var lastActiveSlide = 0;
var transitionMode = ""; //this will be used to surround js that only needs to be called for certain transition modes
var slideWidth = "100%";
//var bwslider = {}

function sliderDataSetup() {
	numberOfActiveSlides = parseInt($(".bwslider").attr("data-slides-to-show")); //Get the number of slides to show from the data attr
	numberOfTotalSlides = $(".bwslider-slide").length; //Get the number of total slides
	slidesPerClick = parseInt($(".bwslider").attr("data-slides-per-click")); //Set the number of slides to scroll per click
	$(".bwslider").addClass("bwslider-transition-" + $(".bwslider").attr("data-slide-transition"));
	transitionMode = $(".bwslider").attr('data-slide-transition').toLowerCase();
	infitineScroll = $(".bwslider").attr('data-slide-infinite');
	infitineScroll = infitineScroll.toLowerCase();	
	//Verify no undefined values
}

function sliderTransitionSetup() {
	//determine scroll mode
	//wire click events based on
	var scrollMode = $(".bwslider").attr('data-slide-transition');
	scrollMode = scrollMode.toLowerCase();

	if (transitionMode === "scroll") {
		$(document).on("mouseover", ".bwslider-next", function() {
			forwardScroll();
		});

		$(document).on("mouseover", ".bwslider-prev", function() {
			backwardsScroll();
		});
	} else {
		$(document).on("click", ".bwslider-next", function() {
			nextClick();
		});

		$(document).on("click", ".bwslider-prev", function() {
			prevClick();
		});		
	}

	if (infitineScroll === true) {

	}
}

function numberOfSlidesToDisplay() {
	//Cap the number of active slides by the number of total slides
	if (numberOfActiveSlides > numberOfTotalSlides) {
		numberOfActiveSlides = numberOfTotalSlides;
	}

	lastActiveSlide = numberOfActiveSlides;

	slideWidth = 100/numberOfActiveSlides;
	$(".bwslider-slide").css("width", slideWidth + "%");

	$( ".bwslider-slide" ).each(function(index) {
		$(this).attr('data-slide-index', index);
		if (index < numberOfActiveSlides) {
			$(this).addClass("bwslider-active-slide");
		}

		if (index === firstActiveSlide - 1) {
			$(this).addClass("bwslider-prev-slide");
			if (transitionMode === "slide") {
				$(this).css('margin-left','-' + slideWidth + '%');
			}
		}

		if (index === lastActiveSlide) {
			$(this).addClass("bwslider-next-slide");
			if (transitionMode === "slide") {
				$(this).css('margin-left', '100%');
			}
		}

		//For Fade or Flash mode, appropriately place background slides with correct margins
		if (index % numberOfActiveSlides !== 0) {
			$(this).css('margin-left', slideWidth * (index % numberOfActiveSlides) + '%');
		}
	});
}


function incrementSlider() {
	firstActiveSlide = firstActiveSlide + slidesPerClick;
	lastActiveSlide = lastActiveSlide + slidesPerClick;
	if (firstActiveSlide < 0) {
		firstActiveSlide = 0;
		lastActiveSlide = numberOfActiveSlides;
	}

	if (lastActiveSlide > numberOfTotalSlides) {
		firstActiveSlide = numberOfTotalSlides - numberOfActiveSlides;
		lastActiveSlide = numberOfTotalSlides;
	}
}


function decrementSlider() {
	firstActiveSlide = firstActiveSlide - slidesPerClick;
	lastActiveSlide = lastActiveSlide - slidesPerClick;

	if (firstActiveSlide < 0) {
		firstActiveSlide = 0;
		lastActiveSlide = numberOfActiveSlides;
	}

	if (lastActiveSlide > numberOfTotalSlides) {
		firstActiveSlide = numberOfTotalSlides - numberOfActiveSlides;
		lastActiveSlide = numberOfTotalSlides;
	}
}

function nextClick() {
	incrementSlider();
	$(".bwslider-slide").removeClass("bwslider-prev-slide");
	$(".bwslider-slide").removeClass("bwslider-next-slide");

	if (transitionMode === "slide") {
		nextSlide();
	} else {
		nextFade();
	}
}

function prevClick() {
	decrementSlider();
	$(".bwslider-slide").removeClass("bwslider-prev-slide");
	$(".bwslider-slide").removeClass("bwslider-next-slide");

	if (transitionMode === "slide") {
		prevSlide();
	} else {
		prevFade();
	}
}

function nextSlide() {
	var activeCount = 1;
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
			$(this).css('margin-left', ((slideWidth*activeCount)-slideWidth) + '%');
			activeCount++;
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		if (index === (firstActiveSlide - 1)) {
			$(".bwslider-slide").removeClass("bwslider-prev-slide");
			$(this).addClass("bwslider-prev-slide");
			$(this).css('margin-left','-' + slideWidth + '%');
		} else if (index === (lastActiveSlide)) {
			$(".bwslider-slide").removeClass("bwslider-next-slide");
			$(this).addClass("bwslider-next-slide");
			$(this).css('margin-left', '100%');
		}
	});
}


function prevSlide() {
	$(".bwslider-slide").removeClass("bwslider-prev-slide");
	$(".bwslider-slide").removeClass("bwslider-next-slide");
	var activeCount = numberOfActiveSlides;
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
			$(this).css('margin-left', ((((slideWidth*activeCount)) - slideWidth * 4) * (-1)) + '%');
			activeCount = activeCount - 1;
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		if (index === (firstActiveSlide - 1)) {
			$(".bwslider-slide").removeClass("bwslider-prev-slide");
			$(this).addClass("bwslider-prev-slide");
			$(this).css('margin-left','-' + slideWidth + '%');
		} else if (index === (lastActiveSlide)) {
			$(".bwslider-slide").removeClass("bwslider-next-slide");
			$(this).addClass("bwslider-next-slide");
			$(this).css('margin-left', '100%');
		}
	});
}

function nextFade() {
	$(".bwslider-slide").removeClass("bwslider-prev-slide");
	$(".bwslider-slide").removeClass("bwslider-next-slide");
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		if (index === (firstActiveSlide - 1)) {
			$(".bwslider-slide").removeClass("bwslider-prev-slide");
			$(this).addClass("bwslider-prev-slide");
		} else if (index === (lastActiveSlide)) {
			$(".bwslider-slide").removeClass("bwslider-next-slide");
			$(this).addClass("bwslider-next-slide");
		}
	});
}

function prevFade() {
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		if (index === (firstActiveSlide - 1)) {
			$(".bwslider-slide").removeClass("bwslider-prev-slide");
			$(this).addClass("bwslider-prev-slide");
		} else if (index === (lastActiveSlide)) {
			$(".bwslider-slide").removeClass("bwslider-next-slide");
			$(this).addClass("bwslider-next-slide");
		}
	});
}

function forwardScroll() {
	//on right hover scroll forward
}

function backwardsScroll() {
	//on left hover scroll back
}

function bwsliderInit() {
	sliderDataSetup();
	sliderTransitionSetup();
	numberOfSlidesToDisplay();
}


$(function(){
	bwsliderInit()
});