//var bwslider = {}

//Public Members
var numberOfActiveSlides = 1;
var numberOfTotalSlides = 1;
var slidesPerClick = 1;
var transitionMode = ""; //this will be used to surround js that only needs to be called for certain transition modes
var infitineScroll = false;
var firstActiveSlide = 0;
var lastActiveSlide = 0;
var slideWidth = "100%";
var slidesLeftInStack = 1;
var slidePadding = 0;

if (infitineScroll === "true") {
	var clonedNextStack;
	var clonedPrevStack;
}

function sliderDataSetup() {
	//Pull in values for global variables
	numberOfActiveSlides = parseInt($(".bwslider").attr("data-slides-to-show")); //Get the number of slides to show from the data attr
	numberOfTotalSlides = $(".bwslider-slide").length; //Get the number of total slides
	slidesLeftInStack = numberOfTotalSlides;
	slidesPerClick = parseInt($(".bwslider").attr("data-slides-per-click")); //Set the number of slides to scroll per click
	transitionMode = $(".bwslider").attr("data-slide-transition").toLowerCase();
	infitineScroll = $(".bwslider").attr("data-slide-infinite").toLowerCase();
	slidePadding = $(".bwslider").attr("data-slide-padding");

	//Set up new variables
	var transitionSpeed = parseInt($(".bwslider").attr("data-slide-speed"));
	var transitionDelay = parseInt($(".bwslider").attr("data-slide-delay"));

	//Verify no undefined values

	//Apply data to appropriate elements
	$(".bwslider").addClass("bwslider-transition-" + transitionMode);
	$(".bwslider-slide").css("transition-duration",transitionSpeed +"ms");
	$(".bwslider-slide").css("transition-delay", transitionDelay +"ms");
}

function sliderTransitionSetup() {
	if (infitineScroll === "true") {
		var clonedSlides = $(".bwslider-stack").clone();
		$(".bwslider-stack").addClass("current-slide-stack")
		$(clonedSlides).insertBefore(".bwslider-stack");
		$(clonedSlides).insertAfter(".bwslider-stack");
		$(".bwslider-stack:nth-child(1)").addClass("prev-slide-stack");
		$(".bwslider-stack:nth-child(3)").addClass("next-slide-stack");
	}

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
}

function displayInitialSlides() {
	//Cap the number of active slides by the number of total slides
	if (numberOfActiveSlides > numberOfTotalSlides) {
		numberOfActiveSlides = numberOfTotalSlides;
	}

	lastActiveSlide = numberOfActiveSlides;

	slideWidth = 100/numberOfActiveSlides;
	$(".bwslider-slide").css("width", slideWidth + "%");

	$( ".bwslider-slide" ).each(function(index) {
		$(this).attr("data-slide-index", index);
		if (index < numberOfActiveSlides) {
			$(this).addClass("bwslider-active-slide");
		}

		//Line up all of the slides for slide scroll
		if (transitionMode === "slide") {
			$(this).css("margin-left", (slideWidth * index) + "%");
		}

		//For Fade or Flash mode, appropriately place background slides with correct margins
		if ((transitionMode !== "slide") && index % numberOfActiveSlides !== 0) {
			$(this).css("margin-left", slideWidth * (index % numberOfActiveSlides) + "%");
		}
	});

	var sliderHeight = $(".bwslider-active-slide img").height();
	$(".bwslider").css("height", sliderHeight);
}

