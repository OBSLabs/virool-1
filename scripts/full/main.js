/*
class 'startInViewport' means that element start animation only when it's appers in viewport
copyright ©2015 Roman Antonov
*/

/*--------------SPEC VARIABLES--------------*/
//class names
var flickClassname				=	"flick";
var startInViewportClassname	=	"startInViewport";
var faceClassname				=	"face-box";
var redDotClassname				=	"red dot";
var blueDotClassname			=	"blue dot";
var demClassname				=	"dem";
var repClassname				=	"rep";
var simpleHandsNumbClassname	=	"numb";
var handsPercentageClassname	=	"percentage";
var mobileGroupClassname		=	"mobile-group";
var flagGroupClassname			=	"flag-group";

//elements
var startInViewport				=	{};
var bigScrolls 					=	{};
var chartBarsCollection 		=	{};
var simpleHandsCollection 		=	{};
var mobileHandsCollection		=	{};
var flagHandsCollection			=	{};
var primaryNavCollection		=	{};

//dots specs
var dotsAmount					=	100;
var maxDotSize					=	.08;
var minDotSize					=	.01;
var parentSize					=	{};

var chart1 						=	{};
var chart2 						=	{};
var allSections 				=	{};
var noStickySections			=	{};
var postsNumber 				=	{};
var primaryNav 					=	{};
var originalNumber				=	{};
var heroText					=	{};
var controls 					=	{};

var scrolledRestoreTime			=	650;					//restore time for "scrolled"
var isScrolled 					=	false;					//indicates if user scrolled in last screen in last scrolledRestoreTime mseconds
var isScrollEnabled				=	false;
var isMenuOpened 				=	false;
var menuButtonClicked			=	false;
var scrolledTimeout				=	null;					//just for storing current active timeout
var keys 						=	{37: 1, 38: 1,
									39: 1, 40: 1,
									32: 1, 34: 1,
									35: 1, 36: 1};			//disable scrolling events for those buttons
var scrollDownKeys				=	{39: 1, 40: 1, 32: 1, 34: 1, 35: 1}
/*------------------------------------------*/

