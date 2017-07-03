
//Public Members
var numberOfActiveSlides = 1;
var numberOfTotalSlides = 1;
var slidesPerClick = 1;
var infitineScroll = false;
var firstActiveSlide = 0;
var lastActiveSlide = 0;
var transitionMode = ""; //this will be used to surround js that only needs to be called for certain transition modes

//var bwslider = {}

function sliderDataSetup() {
	numberOfActiveSlides = parseInt($(".bwslider").attr("data-slides-to-show")); //Get the number of slides to show from the data attr
	numberOfTotalSlides = $(".bwslider-slide").length; //Get the number of total slides
	slidesPerClick = parseInt($(".bwslider").attr("data-slides-per-click")); //Set the number of slides to scroll per click
	$(".bwslider").addClass("bwslider-transition-" + $(".bwslider").attr("data-slide-transition"));
	
	//Verify no undefined values
}

function sliderTransitionSetup() {
	//determine scroll mode
	//wire click events based on
	var scrollMode = $(".bwslider").attr('data-slide-transition');
	scrollMode = scrollMode.toLowerCase();

	if (scrollMode === "scroll") {
		$(document).on("mouseover", ".bwslider-next", function() {
			forwardScroll();
		});

		$(document).on("mouseover", ".bwslider-prev", function() {
			backwardsScroll();
		});
	} else {
		$(document).on("click", ".bwslider-next", function() {
			nextSlideClick();
		});

		$(document).on("click", ".bwslider-prev", function() {
			prevSlideClick();
		});		
	}

	infitineScroll = $(".bwslider").attr('data-slide-infinite');
	infitineScroll = infitineScroll.toLowerCase();

	if (infitineScroll === true) {

	}
}

function numberOfSlidesToDisplay() {
	//get number of slides to display data attr
	//divide 100 by that data attr
	//add that css width to slide elements
	//use this number to determine number of slides to add active classes to
	//add first slider and last slide classes

	//Cap the number of active slides by the number of total slides
	if (numberOfActiveSlides > numberOfTotalSlides) {
		numberOfActiveSlides = numberOfTotalSlides;
	}

	lastActiveSlide = numberOfActiveSlides;

	var slideWidth = 100/numberOfActiveSlides;
	$(".bwslider-slide").css("width", slideWidth + "%");

	$( ".bwslider-slide" ).each(function(index) {
		$(this).attr('data-slide-index', index);
		if (index < numberOfActiveSlides) {
			$(this).addClass("bwslider-active-slide");
		}

		if (index === firstActiveSlide - 1) {
			$(this).addClass("bwslider-prev-slide");
		}

		if (index === lastActiveSlide) {
			$(this).addClass("bwslider-next-slide");
		}

		//may not need this
		//if (index === 0) {
		//	$(this).addClass("bwslider-first-active-slide"); //may not need this
		//}

		//may not need this
		//if (index === numberOfActiveSlides) {
		//	$(this).addClass("bwslider-last-active-slide"); //may not need this
		//	lastActiveSlide = index;
		//}

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

function nextSlideClick() {
	incrementSlider();
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

function prevSlideClick() {
	decrementSlider();
	$(".bwslider-slide").removeClass("bwslider-prev-slide");
	$(".bwslider-slide").removeClass("bwslider-next-slide");
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
		} else {
			$(this).removeClass("bwslider-active-slide");
		}
console.log("index:" + index);
console.log("prev:" + (firstActiveSlide - 1));
console.log("next:" + (lastActiveSlide + 1));
		if (index === (firstActiveSlide - 1)) {
			$(".bwslider-slide").removeClass("bwslider-prev-slide");
			$(this).addClass("bwslider-prev-slide");
		}
		if (index === (lastActiveSlide)) {
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