function displayInitialInfiniteSlides() {
	//Cap the number of active slides by the number of total slides
	if (numberOfActiveSlides > numberOfTotalSlides) {
		numberOfActiveSlides = numberOfTotalSlides;
	}

	lastActiveSlide = numberOfActiveSlides;

	slideWidth = 100/numberOfActiveSlides;
	$(".bwslider-slide").css("width", slideWidth + "%");

	$( ".bwslider-slide" ).each(function(index) {
		$(this).attr("data-slide-index", index);
		if ((index < numberOfActiveSlides + numberOfTotalSlides) && (index >= numberOfTotalSlides) && (infitineScroll === "true")) {
			//Infinite is true so set the middle stack slides as active
			$(this).addClass("bwslider-active-slide");
		}

		//Line up all of the slides for slide scroll
		if (transitionMode === "slide") {
			$(this).css("margin-left", ((slideWidth * index) - (slideWidth * numberOfTotalSlides)) + "%");
		}

		//For Fade or Flash mode, appropriately place background slides with correct margins
		if ((transitionMode !== "slide") && index % numberOfActiveSlides !== 0) {
			$(this).css("margin-left", slideWidth * (index % numberOfActiveSlides) + "%");
		}
	});

	clonedNextStack = $(".bwslider-stack.next-slide-stack").clone();
	clonedPrevStack = $(".bwslider-stack.prev-slide-stack").clone();	

	var sliderHeight = $(".bwslider-active-slide img").height();
	$(".bwslider").css("height", sliderHeight);
}

function incrementSlider() {
	firstActiveSlide = firstActiveSlide + slidesPerClick;
	lastActiveSlide = lastActiveSlide + slidesPerClick;

	if (firstActiveSlide < 0 && !infitineScroll) {
		firstActiveSlide = 0;
		lastActiveSlide = numberOfActiveSlides;
	}

	if (lastActiveSlide > numberOfTotalSlides && !infitineScroll) {
		firstActiveSlide = numberOfTotalSlides - numberOfActiveSlides;
		lastActiveSlide = numberOfTotalSlides;
	}
}


function decrementSlider() {
	firstActiveSlide = firstActiveSlide - slidesPerClick;
	lastActiveSlide = lastActiveSlide - slidesPerClick;

	if (firstActiveSlide < 0 && !infitineScroll) {
		firstActiveSlide = 0;
		lastActiveSlide = numberOfActiveSlides;
	}

	if (lastActiveSlide > numberOfTotalSlides && !infitineScroll) {
		firstActiveSlide = numberOfTotalSlides - numberOfActiveSlides;
		lastActiveSlide = numberOfTotalSlides;
	}
}

function nextClick() {
	incrementSlider();

	if (transitionMode === "slide") {
		nextSlide();
	} else {
		nextFade();
	}

	slidesLeftInStack = slidesLeftInStack - 1;

	if (infitineScroll && slidesLeftInStack == 0) {
		slidesLeftInStack = numberOfTotalSlides;
		//Remove previous slide stack and make old current slide stack the new previous
		$(".prev-slide-stack").remove();
		$(".current-slide-stack").addClass("prev-slide-stack");

		//Clone the next stack of slides
		var cloneSlideStack = $(".next-slide-stack").clone();

		//Remove the current and next stack classes and insert the next slide stack
		$(".current-slide-stack").removeClass("current-slide-stack");
		$(".next-slide-stack").addClass("current-slide-stack");
		$(".current-slide-stack").removeClass("next-slide-stack");
		$(cloneSlideStack).insertAfter(".current-slide-stack");

		//Remove active slides in new next stack
		$(".next-slide-stack .bwslider-active-slide").removeClass("bwslider-active-slide");
	}
}

function prevClick() {
	decrementSlider();

	if (transitionMode === "slide") {
		prevSlide();
	} else {
		prevFade();
	}

	if (infitineScroll && $(".current-slide-stack .bwslider-active-slide").length == 0) {
		//Remove next slide stack and make old current slide stack the new previous
		$(".next-slide-stack").remove();
		$(".current-slide-stack").addClass("next-slide-stack");

		//Clone the prev stack of slides
		var cloneSlideStack = $(".prev-slide-stack").clone();

		//Remove the current and prev stack classes and insert the next slide stack
		$(".current-slide-stack").removeClass("current-slide-stack");
		$(".prev-slide-stack").addClass("current-slide-stack");
		$(".current-slide-stack").removeClass("prev-slide-stack");
		$(cloneSlideStack).insertBefore(".current-slide-stack");

		//Remove active slides in new prev stack
		$(".prev-slide-stack .bwslider-active-slide").removeClass("bwslider-active-slide");
	}
}