/*--------------DOCUMENT READY--------------*/
$(function(){	//same as $(document).ready(...);
	/*--------------SET ELEMENTS--------------*/
	controls = $('.controls');
	controls.each(function(){
		this.charts = $(this).find('.chart-bars');
		this.charts.currentStep = 0;
		this.charts.stepsEnabled = true;

		this.leftScroll = $(this).find('.left');
		this.rightScroll = $(this).find('.right');
		this.leftScroll.object = this.charts;
		this.rightScroll.object = this.charts;

		this.scrollEvent = marginAnimation;

		if($(this).find('.table-moving').length){
			var width = this.charts.find('tfoot').find('td')[0].clientWidth * this.charts.find('tfoot').find('td').length;
			this.charts.steps = [{ step : 0}, {
				step : -(width - $(window).width()) / 3}, {
				step : -(width - $(window).width()) / 3 * 2}, {
				step : -(width - $(window).width()) * 1.02}];
		} else {
			this.charts.steps = [{ step : 0}, { step : -(this.charts[0].clientWidth - $(window).width())}];
		}
	});

	//configure all chart bars
	chartBarsCollection = $('.chart-piece-wrapper');
	chartBarsCollection.currentAnimationIndex = 0;
	chartBarsCollection.transitToNext = .2;
	chartBarsCollection.isActive = false;

	chartBarsCollection.each(function(){
		$(this).css({"width" : "6.67%"});
		this.chartBar = $(this).find('.chart-bar');
		this.chartImage = $(this).find('img');
		this.chartName = $(this).find('h6');
		this.chartPercentage = $(this).find('span');
		this.chartText = $(this).find('.chart-text');
		this.chartPiece = $(this).find('.chart-piece');
	});

	simpleHandsCollection = $('.hand-bar');
	simpleHandsCollection.each(function(index){
		this.chartBar = $(this);
		this.maxHeight = simpleHandsHeights[index].height;
	});
	shuffle(simpleHandsCollection);
	simpleHandsCollection.currentAnimationIndex = 0;
	simpleHandsCollection.transitToNext = .3;
	simpleHandsCollection.doAtEnd = {
		animation : fadeInAnimation,
		object : $(simpleHandsCollection[0].parentElement.parentElement.parentElement).find('.' + simpleHandsNumbClassname)
	}
	simpleHandsCollection.doAtEnd.object.doAtEnd = {
		animation : fadeInAnimation,
		object : $(simpleHandsCollection[0].parentElement.parentElement.parentElement).find('.' + handsPercentageClassname)
	}

	mobileHandsCollection = $('.' + mobileGroupClassname).find('img');
	mobileHandsCollection.currentAnimationIndex = 0;
	mobileHandsCollection.each(function(){
		this.maxHeight = 0;
	});
	shuffle(mobileHandsCollection);
	mobileHandsCollection.doAtEnd = {
		animation : fadeInAnimation,
		object : $(mobileHandsCollection[0].parentElement.parentElement.parentElement).find('.' + simpleHandsNumbClassname)
	}
	mobileHandsCollection.doAtEnd.object.doAtEnd = {
		animation : fadeInAnimation,
		object : $(mobileHandsCollection[0].parentElement.parentElement.parentElement).find('.' + handsPercentageClassname)
	}

	flagHandsCollection = $('.' + flagGroupClassname).find('img');
	flagHandsCollection.currentAnimationIndex = 0;
	flagHandsCollection.each(function(){
		this.maxHeight = 0;
	});
	shuffle(flagHandsCollection);
	flagHandsCollection.doAtEnd = {
		animation : fadeInAnimation,
		object : $(flagHandsCollection[0].parentElement.parentElement.parentElement).find('.' + simpleHandsNumbClassname)
	}

	primaryNav = $('.cd-primary-nav');
	primaryNavCollection = primaryNav.find('a');
	primaryNavCollection.currentAnimationIndex = 0;
	primaryNavCollection.isActive = false;
	primaryNavCollection.isTurnedOn = false;

	allSections = $('.sticky');
	allSections.currentSection = 0;

	noStickySections = $('.attr-no-sticky');

	postsNumber = $('.postsNumber');
	originalNumber = Number(postsNumber[0].textContent);

	heroText = $('.hero-section').find('h1, h4');

	disableScroll();
	startScrollEvent();
	/*----------------------------------------*/

	//set parent size
	parentSize = elementSize($('.temporary-box').eq(0));

	//populate map with dots
	initializeDots($('.temporary-box').eq(0));

	//collect all elements that should start "when inside of viewport"
	startInViewport = $('.' + startInViewportClassname);

	//init scroll boxe's heights
	onWindowResize();

	//configure animates elements on screen
	startInViewport.each(function(index){
		this.isLaunched = false;
		this.maxWidth = this.clientHeight;
		this.maxHeight = this.clientWidth;
		this.maxOpacity = 1;
		this.randomizePosition = false;
		if($(this).doAtEnd == null){
			this.doAtEnd = {
				animation : function(){},
				object : null
			};
		}

		//if class !dot, set fixed sizes
		if(containClass($(this)[0], faceClassname)){
			this.maxWidth = parentSize.width * maxDotSize;
			this.maxHeight = parentSize.width * maxDotSize;
			this.randomizePosition = true;
			this.doAtEnd.animation = flickOut;
			this.doAtEnd.object = $(this);
		}else if(containClass($(this)[0], redDotClassname) || containClass($(this)[0], blueDotClassname)){
		//or use random
			this.randomizePosition = true;
			this.maxOpacity = .25;
			this.doAtEnd.animation = flickOut;
			this.doAtEnd.object = $(this);
			if(Math.random() > 0.8){
				this.maxWidth = parentSize.width * maxDotSize;
				this.maxHeight = parentSize.width * maxDotSize;
			} else {
				var size = parentSize.width * minDotSize;
				this.maxWidth = size;
				this.maxHeight = size;
				this.maxOpacity = 1;
			}
		}

		//if elements should flick
		if(containClass($(this)[0], flickClassname)){
			this.animation = flickIn;
		}

		//if element is chart box
		if(containClass($(this)[0], 'chart-bars')){
			this.animation = startChartSlideshow;
		}

		//start hands animation when appears in view
		if(containClass($(this)[0], 'hand-group')){
			this.animation = simpleHandsAnimation;
		}

		//animation for mobile hands
		if(containClass($(this)[0], mobileGroupClassname)){
			this.animation = mobileGroupAnimation;
		}

		//animation form flag hands
		if(containClass($(this)[0], flagGroupClassname)){
			this.animation = flagGroupAnimation;
		}

		if($(this).is('img')){
			this.doAtEnd = {
				animation : fadeOutAnimation,
				object : $(this)
			}
			this.animation = fadeInAnimation;
			this.fadeInDelay = Math.random() * 2000 + 2000;
			this.fadeOutDelay = Math.random() * 2000 + 2000;
		}
	});

	/*--------------INIT CHARTS---------------*/
	chart1 = new Highcharts.Chart({
        chart: { type: 'spline', renderTo: 'chartContainer1' },
		tooltip: { enabled: false },
		title: { text: '' },
        subtitle: { text: 'Sessions: 186', floating: true, y: 240 },
		yAxis: { title: '', min: 0, labels: { formatter: function() { return this.value + "%"; } }, gridLineWidth: 0 },
		xAxis: { type: 'datetime', dateTimeLabelFormats : { minute: '%H:%M' }, showFirstLabel: false, gridLineWidth: .5 },
        plotOptions: {
        	spline: { lineWidth: 2, states: { hover: { lineWidth: 4 }  },
        	marker: { enabled: false }, pointInterval: 14 * 3600, pointStart: Date.UTC(2015, 4, 31, 0, 0, 0) }
        },
		legend: { enabled: false },
		series: [{ name: 'Hestavollane',
            data: [4, 8, 8, 12, 32, 23, 13, 15, 23, 12, 34, 34, 34, 23, 35, 32, 35, 25, 24, 21, 27, 24, 27, 23, 13, 31, 27, 21, 36, 21, 28, 26,
	        	22, 29, 29, 35, 26] }, { name: 'Vik',
            data: [10, 20, 26, 29, 28, 12, 30, 20, 30, 21, 26, 27, 38, 26, 22, 20, 21, 13, 23, 30, 21, 20, 30, 10, 22, 21, 20, 13, 20, 31, 22,
            	21, 13, 23, 20, 11, 21]}]});

	chart2 = new Highcharts.Chart({
        chart: { type: 'spline', renderTo: 'chartContainer2' },
		tooltip: { enabled: false },
		title: { text: '' },
        subtitle: { text: 'Sessions: 186', floating: true, y: 240 },
		yAxis: { title: '', min: 0, labels: { formatter: function() { return this.value + "%"; } }, gridLineWidth: 0 },
		xAxis: { type: 'datetime', dateTimeLabelFormats : { minute: '%H:%M' }, showFirstLabel: false, gridLineWidth: .5 },
        plotOptions: {
        	spline: { lineWidth: 2, states: { hover: { lineWidth: 4 }  },
        	marker: { enabled: false }, pointInterval: 14 * 3600, pointStart: Date.UTC(2015, 4, 31, 0, 0, 0) }
        },
		legend: { enabled: false },
		series: [{ name: 'Hestavollane',
            data: [4, 8, 8, 12, 32, 23, 13, 15, 23, 12, 34, 34, 34, 23, 35, 32, 35, 25, 24, 21, 27, 24, 27, 23, 13, 31, 27, 21, 36, 21, 28, 26,
	        	22, 29, 29, 35, 26] }, { name: 'Vik',
            data: [10, 20, 26, 29, 28, 12, 30, 20, 30, 21, 26, 27, 38, 26, 22, 20, 21, 13, 23, 30, 21, 20, 30, 10, 22, 21, 20, 13, 20, 31, 22,
            	21, 13, 23, 20, 11, 21]}]});
	/*----------------------------------------*/
});
/*------------------------------------------*/

