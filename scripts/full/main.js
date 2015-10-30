/*
class 'startInViewport' means that element start's animation only when it's appers in viewport
copyright ©2015 Roman Antonov
*/

/*--------------SPEC VARIABLES--------------*/
//class names
var startInViewportClassname	=	"startInViewport";
var demClassname				=	"dem";
var repClassname				=	"rep";
var simpleHandsNumbClassname	=	"numb";
var handsPercentageClassname	=	"percentage";
var mobileGroupClassname		=	"mobile-group";
var flagGroupClassname			=	"flag-group";

//elements
var startInViewport				=	{};
var chartBarsCollection 		=	{};
var simpleHandsCollection 		=	{};
var mobileHandsCollection		=	{};
var flagHandsCollection			=	{};
var primaryNavCollection		=	{};

var chart1 						=	{};
var chart2 						=	{};
var allSections 				=	{};
var noStickySections			=	{};
var postsNumber 				=	{};
var primaryNav 					=	{};
var originalNumber				=	{};
var heroText					=	{};
var controls 					=	{};

var scrolledRestoreTime			=	1050;					//restore time for "scrolled"
var isScrolled 					=	false;					//indicates if user scrolled in last screen in last scrolledRestoreTime mseconds
var isScrollEnabled				=	true;
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
			if(isMobile()){
				this.charts.steps = [
					{ step : 0}, 
					{ step : -(width - $(window).width()) / 8}, 
					{ step : -(width - $(window).width()) / 8 * 2}, 
					{ step : -(width - $(window).width()) / 8 * 3},
					{ step : -(width - $(window).width()) / 8 * 4},
					{ step : -(width - $(window).width()) / 8 * 5},
					{ step : -(width - $(window).width()) / 8 * 6},
					{ step : -(width - $(window).width()) / 8 * 7},
					{ step : -(width - $(window).width()) * 1.02}];
			} else {
				this.charts.steps = [
					{ step : 0}, 
					{ step : -(width - $(window).width()) / 3}, 
					{ step : -(width - $(window).width()) / 3 * 2}, 
					{ step : -(width - $(window).width()) * 0.83}];
			}
		} else {
			if(isMobile()){
				this.charts.steps = [
					{ step : 0}, 
					{ step : -(this.charts[0].clientWidth - $(window).width()) / 3}, 
					{ step : -(this.charts[0].clientWidth - $(window).width()) / 3 * 2}, 
					{ step : -(this.charts[0].clientWidth - $(window).width()) * 1.05}];
			} else {
				this.charts.steps = [
					{ step : 0}, 
					{ step : -(this.charts[0].clientWidth - $(window).width()) * 1.25}];
			}
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
	originalNumber = parseInt(postsNumber[0].textContent.replace(',', ''));

	heroText = $('.hero-section').find('h1, h4');

	updatePostsNumber();

	//disableScroll();
	if(!isMobile()){
		startScrollEvent();
		disableScroll();
	} else {
		$.getScript("https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js", function(data, textStatus, jqxhr){
			console.log("loaded");
			$('.chart-hidden-wrap').on('swipeleft', function(){
				scrollButtons(controls[0].rightScroll);
			});
			$('.chart-hidden-wrap').on('swiperight', function(){
				scrollButtons(controls[0].leftScroll);
			});

			/*$(document).on("scrollstart",function(){
				scrollEvent();
			});*/
		});
	}
	/*----------------------------------------*/
	//collect all elements that should start "when inside of viewport"
	startInViewport = $('.' + startInViewportClassname);

	//configure animates elements on screen
	startInViewport.each(function(index){
		this.isLaunched = false;
		if($(this).doAtEnd == null){
			this.doAtEnd = {
				animation : function(){},
				object : null
			};
		}

		//should animation play on mobile
		if(containClass($(this)[0], 'notForMobile') && isMobile()){
			this.animation = null;
			return;
		}

		//if element is chart box
		if(containClass($(this)[0], 'chart-bars')){
			if(isMobile()){
				startChartSlideshow(null, byMonthData);
			} else {
				this.animation = startChartSlideshow;
			}
		}

		//start hands animation when appears in view
		if(containClass($(this)[0], 'hand-group')){
			if(isMobile()){
				simpleHandsAnimation();
			} else {
				this.animation = simpleHandsAnimation;
			}
		}

		//animation for mobile hands
		if(containClass($(this)[0], mobileGroupClassname)){
			if(isMobile()){
				mobileGroupAnimation();
			} else {
				this.animation = mobileGroupAnimation;
			}
		}

		//animation form flag hands
		if(containClass($(this)[0], flagGroupClassname)){
			if(isMobile()) {
				flagGroupAnimation();
			} else {
				this.animation = flagGroupAnimation;
			}
		}
	});

	/*--------------INIT CHARTS---------------*/
	chart1 = new Highcharts.Chart({
        chart: { type: 'spline', renderTo: 'chartContainer1' },
		tooltip: { enabled: false },
		title: { text: '' },
        subtitle: { text: 'Sessions: 186', floating: true, y: 240 },
		yAxis: { title: '', min: 0,max: 40, labels: { formatter: function() { return this.value + "%"; } }, gridLineWidth: 0 },
		xAxis: { type: 'datetime', dateTimeLabelFormats : { minute: '%H:%M' }, showFirstLabel: false, gridLineWidth: .5 },
        plotOptions: {
        	spline: { lineWidth: 2, states: { hover: { lineWidth: 4 }  }, 
        	marker: { enabled: false }, pointInterval: 14 * 3600, pointStart: Date.UTC(2015, 4, 31, 0, 0, 0) }
        },
		legend: { enabled: false },
		series: [{data: [0,8,10,9,10,3,5,2,3,6,4,5,6,6,7,6,6,7,7,7,5,7,8,7,9,8,12,6,9,5,8,0] }, 
	        	{data: [0,30,25,27,20,22,23,20,24,20,24,17,14,13,20,20,25,18,15,23,19,21,20,21,19,25,29,29,25,26,24]}]});

	chart2 = new Highcharts.Chart({
        chart: { type: 'spline', renderTo: 'chartContainer2' },
		tooltip: { enabled: false },
		title: { text: '' },
        subtitle: { text: 'Sessions: 186', floating: true, y: 240 },
		yAxis: { title: '', min: 0,max:40, labels: { formatter: function() { return this.value + "%"; } }, gridLineWidth: 0 },
		xAxis: { type: 'datetime', dateTimeLabelFormats : { minute: '%H:%M' }, showFirstLabel: false, gridLineWidth: .5 },
        plotOptions: {
        	spline: { lineWidth: 2, states: { hover: { lineWidth: 4 }  }, 
        	marker: { enabled: false }, pointInterval: 14 * 3600, pointStart: Date.UTC(2015, 4, 31, 0, 0, 0) }
        },
		legend: { enabled: false },
		series: [{data: [0,4,5,7,4,3,5,6,7,7,8,8,7,8,9,6,7,8,7,8,3,4,3,5,3,6,7,9,6,4,6] }, 
	        	{data: [5,9,10,12,9,8,10,11,12,12,12,13,12,13,14,11,12,13,12,13,8,9,8,10,8,11,12,14,11,9,11]}]});
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

$(window).scroll(function(){
	if(isScrollEnabled){
		scrollEvent();
	}
});

// ==> smooth scrolling
$('.nav-links').click(function(){
	(isScrollEnabled && !isMobile())?(disableScroll()):{};
	allSections.currentSection = primaryNavCollection.index($(this));
	smoothScrollTo($(allSections[allSections.currentSection]), null);
});

$('.scroll-down-button').click(function(){
	if(isMobile){
		allSections.currentSection = $('.scroll-down-button').index($(this)) + 1;
	} else {
		allSections.currentSection++;
	}
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
	if(startInViewport.length){	
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
}

toggleMenu = function(){
	isMenuOpened = !isMenuOpened;
	$('.lines-button').toggleClass('close');
	toggleNavigation(primaryNavCollection);
}

scrolled = function(){
	checkInViewport();
	if(!isMobile()){
		if(noStickySections.length){
			noStickySections.each(function(){
				if(this == allSections[allSections.currentSection]){
					if($(window).scrollTop() < ($(this)[0].offsetTop - 200)){
						if(isScrollEnabled){
							disableScroll();
							scrollToPrevSection();
						}
					} else if($(window).scrollTop() > $(this)[0].offsetTop + $(this)[0].clientHeight - $(window).height() + 200){
						if(isScrollEnabled){
							disableScroll();
							scrollToNextSection();
						}
					}
				}
			});
		}
	}
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
    		if(!isMobile()){ $('#blank').css('margin-top', ($(document).scrollTop() / 10) * 9); } 
    	},
    	complete : function(){
    		checkInViewport();
    		if(!isMobile()){
    			if($(allSections[allSections.currentSection]).is('.attr-no-sticky')){
					enableScroll();
				} else {
					disableScroll();
				}
				document.location.hash = $(allSections[allSections.currentSection]).attr('id');
    		}

			if(allSections.currentSection == 0 && !isMobile()){
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

		if(!isMobile()){
			heroText.stop().fadeOut();
		}
	}
}

updatePostsNumber = function(){
	setTimeout(updatePostsNumber, 1000);

	originalNumber += Math.round(Math.random() * 10);
	if(originalNumber > 15000){
		originalNumber = 11232;
	}
	postsNumber[0].textContent = [originalNumber.toString().slice(0, 2), ',', originalNumber.toString().slice(2, 6)].join('');
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
/*-------------------------------------------*/

/*--------------ANIMATIONS--------------*/
marginAnimation = function(element){

	element.object.stop().animate({
		marginLeft : element.by
	});
}

fadeInAnimation = function(element){
	element.delay((isMobile())?(100):(Math.random() * 2000)).animate({
		opacity: "1"
	}, ((element[0].fadeInDelay) ? (element[0].fadeInDelay) : 200), function(){
		if(element.doAtEnd){
			element.doAtEnd.animation(element.doAtEnd.object);
		} else if(element[0].doAtEnd != null){
			element[0].doAtEnd.animation(element[0].doAtEnd.object);
		}
	});
}

startChartSlideshow = function(element, data){
	var chartdata = (data != null) ? data : byMonthData;
	chartBarsCollection.isActive = true;
	chartBarsCollection.currentAnimationIndex = 0;

	setWidth(chartBarsCollection, chartdata);

	increaseBar(chartBarsCollection, 
		chartdata[chartBarsCollection.currentAnimationIndex].height, chartdata);
}

setWidth = function(array, data){
	array.each(function(index, value){
		if(data[index] != null){
			if(data[index].width != null){
				$(this).css({"width" : data[index].width + "%"});
			} else {
				$(this).css({"width" : "8.33%"});
			}
		} else {
			$(this).css({"width" : "8.33%"});
		}
	});
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
		} else {
			//change image
			$(currentElement[0].chartImage).css({'opacity' : '0'});
			//chart name
			$(currentElement[0].chartName)[0].textContent = '';
		}
	} 

	$(currentElement[0].chartBar).animate({
		height: by + "%"
	}, {
		duration : ((isMobile())?(200):(400)),
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
elementInViewport = function(element){	//check if element is in viewport
    var $element = $(element), $window = $(window);
     
    return ($element.offset().top + $element.height() <= $window.scrollTop() + $window.height());
}

containClass = function(element, className){ return element.className.indexOf(className) >= 0; }

elementSize = function(element){
	var size = {};
	if(element[0] != null)
		size = {height : element[0].clientHeight, width : element[0].clientWidth};
	else
		size = {height : 0, width : 0};
	return size;
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
	if(isScrollEnabled){
		if(isMobile()){
			/*$("body").touchwipe({
			     wipeLeft: function() {},
			     wipeRight: function() {},
			     wipeUp: function() { 
			     	scrollToPrevSection();
			     },
			     wipeDown: function() { 
			     	scrollToNextSection();
			     },
			     min_move_x: 20,
			     min_move_y: 20,
			     preventDefaultEvents: true
			});*/
		} else {
			if (window.addEventListener) // older FF
				window.addEventListener('DOMMouseScroll', preventDefault, false);
			window.onwheel = preventDefault; // modern standard
			window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
			window.ontouchmove  = preventDefault; // mobile
			document.onkeydown  = preventDefaultForScrollKeys;
		}
		isScrollEnabled = false;
		console.log("turned off " + isScrollEnabled);
	}
}

enableScroll = function() {
	if(!isScrollEnabled){
		if(isMobile()){
		    /*$("body").touchwipe({
			     wipeLeft: function() {},
			     wipeRight: function() {},
			     wipeUp: function() {},
			     wipeDown: function() {},
			     min_move_x: 20,
			     min_move_y: 20,
			     preventDefaultEvents: false
			});*/
		} else {
		    if (window.removeEventListener)
	       		window.removeEventListener('DOMMouseScroll', preventDefault, false);
		    window.onmousewheel = document.onmousewheel = null; 
		    window.onwheel = null; 
		    window.ontouchmove = null;  
		    document.onkeydown = null;
		}
		isScrollEnabled = true;
		console.log("turned on " + isScrollEnabled);
	}
}

isMobile = function() {
	return $(window).width() <= 768;
}
/*--------------FAKE DATA--------------*/
//those are fake data, just to check buttons
var _width = (isMobile())?(15.5) : (34.5);
var _height = (isMobile()?(.85):(1));
var byYearData = 	[{party : "dem", name : "Hillary Clinton", percentage : "$1.67MM", height : 80 * _height, imgName : "assets/img/faces/Hillary_Clinton_dem.png"},
						 {party : "dem", name : "Bernie Sanders", percentage : "$1.26MM", height : 70 * _height, imgName : "assets/img/faces/Bernie_Sanders_dem.png"},
						 {party : "rep", name : "Paul Rand", percentage : "$250K", height : 23 * _height, imgName : "assets/img/faces/Paul_Rand_rep.png"}, 
						 {party : "rep", name : "Carly Fiorina", percentage : "$115K", height : 14 * _height, imgName : "assets/img/faces/Carly_Fiorina_rep.png"},
						 {party : "rep", name : "Mike Huckabee", percentage : "$80K", height : 13 * _height, imgName : "assets/img/faces/Mike_Huckabee_rep.png"},
						 {party : "dem", name : "Martin Omalley", percentage : "$65K", height : 12, imgName : "assets/img/faces/Martin_OMalley_dem.png"}, 
						 {party : "rep", name : "Richard Santorum", percentage : "$8K", height : 10, imgName : "assets/img/faces/Richard_Santorum_rep.png"}, 
						 {party : "rep", name : "Jeb Bush", percentage : "", height : 3, imgName : "assets/img/faces/Jeb_Bush_rep.png"},
						 {party : "rep", name : "Marco Rubio", percentage : "", height : 3, imgName : "assets/img/faces/Marco_Rubio_rep.png"},
						 {party : "rep", name : "Donald Trump", percentage : "", height : 3, imgName : "assets/img/faces/Donald_Trump_rep.png"}, 
						 {party : "rep", name : "Ben Carson", percentage : "", height : 3, imgName : "assets/img/faces/Ben_Carson_rep.png"},
						 {party : "rep", name : "Ted Cruz", percentage : "", height : 3, imgName : "assets/img/faces/Ted_Cruz_rep.png"}];
						
var byMonthData = 	[{party : "dem", name : "Hillary Clinton", percentage : "$690.4K", height : 80 * _height, imgName : "assets/img/faces/Hillary_Clinton_dem.png"},
						 {party : "dem", name : "Bernie Sanders", percentage : "$515K", height : 69 * _height, imgName : "assets/img/faces/Bernie_Sanders_dem.png"},
						 {party : "rep", name : "Carly Fiorina", percentage : "$95.3K", height : 25 * _height, imgName : "assets/img/faces/Carly_Fiorina_rep.png"},
						 {party : "dem", name : "Martin O`malley", percentage : "$50K", height : 17 * _height, imgName : "assets/img/faces/Martin_OMalley_dem.png"},
						 {party : "rep", name : "Mike Huckabee", percentage : "$48K", height : 16 * _height, imgName : "assets/img/faces/Mike_Huckabee_rep.png"},
						 {party : "rep", name : "Paul Rand", percentage : "$5.6K", height : 10, imgName : "assets/img/faces/Paul_Rand_rep.png"}, 
						 {party : "rep", name : "Richard Santorum", percentage : "$4K", height : 9, imgName : "assets/img/faces/Richard_Santorum_rep.png"},
						 {party : "rep", name : "Donald Trump", percentage : "", height : 3, imgName : "assets/img/faces/Donald_Trump_rep.png"}, 
						 {party : "rep", name : "Jeb Bush", percentage : "", height : 3, imgName : "assets/img/faces/Jeb_Bush_rep.png"},
						 {party : "rep", name : "Marco Rubio", percentage : "", height : 3, imgName : "assets/img/faces/Marco_Rubio_rep.png"},
						 {party : "rep", name : "Ben Carson", percentage : "", height : 3, imgName : "assets/img/faces/Ben_Carson_rep.png"},
						 {party : "rep", name : "Ted Cruz", percentage : "", height : 3, imgName : "assets/img/faces/Ted_Cruz_rep.png"}
						];
var twentytwelveDAta = 	[{party : "dem", name : "Obama", percentage : "$74.43MM", height : 77, width : _width, 
						imgName : "assets/img/faces/Obama_dem.png"}, 
					 {party : "rep", name : "Mitt Romney", percentage : "$16.08MM", height : 23, width : _width, 
						imgName : "assets/img/faces/Mitt_Romney_rep.png"}];

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