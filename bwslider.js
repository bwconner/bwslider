//Public Members
var numberOfActiveSlides = 1;
var numberOfTotalSlides = 1;
var slidesPerClick = 1;
var transitionMode = ""; //this will be used to surround js that only needs to be called for certain transition modes
var infitineScroll = false;
var firstActiveSlide = 0;
var lastActiveSlide = 0;
var slideWidth = "100%";
//var bwslider = {}

function sliderDataSetup() {
	//Pull in values for global variables
	numberOfActiveSlides = parseInt($(".bwslider").attr("data-slides-to-show")); //Get the number of slides to show from the data attr
	numberOfTotalSlides = $(".bwslider-slide").length; //Get the number of total slides
	slidesPerClick = parseInt($(".bwslider").attr("data-slides-per-click")); //Set the number of slides to scroll per click
	transitionMode = $(".bwslider").attr("data-slide-transition").toLowerCase();
	infitineScroll = $(".bwslider").attr("data-slide-infinite").toLowerCase();

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
		$(".bwslider-stack").addClass(".current-slide-stack")
		$(clonedSlides).insertBefore(".bwslider-stack");
		$(clonedSlides).insertAfter(".bwslider-stack");
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

function numberOfSlidesToDisplay() {
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

		if (index === firstActiveSlide - 1) {
			//$(this).addClass("bwslider-prev-slide");
		}

		if (index === lastActiveSlide) {
			//$(this).addClass("bwslider-next-slide");
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

function numberOfInfiniteSlidesToDisplay {
	//Cap the number of active slides by the number of total slides
	if (numberOfActiveSlides > numberOfTotalSlides) {
		numberOfActiveSlides = numberOfTotalSlides;
	}

	lastActiveSlide = numberOfActiveSlides;

	slideWidth = 100/numberOfActiveSlides;
	$(".bwslider-slide").css("width", slideWidth + "%");

	$( ".bwslider-slide" ).each(function(index) {
		$(this).attr("data-slide-index", index);
		console.log((index + numberOfTotalSlides < numberOfActiveSlides + numberOfTotalSlides));
		if ((index < numberOfActiveSlides + numberOfTotalSlides) && (index >= numberOfTotalSlides) && (infitineScroll === "true")) {
			//Infinite is true so set the middle stack slides as active
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
	//$(".bwslider-slide").removeClass("bwslider-prev-slide");
	//$(".bwslider-slide").removeClass("bwslider-next-slide");

	if (transitionMode === "slide") {
		nextSlide();
	} else {
		nextFade();
	}
}

function prevClick() {
	decrementSlider();
	//$(".bwslider-slide").removeClass("bwslider-prev-slide");
	//$(".bwslider-slide").removeClass("bwslider-next-slide");

	if (transitionMode === "slide") {
		prevSlide();
	} else {
		prevFade();
	}
}

function nextSlide() {
	var activeCount = 1;

	//If already at end of the slides return out of this function with going further
	if ($(".bwslider-slide").last().hasClass("bwslider-active-slide")) {
		return;
	}

	$( ".bwslider-slide" ).each(function(index) {
		//Set the margins for the active slides
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
			$(this).css("margin-left", ((slideWidth*activeCount)-slideWidth) + "%");
			activeCount++;
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		//Set the margins for the non active slides
		if(!$(this).hasClass("bwslider-active-slide")) {
			var currentMargin = ($(this)[0].style.marginLeft);
			currentMargin =  parseInt(currentMargin);
			console.log("index:" + index);
			console.log("margin before math:" + currentMargin);
			$(this).css("margin-left", (currentMargin - slideWidth) + "%");
			console.log("margin after math:" + currentMargin);
		}

		//Make sure the prev and next slide are completely out of view and no fractional math is causing any issues
		if (index === (firstActiveSlide - 1)) {
			//$(".bwslider-slide").removeClass("bwslider-prev-slide");
			//$(this).addClass("bwslider-prev-slide");
			$(this).css("margin-left","-" + slideWidth + "%");
		} else if (index === (lastActiveSlide)) {
			//$(".bwslider-slide").removeClass("bwslider-next-slide");
			//$(this).addClass("bwslider-next-slide");
			$(this).css("margin-left", "100%");
		}

	});
}


function prevSlide() {
	//$(".bwslider-slide").removeClass("bwslider-prev-slide");
	//$(".bwslider-slide").removeClass("bwslider-next-slide");
	var activeCount = numberOfActiveSlides;

	//If already at beginning of the slides return out of this function with going further
	if ($(".bwslider-slide").first().hasClass("bwslider-active-slide")) {
		return;
	}

	$( ".bwslider-slide" ).each(function(index) {
		//Set the margins for the active slides
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
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
			console.log("index:" + index);
			console.log("margin before math:" + currentMargin);
			$(this).css("margin-left", (currentMargin + slideWidth) + "%");
			console.log("margin after math:" + currentMargin);
		}

		//Make sure the prev and next slide are completely out of view and no fractional math is causing any issues
		if (index === (firstActiveSlide - 1)) {
			//$(".bwslider-slide").removeClass("bwslider-prev-slide");
			//$(this).addClass("bwslider-prev-slide");
			$(this).css("margin-left","-" + slideWidth + "%");
		} else if (index === (lastActiveSlide)) {
			//$(".bwslider-slide").removeClass("bwslider-next-slide");
			//$(this).addClass("bwslider-next-slide");
			$(this).css("margin-left", "100%");
		}
	});
}

function nextFade() {
	//$(".bwslider-slide").removeClass("bwslider-prev-slide");
	//$(".bwslider-slide").removeClass("bwslider-next-slide");
	$( ".bwslider-slide" ).each(function(index) {
		if ((index >= firstActiveSlide) && (index < lastActiveSlide)) {
			$(this).addClass("bwslider-active-slide");
		} else {
			$(this).removeClass("bwslider-active-slide");
		}

		if (index === (firstActiveSlide - 1)) {
			//$(".bwslider-slide").removeClass("bwslider-prev-slide");
			//$(this).addClass("bwslider-prev-slide");
		} else if (index === (lastActiveSlide)) {
			//$(".bwslider-slide").removeClass("bwslider-next-slide");
			//$(this).addClass("bwslider-next-slide");
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
			//$(".bwslider-slide").removeClass("bwslider-prev-slide");
			//$(this).addClass("bwslider-prev-slide");
		} else if (index === (lastActiveSlide)) {
			//$(".bwslider-slide").removeClass("bwslider-next-slide");
			//$(this).addClass("bwslider-next-slide");
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

	$(window).resize(function() {
		var sliderHeight = $(".bwslider-active-slide img").height();
		$(".bwslider").css("height", sliderHeight);
	});
}


$(function(){
	bwsliderInit()
});