/*--------------DOCUMENT EVENTS--------------*/

$(window).load(function() {
	$(".se-pre-con").fadeOut("slow");
	NProgress.done();
});

$(function(){
	NProgress.start();
});

$(window).on('scroll', function(){
	if(isScrollEnabled){
		scrollEvent();
	}
});

// ==> smooth scrolling
$('.nav-links').click(function(){
	(isScrollEnabled)?(disableScroll()):{};
	allSections.currentSection = primaryNavCollection.index($(this));
	smoothScrollTo($(allSections[allSections.currentSection]), null);
});

$('.scroll-down-button').click(function(){
	allSections.currentSection = 1;
	smoothScrollTo($(allSections[allSections.currentSection]), null);
});

//open/close primary navigation
$('.lines-button').on('click', function(){
	toggleMenu();
});


$('.scroll-button').on('click', function(){
	scrollButtons($(this));
});

$('.graph-tabs .list-inline').on('click','li', function(){
   $(this).addClass('active').siblings().removeClass('active');
});


$('.chartByMonth').click(function(){
	controls[0].rightScroll.object.stepsEnabled = true;
	scrollButtons(controls[0].leftScroll);
	if(chartBarsCollection.isActive){
		$(chartBarsCollection[chartBarsCollection.currentAnimationIndex].chartBar).stop(true);
	}
	startChartSlideshow(null, byMonthData);
});

$('.chartByYear').click(function(){
	controls[0].rightScroll.object.stepsEnabled = true;
	scrollButtons(controls[0].leftScroll);
	if(chartBarsCollection.isActive){
		$(chartBarsCollection[chartBarsCollection.currentAnimationIndex].chartBar).stop(true);
	}
	startChartSlideshow(null, byYearData);
});

$('.chartBy2012').click(function(){
	controls[0].rightScroll.object.stepsEnabled = false;
	scrollButtons(controls[0].leftScroll);
	if(chartBarsCollection.isActive){
		$(chartBarsCollection[chartBarsCollection.currentAnimationIndex].chartBar).stop(true);
	}
	startChartSlideshow(null, twentytwelveDAta);
});

scrollButtons = function(button){
	controls.each(function(){
		var left = $(this)[0].leftScroll;
		var right = $(this)[0].rightScroll;

		if(right[0] == button[0]){
			if(right.object.currentStep < right.object.steps.length - 1){
				right.object.currentStep++;
			}
			right.by = right.object.steps[right.object.currentStep].step;
			$(this)[0].scrollEvent(right);
		} else if(left[0] == button[0]){
			right.object.currentStep = 0;
			left.by = right.object.steps[right.object.currentStep].step;
			$(this)[0].scrollEvent($(this)[0].leftScroll);
		}

		if(!right.object.stepsEnabled){
			right.stop().animate({ opacity : 0}, function(){ right.css({"display" : "none"}); });
			left.stop().animate({ opacity : 0}, function(){ left.css({"display" : "none"}); });
		} else if(right.object.currentStep == right.object.steps.length - 1){
			right.stop().animate({ opacity : 0}, function(){ right.css({"display" : "none"}); });
			left.css({"display" : "table"});
			left.stop().animate({ opacity : 1});
		} else if(right.object.currentStep == 0){
			left.stop().animate({ opacity : 0}, function(){ left.css({"display" : "none"}); });
			right.css({"display" : "table"});
			right.stop().animate({ opacity : 1});
		} else {
			left.css({"display" : "table"});
			left.stop().animate({ opacity : 1});
			right.css({"display" : "table"});
			right.stop().animate({ opacity : 1});
		}
	});
}

checkInViewport = function(){
	//check each element if it is in a viewport
	startInViewport.each(function(index){
		if(elementInViewport(this)){
			if(!this.isLaunched){
				//animate
				this.isLaunched = true;
				if($(this)[0].animation != null){
					$(this)[0].animation($(this));
				}
			}
		}
	});
}

toggleMenu = function(){
	isMenuOpened = !isMenuOpened;
	$('.lines-button').toggleClass('close');
	toggleNavigation(primaryNavCollection);
}

scrolled = function(){
	checkInViewport();

	noStickySections.each(function(){
		if(this == allSections[allSections.currentSection]){
			if($(window).scrollTop() < ($(this)[0].offsetTop - 200)){
				if(isScrollEnabled){
					isScrollEnabled = false;
					disableScroll();
					scrollToPrevSection();
				}
			} else if($(window).scrollTop() > $(this)[0].offsetTop + $(this)[0].clientHeight - $(window).height() + 200){
				if(isScrollEnabled){
					isScrollEnabled = false;
					disableScroll();
					scrollToNextSection();
				}
			}
		}
	});
}

scrollEvent = function(){
	checkScrolled();
    scrolled();
    if(isMenuOpened){
		toggleMenu();
	}
}

startScrollEvent = function(){
	var found = false;
	if(document.location.hash){
		allSections.each(function(index, value){
			if($(value).is(document.location.hash)  && !found){
				allSections.currentSection = index;
				smoothScrollTo($(allSections[allSections.currentSection]), null);
				found = true;
			}
		});
	}
}