function nextSlide() {
	var activeCount = 1;
	var infiniteOffset = 0;

	if (infitineScroll === "true") {
		infiniteOffset = numberOfTotalSlides;
	}

	//If already at end of the slides return out of this function with going further
	if ($(".bwslider-slide").last().hasClass("bwslider-active-slide")) {
		return;
	}

	$( ".bwslider-slide" ).each(function(index) {
		//Set the margins for the active slides
		if ((index >= firstActiveSlide + infiniteOffset) && (index < lastActiveSlide + infiniteOffset)) {
			$(this).addClass("bwslider-active-slide");
			$(this).css("margin-left", ((slideWidth*activeCount)-slideWidth) + "%");
			console.log((slideWidth*activeCount)-slideWidth);
			activeCount++;
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		//Set the margins for the non active slides
		if(!$(this).hasClass("bwslider-active-slide")) {
			var currentMargin = ($(this)[0].style.marginLeft);
			currentMargin =  parseInt(currentMargin);
			$(this).css("margin-left", (currentMargin - slideWidth) + "%");
		}

		//Make sure the prev and next slide are completely out of view and no fractional math is causing any issues
		if (index === (firstActiveSlide - 1)) {
			$(this).css("margin-left","-" + slideWidth + "%");
		} else if (index === (lastActiveSlide)) {
			$(this).css("margin-left", "100%");
		}

	});
}


function prevSlide() {
	var activeCount = numberOfActiveSlides;
	var infiniteOffset = 0;

	if (infitineScroll) {
		infiniteOffset = numberOfTotalSlides;
	}

	//If already at beginning of the slides return out of this function with going further
	if ($(".bwslider-slide").first().hasClass("bwslider-active-slide")) {
		return;
	}

	$( ".bwslider-slide" ).each(function(index) {
		//Set the margins for the active slides
		if ((index >= firstActiveSlide + infiniteOffset) && (index < lastActiveSlide + infiniteOffset)) {
			$(this).addClass("bwslider-active-slide");
			$(this).css("margin-left", ((((slideWidth*activeCount)) - slideWidth * numberOfActiveSlides) * (-1)) + "%");
			activeCount = activeCount - 1;
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		//Set the margins for the non active slides
		if(!$(this).hasClass("bwslider-active-slide")) {
			var currentMargin = ($(this)[0].style.marginLeft);
			currentMargin =  parseInt(currentMargin);
			$(this).css("margin-left", (currentMargin + slideWidth) + "%");
		}

		//Make sure the prev and next slide are completely out of view and no fractional math is causing any issues
		if (index === (firstActiveSlide - 1)) {
			$(this).css("margin-left","-" + slideWidth + "%");
		} else if (index === (lastActiveSlide)) {
			$(this).css("margin-left", "100%");
		}
	});
}

function nextFade() {
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
		} else {
			$(this).removeClass("bwslider-active-slide");
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
	});
}

function forwardScroll() {
	//on right hover scroll forward
}

function backwardsScroll() {
	//on left hover scroll back
}

function sliderPaddingSetup() {
	var newSlideHeight = $(".bwslider-slide img").height() - slidePadding * 2;
	var newSlideWidth = $(".bwslider-slide img").width() - slidePadding * 2;
	
	$(".bwslider-slide .bwslider-slide-content").css("margin", slidePadding);
	$(".bwslider-slide .bwslider-slide-content").css("height", newSlideHeight);
	$(".bwslider-slide .bwslider-slide-content").css("width", newSlideWidth);
}

function bwsliderInit() {
	sliderDataSetup();
	sliderTransitionSetup();

	if (infitineScroll === "true") {
		displayInitialInfiniteSlides();
	} else {
		displayInitialSlides();
	}

	if (slidePadding > 0) {
		sliderPaddingSetup();
	}

	$(window).resize(function() {
		var sliderHeight = $(".bwslider-active-slide .bwslider-slide-content").height();
		$(".bwslider").css("height", sliderHeight);
	});
}

$(function(){
	bwsliderInit()
});