checkScrolled = function(){
	isScrolled = true;

	if(scrolledTimeout != null){
		clearTimeout(scrolledTimeout);
	}

	scrolledTimeout = setTimeout(function(){
			scrolledTimeout = null;
			isScrolled = false;
	}, scrolledRestoreTime);
}

smoothScrollTo = function(value, moveTo){
	var to = {};

	to = moveTo || value[0].offsetTop;

	$('html, body').stop().animate({
		scrollTop: to
    },{
    	duration : 600,
    	progress : function(animation, progressNumber, remainingMs){
    		var topDist = $(document).scrollTop();
				$('#blank').css('margin-top', (topDist/10)*9);
    	},
    	complete : function(){
    		checkInViewport();
    		if($(allSections[allSections.currentSection]).is('.attr-no-sticky')){
				enableScroll();
			} else {
				disableScroll();
			}
			document.location.hash = $(allSections[allSections.currentSection]).attr('id');

			if(allSections.currentSection == 0){
				heroText.stop().fadeIn(400);
			}
			if(isMenuOpened){
		    	toggleMenu();
		    }
    	}
    });
}

scrollToNextSection = function(){
	if(allSections.currentSection < allSections.length - 1){
		allSections.currentSection++;
		smoothScrollTo($(allSections[allSections.currentSection]), null);

		heroText.stop().fadeOut();
	}
}

scrollToPrevSection = function(){
	var cancel = false;
	if(allSections.currentSection > 0){
		allSections.currentSection--;

		noStickySections.each(function(){
			if(this == allSections[allSections.currentSection]){
				var current = $(allSections[allSections.currentSection])[0];
				smoothScrollTo(null, current.offsetTop + current.clientHeight - $(window).height());
				cancel = true;
			}
		});

		if(!cancel){
			smoothScrollTo($(allSections[allSections.currentSection]), null);
		}
	}
}

//may be needed for further developement
onOrientationChange = function(){}

//may be nedded for further developement
onWindowResize = function(){}
/*-------------------------------------------*/

/*--------------ANIMATIONS--------------*/
marginAnimation = function(element){

	element.object.stop().animate({
		marginLeft : element.by
	});
}

flickIn = function(element){
	if(element[0].randomizePosition){
		randomPosition(element, parentSize);
	}
	element.css({
		"opacity" : element[0].maxOpacity
	});
	element.delay(Math.random() * 4000).animate({
		height: element[0].maxHeight,
		width: element[0].maxWidth,
		top: "-=" + (element[0].maxHeight / 2),
		left: "-=" + (element[0].maxWidth /2)
	}, 400, "easeOutBack", function(){
		if(element[0].doAtEnd != null){
			element[0].doAtEnd.animation(element[0].doAtEnd.object);
		}
	}).delay(Math.random() * 1000 + 300);
}

flickOut = function(element){
	element.animate({
		opacity : 0
	}, 500, "swing", function(){
		if(containClass(element[0], faceClassname) && containClass($(allSections[allSections.currentSection])[0], 'us-map-section')){
			originalNumber += Math.round(Math.random() * 3);
			if(originalNumber >= 1000){
				originalNumber = Math.round(Math.random() * 999);
			}
			postsNumber[0].textContent = originalNumber;
		}
		element.animate({
			top: "+=" + (element[0].maxHeight / 2),
			left: "+=" + (element[0].maxWidth /2)
		}, 100);
		element.css({
			"height" : 0,
			"width" : 0
		});
		flickIn(element);
	});
}

fadeInAnimation = function(element){
	element.delay(Math.random() * 2000).animate({
		opacity: "1"
	}, ((element[0].fadeInDelay) ? (element[0].fadeInDelay) : 400), function(){
		if(element.doAtEnd){
			element.doAtEnd.animation(element.doAtEnd.object);
		} else if(element[0].doAtEnd != null){
			element[0].doAtEnd.animation(element[0].doAtEnd.object);
		}
	});
}

fadeOutAnimation = function(element){
	element.animate({
		opacity : 0
	}, ((element[0].fadeOutDelay) ? (element[0].fadeOutDelay) : 400), "swing", function(){
		fadeInAnimation(element);
	});
}

startChartSlideshow = function(element, data){
	var chartdata = (data != null) ? data : byMonthData;
	chartBarsCollection.isActive = true;
	chartBarsCollection.currentAnimationIndex = 0;

	increaseBar(chartBarsCollection,
		chartdata[chartBarsCollection.currentAnimationIndex].height, chartdata);
}

simpleHandsAnimation = function(){
	increaseBar(simpleHandsCollection,
		simpleHandsCollection[simpleHandsCollection.currentAnimationIndex].maxHeight, null);
}

mobileGroupAnimation = function(){
	riseBar(mobileHandsCollection, mobileHandsCollection[0].maxHeight);
}

flagGroupAnimation = function(){
	riseBar(flagHandsCollection, flagHandsCollection[0].maxHeight);
}

riseBar = function(array, by){
	var currentElement = $(array[array.currentAnimationIndex]);
	currentElement.animate({
		bottom : by + '%'
	}, 200, "easeOutQuint", function(){
		array.currentAnimationIndex++;

		if(array.currentAnimationIndex < array.length){
			riseBar(array, array[array.currentAnimationIndex].maxHeight);
		} else {
			if(array.doAtEnd != null){
				array.doAtEnd.animation(array.doAtEnd.object);
			}
		}
	});
}

increaseBar = function(array, by, data){
	var isTextStared = false;
	var currentElement = $(array[array.currentAnimationIndex]);

	if(currentElement[0].chartImage != null){
		if(data[array.currentAnimationIndex]){
			//change image
			$(currentElement[0].chartImage).css({'opacity' : '1'});
			$(currentElement[0].chartImage).attr('src', data[array.currentAnimationIndex].imgName);
			//change party
			if(data[array.currentAnimationIndex].party == repClassname){
				if(containClass(currentElement[0].chartPiece[0], demClassname)){
					$(currentElement[0].chartPiece).switchClass(demClassname, repClassname);
				}
			} else if(data[chartBarsCollection.currentAnimationIndex].party == demClassname){
				if(containClass(currentElement[0].chartPiece[0], repClassname)){
					$(currentElement[0].chartPiece).switchClass(repClassname, demClassname);
				}
			}
			//change percentage
			$(currentElement[0].chartPercentage)[0].textContent = data[array.currentAnimationIndex].percentage;
			//chart name
			$(currentElement[0].chartName)[0].textContent = data[array.currentAnimationIndex].name;
			//change width
			$(currentElement).css({"width" : data[array.currentAnimationIndex].width + "%"});
			if (data[array.currentAnimationIndex].width == null){
				$(currentElement).css({"width" : "6.67%"});
			}

		} else {
			//change image
			$(currentElement[0].chartImage).css({'opacity' : '0'});
			//chart name
			$(currentElement[0].chartName)[0].textContent = '';
			$(currentElement).css({"width" : "6.67%"});
		}
	}

	$(currentElement[0].chartBar).animate({
		height: by + "%"
	}, {
		easing : "easeOutQuint",
		progress : function(animation, progressNumber, remainingMs){
			if(progressNumber > array.transitToNext && !isTextStared){
				isTextStared = true;
				array.currentAnimationIndex++;

				if(currentElement[0].chartText != null){
					$(currentElement[0].chartText).animate({ opacity: 1 }, 300, function(){
						$(currentElement[0].chartPercentage).animate({ opacity: 1 }, 300);
					});
				}

				if(array.currentAnimationIndex < array.length){
					if(data != null){
						if(data[array.currentAnimationIndex]){
							increaseBar(array, data[array.currentAnimationIndex].height, data);
						} else {
							increaseBar(array, 0, data);
						}
					} else {
						if(array[array.currentAnimationIndex].maxHeight != null){
							increaseBar(array, array[array.currentAnimationIndex].maxHeight, data);
						}
					}

				} else {
					array.isActive = false;
					if(array.doAtEnd != null){
						array.doAtEnd.animation(array.doAtEnd.object);
					}
				}
			}
		}
	});
}

toggleNavigation = function(array){
	array.isTurnedOn = !array.isTurnedOn;

	if(array.isTurnedOn){
		array.isActive = true;
		array.currentAnimationIndex = 0;
		primaryNav.addClass('is-visible');
		primaryNav.stop().animate({ opacity : 1 });
		showNavigation(array);
	} else {
		primaryNav.stop().animate({ opacity : 0}, function(){
			primaryNav.removeClass('is-visible');
		});
		setOpacity(array, 0);
	}
}

showNavigation = function(array){
	var currentElement = $(array[array.currentAnimationIndex]);
	var isNextStarted = false;

	currentElement.stop().animate({
		opacity : 1
	}, {
		duration : 100,
		easing : "swing",
		progress : function(animation, progressNumber, remainingMs){
			if(progressNumber > .5 && !isNextStarted){
				isNextStarted = true;
				array.currentAnimationIndex++;

				if(array.currentAnimationIndex < array.length){
					if(array.isTurnedOn){
						showNavigation(array);
					}
				} else {
					array.isActive = false;
				}
			}
		},
		complete : function(){
			if(!array.isTurnedOn){
				setOpacity(array, 0);
				array.isActive = false;
			}
		}
	});
}

setOpacity = function(element, to){
	element.each(function(){
		if(to == 0){
			$(this).stop().animate({
				"opacity" : to
			}, 400);
		}
	});
}
/*--------------------------------------*/

/*--------------UTILITIES--------------*/
initializeDots = function(parentElement){	//specify an jQuery parent element as input
	for(var o = 0; o < dotsAmount; o++){
	var dotSize = Math.random() * ((parentSize.width * maxDotSize) + (minDotSize * parentSize.width));

		var element = "<span class='"
		+ randomString([redDotClassname, blueDotClassname])
		+ " " + startInViewportClassname
		+ " " + flickClassname + "'"
		+ "></span>";
		parentElement.append(element);
	}
}

elementInViewport = function(element){	//check if element is in viewport
    var $element = $(element), $window = $(window);
    return ($element.offset().top + $element.height() <= $window.scrollTop() + $window.height());
}

containClass = function(element, className){ return element.className.indexOf(className) >= 0; }

randomString = function(params){ return params[Math.floor(Math.random() * params.length)]; }

elementSize = function(element){
	var size = {};
	if(element[0] != null)
		size = {height : element[0].clientHeight, width : element[0].clientWidth};
	else
		size = {height : 0, width : 0};
	return size;
}

randomPosition = function(element, range){
	element.css({
		"left" : Math.random() * range.width,
		"top" : Math.random() * range.height
	});
}

shuffle = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

preventDefault = function(e) {
	e = e || window.event;
	if (e.preventDefault){
   		//catch mouse event, and don't let it go <3
   		if(!isScrolled && !isScrollEnabled){
   			checkScrolled();
   			if(isMenuOpened){
   				toggleMenu();
   			}
   			if(e.type == "keydown"){//key was pressed
   				if(scrollDownKeys[e.keyCode]){
   					//scroll down
   					scrollToNextSection();
   				} else {
   					//scroll up
   					scrollToPrevSection();
   				}
   			} else {
   				if(e.deltaY > 0){
   					//scroll down
   					scrollToNextSection();
   				} else {
   					//scroll up
   					scrollToPrevSection();
   				}
   			}
   		}
		e.preventDefault();
	}
	e.returnValue = false;
}

preventDefaultForScrollKeys = function(e) {
    if (keys[e.keyCode]) {
    	//catch key scrolling events, and don't let it go <3
        preventDefault(e);
        return false;
    }
}

disableScroll = function() {
	isScrollEnabled = false;
  	if (window.addEventListener) // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
}

enableScroll = function() {
	isScrollEnabled = true;
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

/*--------------FAKE DATA--------------*/
//those are fake data, just to check buttons
var byYearData = 	[{party : "dem", name : "Hillary Clinton", percentage : "$1.67MM", height : 80, imgName : "assets/img/faces/Hillary_Clinton_dem.png"},
						 {party : "dem", name : "Bernie Sanders", percentage : "$1.26MM", height : 70, imgName : "assets/img/faces/Bernie_Sanders_dem.png"},
						 {party : "rep", name : "Paul Rand", percentage : "$250K", height : 23, imgName : "assets/img/faces/Paul_Rand_rep.png"},
						 {party : "rep", name : "Carly Fiorina", percentage : "$115K", height : 14, imgName : "assets/img/faces/Carly_Fiorina_rep.png"},
						 {party : "rep", name : "Mike Huckabee", percentage : "$80K", height : 13, imgName : "assets/img/faces/Mike_Huckabee_rep.png"},
						 {party : "dem", name : "Martin Omalley", percentage : "$65K", height : 12, imgName : "assets/img/faces/Martin_OMalley_dem.png"},
						 {party : "rep", name : "Richard Santorum", percentage : "$8K", height : 10, imgName : "assets/img/faces/Richard_Santorum_rep.png"},
						 {party : "rep", name : "Jeb Bush", percentage : "", height : 3, imgName : "assets/img/faces/Jeb_Bush_rep.png"},
						 {party : "rep", name : "Marco Rubio", percentage : "", height : 3, imgName : "assets/img/faces/Marco_Rubio_rep.png"},
						 {party : "rep", name : "Donald Trump", percentage : "", height : 3, imgName : "assets/img/faces/Donald_Trump_rep.png"},
						 {party : "rep", name : "Ben Carson", percentage : "", height : 3, imgName : "assets/img/faces/Ben_Carson_rep.png"},
						 {party : "rep", name : "Ted Cruz", percentage : "", height : 3, imgName : "assets/img/faces/Ted_Cruz_rep.png"}];

var byMonthData = 	[{party : "dem", name : "Hillary Clinton", percentage : "$690.4K", height : 80, imgName : "assets/img/faces/Hillary_Clinton_dem.png"},
						 {party : "dem", name : "Bernie Sanders", percentage : "$515K", height : 69, imgName : "assets/img/faces/Bernie_Sanders_dem.png"},
						 {party : "rep", name : "Carly Fiorina", percentage : "$95.3K", height : 25, imgName : "assets/img/faces/Carly_Fiorina_rep.png"},
						 {party : "dem", name : "Martin O`malley", percentage : "$50K", height : 17, imgName : "assets/img/faces/Martin_OMalley_dem.png"},
						 {party : "rep", name : "Mike Huckabee", percentage : "$48K", height : 16, imgName : "assets/img/faces/Mike_Huckabee_rep.png"},
						 {party : "rep", name : "Paul Rand", percentage : "$5.6K", height : 10, imgName : "assets/img/faces/Paul_Rand_rep.png"},
						 {party : "rep", name : "Richard Santorum", percentage : "$4K", height : 9, imgName : "assets/img/faces/Richard_Santorum_rep.png"},
						 {party : "rep", name : "Donald Trump", percentage : "", height : 3, imgName : "assets/img/faces/Donald_Trump_rep.png"},
						 {party : "rep", name : "Jeb Bush", percentage : "", height : 3, imgName : "assets/img/faces/Jeb_Bush_rep.png"},
						 {party : "rep", name : "Marco Rubio", percentage : "", height : 3, imgName : "assets/img/faces/Marco_Rubio_rep.png"},
						 {party : "rep", name : "Ben Carson", percentage : "", height : 3, imgName : "assets/img/faces/Ben_Carson_rep.png"},
						 {party : "rep", name : "Ted Cruz", percentage : "", height : 3, imgName : "assets/img/faces/Ted_Cruz_rep.png"}
						];

var twentytwelveDAta = 	[{party : "dem", name : "Obama", percentage : "$74.43MM", height : 77, width : 34.5, imgName : "assets/img/faces/Obama_dem.png"},
					 {party : "rep", name : "Mitt Romney", percentage : "$16.08MM", height : 23, width : 34.5, imgName : "assets/img/faces/Mitt_Romney_rep.png"}];

var simpleHandsHeights=	[{height : 95},
						 {height : 85},
						 {height : 65},
						 {height : 70},
						 {height : 75},
						 {height : 65},
						 {height : 78},
						 {height : 80},
						 {height : 67.5},
						 {height : 102.5}];
/*-------------------------------------*/
/*-------------------------------------*/


(function() {
	var candidateFaces = [
		{file: "Ben_Carson_rep.png", party: "rep"},
		{file: "Carly_Fiorina_rep.png", party: "rep"},
		{file: "Donald_Trump_rep.png", party: "rep"},
		{file: "Jeb_Bush_rep.png", party: "rep"},
		{file: "Marco_Rubio_rep.png", party: "rep"},
		{file: "Mike_Huckabee_rep.png", party: "rep"},
		{file: "Mitt_Romney_rep.png", party: "rep"},
		{file: "Paul_Rand_rep.png", party: "rep"},
		{file: "Richard_Santorum_rep.png", party: "rep"},
		{file: "Scott_Walker_rep.png", party: "rep"},
		{file: "Ted_Cruz_rep.png", party: "rep"},
		{file: "rick-perry-rep.png", party: "rep"},
		{file: "Bernie_Sanders_dem.png", party: "dem"},
		{file: "Hillary_Clinton_dem.png", party: "dem"},
		{file: "Jim_Webb_dem.png", party: "dem"},
		{file: "Martin_OMalley_dem.png", party: "dem"},
		{file: "Obama_dem.png", party: "dem"}
	];

	function random (min, max) {
		return min + ~~(Math.random() * 99999) % (max - min + 1)
	}

	// automatically generated, don't modify
	var border = [[[32,34]],[[31,36],[36,40]],[[30,41]],[[23,43]],[[21,44],[44,47]],[[20,43],[43,44],[44,45],[45,48],[49,51]],[[19,52]],[[17,54]],[[15,55],[55,55]],[[13,59],[60,61]],[[2,4],[9,59],[61,61]],[[2,8],[8,10],[11,59]],[[2,59],[61,61],[64,64]],[[3,59],[61,61]],[[3,60]],[[4,61]],[[4,61]],[[1,2],[2,2],[2,3],[4,62],[64,64],[64,64],[66,67]],[[2,2],[2,2],[3,3],[3,4],[4,5],[5,6],[6,6],[6,63],[64,65]],[[1,2],[2,2],[2,4],[4,5],[5,63]],[[1,64]],[[1,65]],[[1,66]],[[1,68]],[[1,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[3,69]],[[3,69]],[[3,69]],[[3,69],[70,70]],[[3,70]],[[3,71]],[[3,71]],[[3,71]],[[4,72]],[[4,72]],[[4,73]],[[4,73]],[[4,73]],[[4,74]],[[4,74]],[[4,74]],[[4,75]],[[5,75]],[[5,75]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,77]],[[5,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,75]],[[6,75]],[[6,76]],[[6,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,77]],[[7,78]],[[7,79]],[[7,79]],[[7,80]],[[7,80]],[[7,81]],[[7,84]],[[7,85]],[[7,85]],[[7,86]],[[7,86]],[[7,87]],[[8,87]],[[8,88]],[[8,87]],[[8,86],[86,87]],[[8,85]],[[8,84]],[[8,84]],[[8,84]],[[8,84]],[[8,85]],[[8,85]],[[8,85]],[[8,86]],[[8,86]],[[8,87]],[[8,89]],[[8,90]],[[8,91]],[[8,92]],[[8,93]],[[8,93]],[[8,96]],[[8,97],[97,97]],[[8,98]],[[8,98]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,94],[94,95],[96,100]],[[8,92],[93,93],[93,94],[97,97],[98,98],[98,100]],[[8,92],[92,92],[99,100]],[[8,91],[91,91]],[[8,90],[90,91]],[[7,89],[89,90],[90,90]],[[6,89],[89,90]],[[6,89],[89,89]],[[8,89]],[[8,88]],[[9,88]],[[9,88]],[[9,87]],[[9,85],[86,86]],[[9,85],[85,85]],[[9,85]],[[9,85]],[[10,10],[10,84]],[[9,84]],[[10,16],[16,84]],[[10,15],[16,84]],[[10,14],[16,84]],[[10,13],[15,84]],[[10,13],[15,84]],[[10,12],[15,15],[15,16],[16,84]],[[10,12],[15,15],[16,84]],[[10,11],[16,84]],[[10,11],[16,84],[84,84]],[[10,10],[15,83],[84,84]],[[15,83],[84,84]],[[10,11],[14,84]],[[10,10],[14,84]],[[9,10],[13,85]],[[12,85]],[[12,13],[13,13],[14,86]],[[12,12],[12,12],[14,85]],[[14,85]],[[15,22],[23,86]],[[15,22],[22,84],[85,85]],[[15,19],[21,22],[22,24],[24,25],[30,81],[82,82],[82,82],[82,85]],[[15,18],[20,21],[33,81],[81,83],[83,83],[84,85]],[[15,18],[19,20],[34,80],[82,82],[82,83],[84,85]],[[15,18],[35,80],[80,81],[84,85]],[[14,17],[34,80],[80,81],[83,83],[84,85]],[[14,17],[21,21],[22,22],[23,23],[23,27],[34,80],[80,80]],[[14,17],[21,28],[32,80],[80,81]],[[14,16],[18,18],[20,80],[80,80]],[[13,16],[19,20],[21,21],[21,78],[80,80]],[[14,17],[18,19],[19,80],[80,80]],[[14,17],[17,80]],[[14,16],[17,17],[17,80]],[[14,15],[15,16],[17,80]],[[16,16],[18,79]],[[15,16],[18,79]],[[16,16],[18,79]],[[18,24],[25,79]],[[20,23],[25,79]],[[23,79]],[[23,79]],[[23,32],[32,80]],[[24,30],[33,80]],[[26,29],[33,80],[81,81]],[[32,33],[33,81]],[[33,81],[81,81]],[[33,80],[81,81]],[[32,80]],[[32,79],[79,80]],[[32,79]],[[31,79]],[[31,79]],[[30,80]],[[30,80]],[[29,81]],[[29,81]],[[28,82]],[[27,82]],[[24,25],[26,87]],[[23,86],[86,87],[88,88]],[[23,89]],[[23,90]],[[23,72],[72,72],[75,91]],[[23,69],[69,70],[77,92]],[[23,68],[78,92]],[[23,67],[79,93],[99,99]],[[22,66],[80,94]],[[22,66],[81,93],[99,99]],[[18,19],[20,20],[21,65],[65,65],[82,94],[98,98]],[[17,64],[83,83],[84,95],[98,98]],[[16,62],[85,96]],[[15,61],[86,96],[97,98]],[[14,60],[87,96],[97,97]],[[14,42],[42,60],[88,95],[96,96]],[[14,38],[38,42],[42,60],[92,93],[94,95]],[[14,37],[37,38],[39,39],[40,40],[41,42],[42,44],[44,58]],[[14,40],[40,41],[42,42],[43,44],[44,46],[46,57]],[[13,41],[42,42],[43,43],[44,44],[44,44],[44,45],[45,46],[46,46],[47,57]],[[13,36],[37,42],[43,43],[46,51],[51,56]],[[13,37],[38,43],[43,46],[46,50],[50,53],[53,56]],[[13,37],[38,44],[47,48],[48,50],[50,53],[54,56]],[[12,38],[39,42],[48,49],[49,49],[50,53],[54,55]],[[12,31],[31,36],[49,50],[50,50],[50,52],[53,54]],[[12,30],[30,31],[31,35],[50,51],[53,53]],[[12,29],[29,30],[52,53]],[[12,28],[29,30]],[[10,27],[28,30]],[[10,27],[28,29]],[[6,6],[8,9],[9,27],[28,29]],[[2,26],[27,27],[27,28]],[[0,26],[27,28]],[[1,26]],[[1,19],[19,24],[24,25]],[[0,15],[15,16],[20,20],[22,25]],[[0,15],[22,24],[25,25]],[[0,15],[23,24],[24,25]],[[1,14],[22,22],[23,24],[24,25]],[[2,11],[12,12],[22,22],[23,23],[25,25]],[[4,12],[13,13],[14,14],[24,25]],[[6,12],[12,13]],[[6,11]],[[7,10]],[[7,10],[10,10]],[[8,9]]];
	var origImageSize = [2422, 1474]

	function randomCoords() {
		var x = 5 + ~~(random(0, origImageSize[0] - 5) / 10) * 10;
		var idx = (x - 5) / 10;
		var yBoundaries = border[idx];
		var boundary = yBoundaries[random(0, yBoundaries.length - 1)];
		var y = random(boundary[0], boundary[1]);
		return [x, ~~(y * origImageSize[1] / 100)];
	}

	function randomBool () {
		return random(0, 1) === 0;
	}

	function loadImg (src) {
		var def = new $.Deferred()

		var img = document.createElement("img");
		img.src = src;
		img.style.position = "absolute";
		img.style.left = "-9999px";
		img.onload = function() {
			def.resolve(img);
		}

		return def;
	}

	var frame = window.requestAnimationFrame ||
		          window.mozRequestAnimationFrame ||
		          window.webkitRequestAnimationFrame ||
		          window.msRequestAnimationFrame;

	var Point = function(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.radius = 0;
		this.done = false;
	};

	Point.radius = 18;
	Point.speed = 800;

	Point.prototype.tick = function(ts) {
		this.ts = this.ts || ts;

		if(!this.done) {
			var progress = (ts - this.ts) / Point.speed;
			var size;

			if(progress > .5) {
				size = 1 - (progress - .5) / .5

				if(size < 0.0) {
					this.done = true;
				}
			} else {
				size = progress / .5;
			}

			this.radius = size * Point.radius;
		}
	};

	Point.prototype.render = function(ctx) {
		if(this.done) return;

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	};


	(function() {
		var ctx = document.getElementById('map').getContext('2d');

		var points = [new Point(500, 500), new Point(505, 505)]

		function render(ts) {
			ctx.clearRect(0, 0, origImageSize[0], origImageSize[1]);

			for(var i in points) {
				var point = points[i];

				point.render(ctx);
				point.tick(ts);
			}

			frame(render);
		}

  	frame(render);

  	setInterval(function() {
  		var coords = randomCoords();

  		// garbage collection
			for(var i in points) {
				if(points[i].done) {
					points.splice(i, 1);
				}
  		}

  		for(var i = 0; i < random(0, 20); i++) {
  			points.push(new Point(coords[0], coords[1], randomBool() ? "#3d77d1" : "#f83a3a"))
  		}
  	}, 20)
	})();

	// var $candidates = $(".js-candidates");

	// function randomPoints(n, real) {
	// 	return Array.apply(null, Array(n))
	// 		.map(Number.prototype.valueOf,0)
	// 		.map(function() {
	// 			return randomCoords();
	// 		})
	// 		.map(function(pos) {
	// 			var candidate = document.createElement("span")

	// 			if(real) {
	// 				var info = candidateFaces[random(0, candidateFaces.length - 1)];
	// 				candidate.className = "candidate candidate_real";
	// 				candidate.className += info.party === "rep" ? " candidate_rep" : " candidate_dem";

	// 				candidate.innerHTML = '<img src="assets/img/faces/' + info.file + '" />'
	// 			} else {
	// 				candidate.className = "candidate candidate_anonymous";
	// 				candidate.className += randomBool() ? " candidate_rep" : " candidate_dem";
	// 			}


	// 			candidate.style.left = pos[0] + "%"
	// 			candidate.style.top = pos[1] + "%"
	// 			return candidate;
	// 		});
	// }

	// (function($root) {
	// 	var $initial = $(document.createDocumentFragment());
	// 	var $candidate;

	// 	var $points;

	// 	$initial
	// 		.append($points = randomPoints(250))
	// 		.append($candidates = randomPoints(50, true))
	// 		.appendTo($root);

	// 	$points = $points.map($)
	// 	$candidates = $candidates.map($)

	// 	$points.map(function ($point) {
	// 		setInterval(function () {
	// 			$point.toggleClass("candidate_shown", random(0, 20) === 0)
	// 		}, random(400, 1200))
	// 	})

	// 	$candidates.map(function ($point) {
	// 		setInterval(function () {
	// 			var show = random(0, 15) === 0;
	// 			$point.toggleClass("candidate_shown", show)
	// 			$point.toggleClass("candidate_hidden", !show)
	// 		}, random(600, 1800))
	// 	})
	// })($candidates);

})();