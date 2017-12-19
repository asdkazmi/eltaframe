$(document).ready(function () {
	
	// Create Data Tabel and Write Table Data
	// Data table will be created in JSON file
	// To write Data from JSON file in HTML we will use format "writeData('')" which must be in HTML element of class "write_data"
	// writeData() will create clone of element where we have initiated class="write_data" and then find writeData() and return required value from JSON.
	// Suppose we have JSON file named
	// JSON FILE
	// var main_data = {
	// 	navbar_url : {
	// 		Home: "index.html",
	// 		Download: "download.html"
	// 	}
	// }
	// Now to writeData from JSON file in HTML we will work as follow
	// HTML CODE
	// <li class="write_data anyotherclass">
	// 	<a href=writeData("main_data['navbar_url']","value(x)")class=writeData("main_data['navbar_url']","key(x)")>
	// 		<span>
	// 			writeData("main_data['navbar_url']","key(0-1)")
	// 		</span>
	// 		<span>Anyvalue</span>
	// 	</a>
	// </li>
	// RETURN IN BROWSER
	// <li class="write_data anyotherclass">
	// 	<a href="index.html" class="Home">
	// 		<span>
	// 			Home
	// 		</span>
	// 		<span>Anyvalue</span>
	// 	</a>
	// </li>
	// <li class="write_data anyotherclass">
	// 	<a href="download.html" class="Download">
	// 		<span>
	// 			Download
	// 		</span>
	// 		<span>Anyvalue</span>
	// 	</a>
	// </li>
	// EXPLANATION OF writeData()
	// writeData('JSON Object','Option') has two arguments/paramenters  where first argument is to defind 'JSON Object' i.e. which data is required from JSON object. While 2nd parameter is option i.e. how much and which value from JSON object, we request. There are three type of options i.e. "key('Which'),value('Which'),pair('Which')". key()/value()/pair() return JSON object keys/values/key-value-pair which requested. Now these options have again a parameter i.e. how much and which values/keys/pairs are required. x is for returning all keys/values/pairs while for only different values we can write as n-m,p,q,... where n,m,p,q are positive integers and '-' is for 'to' and ',' is for 'and'. example is writeData("main_data['navbar_url']","key(0-1,3)") which return only 0-1 and 3 keys.

	function writeData(elem, opt) {
		var objct = eval(elem)
		var result = [];
		if (opt != undefined) {
			if (opt == "key(x)") {
				for (x in objct) {
					result.push(x);
				}
			} else if (opt == "value(x)") {
				for (x in objct) {
					result.push(objct[x]);
				}
			} else if (opt == "pair(x)") {
				for (x in objct) {
					result.push(x);
					result.push(objct[x]);
				}
			} else if (opt.match(/(key|value|pair)\([0-9,-]+\)/)) {
				var splCom = /(key|value|pair)\(([0-9,-]+)\)/.exec(opt)[2].split(',');
				var whchOpt = /(key|value|pair)\(([0-9,-]+)\)/.exec(opt)[1];
				var dataArray = Object.entries(eval(elem));
				for (x in splCom) {
					if (splCom[x].match(/\d\-\d/)) {
						var splLine = splCom[x].split('-');
						for (var i = parseInt(splLine[0]); i < (parseInt(splLine[1]) + 1); i++) {
							if (whchOpt == "key") {
								result.push(dataArray[i][0]);
							} else if (whchOpt == "value") {
								result.push(dataArray[i][1]);
							} else if (whchOpt == "pair") {
								result.push(dataArray[i][0], dataArray[i][1]);
							}
						}
					} else {
						if (whchOpt == "key") {
							result.push(dataArray[splCom[x]][0]);
						} else if (whchOpt == "value") {
							result.push(dataArray[splCom[x]][1]);
						} else if (whchOpt == "pair") {
							result.push(dataArray[splCom[x]][0], dataArray[splCom[x]][1]);
						}
					}
				}
			}
		} else {
			result.push(eval(elem));
		}
		return result;
	}
	$('.write_data').each(function(i, elA) {
		var allFunc = [];
		if ($(this).html().trim().match(/^writeData\(.*\)$/)) {
			allFunc.push($(elA).html().trim());
		}
		var elemClone = $(elA).prop('outerHTML').replace(/&quot;/g,'"');
		var ptrnForFunc = /(writeData\(['"].+['"][,]*['"]*.*['"]*\))/g;
		var match = '';
		while ((match = ptrnForFunc.exec(elemClone)) != null) {
			if (/\"\)(.*)writeData*/.exec(match[0]) != null) {
				var splitFuncs = match[0].split(/\"\)(.*)writeData*/.exec(match[0])[1]);
			} else {
				var splitFuncs = [match[0]];
			}
			for (x in splitFuncs) {
				allFunc.push([splitFuncs[x], eval(splitFuncs[x])]);
			}
		}
		var maxClone = 0;
		for (x in allFunc) {
			if (allFunc[x][1].length > maxClone) {
				maxClone = allFunc[x][1].length;
			}
		}
		for ( x in allFunc) {
			if (allFunc[x][1].length < maxClone) {
				for (var i = allFunc[x][1].length; i < maxClone; i++) {
					allFunc[x][1].push(allFunc[x][1][allFunc[x][1].length - 1])
				}
			}
		}
		var storeUndValue = '';
		for (var j = 0; j < maxClone; j++) {
			var elemCloneB = $(elA).prop('outerHTML').replace(/&quot;/g,'"');
			for (x in allFunc) {
				var resultElem = elemCloneB.replace(allFunc[x][0], allFunc[x][1][j]);
				elemCloneB = resultElem;
			}
			$(elA).before(resultElem);
		}
		$(elA).remove();
	});
	// CREATE CLASS
	// To create dynamic classes we will JSON file with var "create_class". e.g. {"CSS_Type (Use '_' instead of '-' e.g. border_bottom)":{'SIZE NAME':'VALUE','SIZE-2 NAME':'VALUE-2'...}}. Here is an example {"border_bottom":{"sm":"20px"}}. Then to use our dynamic class we will write class "CSS_Type-SIZE" e.g. "border_bottom-sm" which will add border-bottom = 20px to the element.
	// To create color like bg-COLOR, text_color-COLOR, we will write CSS_Type is color then in child JSON file we will write color name in key and color in value e.g.
	// var create_class = { "color": {
	// 		"red":"red",
	// 		"yellow":"yellow"
	// 	}
	// }
	// and the we have red and yellow colors in HTML classes e.g. ".bg-red .text_color-red .border_color-yellow"
	// It will give four types of color which are bg-COLOR, text_color-COLOR, border_color-COLOR, .table-stripped-COLOR tr:nth-child(even) which is for our stripped table component 
	if (typeof create_class !== 'undefined') {
		var CSSFile = document.createElement("style");
		var y = '';
		for (x in create_class) {
			if (x == 'color') {
				var colorClass = ['bg','text_color','border_color'];
				var colorType = ['background-color','color','border-color']
				for (y in create_class[x]) {
					for (z in colorClass) {
						CSSFile.append('.' + colorClass[z] + '-' + y + '{' + colorType[z] + ':' + create_class[x][y] + '!important;}' );
					}
					CSSFile.append('.table-stripped-' + y + ' tr:nth-child(even){' + colorType[0] + ':' + create_class[x][y] + '!important;}' )
				}
			} else {
				y = x.replace('_','-');
				for (z in create_class[x]) {
					CSSFile.append('.' + x + '-' + z + '{' + y + ':' + create_class[x][z] + '!important;}')
				}
			}
		}
		$('head').append(CSSFile)
	}
	// Add classes to child elements in attribute "data-child"
	// To add class to all child element, simply write class in attribute. 
	// But to add class to only child element by tag name, then use suffix -chd-TAGNAME e.g. bg-black-chd-span
	// And to add class to only nth child element, use suffix -nth_chd-(N,M,...) where (N,M >= 1) represent any number. e.g. bg-black-nth_chd(4,2) add to 4th-child and 2nd-child
	// And to add class to only child element except some, use suffix -not_chd-(N,M,...) where (N,M >= 1) represent any number. e.g. bg-black-not_chd(4,2) add to all child element excepts 4th and 2nd-child
	// And to add class to only last child element, use suffix -last_chd e.g. bg-black-last_chd
	$('*[data-child]').each(function() {
		var addchild = $(this).attr('data-child')
		if (addchild != undefined) {
			addchild = addchild.split(' ');
			for (var i = 0; i < addchild.length; i++) {
				if (addchild[i].match('-chd-')) {
					$(this).children(addchild[i].split('-chd-')[1]).addClass(addchild[i].split('-chd-')[0])
				} if (addchild[i].match('-nth_chd')) {
					var crntChd = addchild[i].split('-nth_chd(')[1].split(')')[0].split(',');
					var prnt = $(this)
					$(crntChd).each(function(j, elA) {
						$(prnt).children().eq(elA - 1).addClass(addchild[i].split('-nth_chd')[0])
					});
				} if (addchild[i].match('-last_chd')) {
					$(this).children().last().addClass(addchild[i].split('-last_chd')[0])
				} if (addchild[i].match('-odd_chd')) {
					$(this).children().filter(':even').addClass(addchild[i].split('-odd_chd')[0])
				} if (addchild[i].match('-even_chd')) {
					$(this).children().filter(':odd').addClass(addchild[i].split('-even_chd')[0])
				} if (addchild[i].match('-not_chd')) {
					var crntChd = addchild[i].split('-not_chd(')[1].split(')')[0].split(',');
					var prnt = $(this);
					$(prnt).children().addClass(addchild[i].split('-not_chd')[0]);
					$(crntChd).each(function(j, elA) {
						$(prnt).children().eq(elA - 1).removeClass(addchild[i].split('-not_chd')[0]);
					});
				} if (!addchild[i].match('-chd-') && !addchild[i].match('-nth_chd-') && !addchild[i].match('-last_chd') && !addchild[i].match('-odd_chd') && !addchild[i].match('-even_chd') && !addchild[i].match('-not_chd')) {
					$(this).children().addClass(addchild[i])
				}
			}
			$(this).removeAttr('data-child')
		}
	});

	// hover
	// to add a class on hover, simply add classes in attribute "data-hover"
	$('*[data-hover]').each(function (i, elA) {
		$(this).on('mouseenter' , function () {
			if ($(this).attr('class') == undefined) {
				var classes = [''];
			} else {
				var classes = $(this).attr('class').split(' ');
			}
			var hoverFormat = ""; 
			var hoverClass = $(this).attr('data-hover').split(' ');
			var hoverClasses = "";
			var overClass = "";
			$(hoverClass).each(function(j, elB) {
				hoverFormat = elB.split('-')[0];
				hoverClasses = hoverClasses + " " + elB
				for (k in classes) {
					if(classes[k].match(hoverFormat) && !classes[k].match(elB)) {
						overClass = overClass + " " + classes[k]
					}
				}
			});
			$(this).addClass(hoverClasses)
			$(this).removeClass(overClass)
			$(this).mouseleave(function() {
				$(this).removeClass(hoverClasses)
				$(this).addClass(overClass)
			});
		});
	});


	// add class for different screen sizes
	// There are three ways to add class by screen size. For this first we tell that different screen sizes and then how to add class for different screen sizes.
	// There are four type of screen sizes elta introduce, these are "SIZE => (MIN-MAX)"
	// mbl => (0-767), tb => (768-991), dt => (992-1239), ldt => (1240-Infinity)
	// to add class for different screen first we add simple class "on_responsive" and then we add attribute to that element "data-responsive". Next, format of class will be "CLASS-min/max/only_SIZE" e.g. navbar-min_tb => there will be navbar class adds only if minimum screen size is 768px.
	$('*[data-responsive]').each(function(i, elA) {
		var min_screen_class = ['-min_mbl','-min_tb','-min_dt','-min_ldt'];
		var min_screen_size = [0,768,992,1240];
		var max_screen_class = ['-max_mbl','-max_tb','-max_dt','-max_ldt'];
		var max_screen_size = [767,991,1239,Infinity];
		var only_screen_class = ['-only_mbl','-only_tb','-only_dt','-only_ldt'];
		var screen_cl = $(this).attr('data-responsive').split(' ');
		$(screen_cl).each(function(j, elB) {
			for (x in min_screen_class) {
				if (elB.match(min_screen_class[x])) {
					var minstoresize = min_screen_size[x];
					var minstoreclass = min_screen_class[x];
					function MinClass() {
						if ($(window).width() >= minstoresize ) {
							$(elA).addClass(elB.split(minstoreclass)[0])
						} else {
							$(elA).removeClass(elB.split(minstoreclass)[0])
						}
					}
					$(window).resize(function(event) {
						MinClass();
					});
					MinClass();
				} else if (elB.match(max_screen_class[x])) {
					var maxstoresize = max_screen_size[x];
					var maxstoreclass = max_screen_class[x];
					function MaxClass() {
						if ($(window).width() <= maxstoresize ) {
							$(elA).addClass(elB.split(maxstoreclass)[0])
						} else {
							$(elA).removeClass(elB.split(maxstoreclass)[0])
						}
					}
					$(window).resize(function() {
						MaxClass();
					});
					MaxClass();
				} else if (elB.match(only_screen_class[x])) {
					var onlystoreclass = only_screen_class[x];
					var minstoresize = min_screen_size[x];
					var maxstoresize = max_screen_size[x];
					function OnlyClass() {
						if ($(window).width() <= maxstoresize && $(window).width() >= minstoresize ) {
							$(elA).addClass(elB.split(onlystoreclass)[0])
						} else {
							$(elA).removeClass(elB.split(onlystoreclass)[0])
						}
					}
					$(window).resize(function() {
						OnlyClass();
					});
					OnlyClass();
				}
			}
		});
	});


	// COMPONENTS
	// alert box
	$(".hide_alert").click(function(){
		$(this).parent().fadeOut();
	});

	// progress bar
	var progValue = document.getElementsByClassName('progress_value');
	for (var i = 0; i < progValue.length; i++) {
		var progValueIs = $(progValue[i]).attr("prog-value");
		$(progValue[i]).css("width",progValueIs + "%");
	}
	// progress animated
	var progAnimated = document.getElementsByClassName("progress_animated");
	for (var i = 0; i < progAnimated.length; i++) {
		var progColor = $(progAnimated[i]).attr("prog-color").split(";");
		$(progAnimated[i]).css("background-image" , "repeating-linear-gradient(45deg, "+progColor[0]+" 0px, "+progColor[0]+" 15px, "+progColor[1]+" 0px, "+progColor[1]+" 30px)");
	}
	//progress animated b
	var progAnimB = document.getElementsByClassName("progress_animated-b");
	for (var i = 0; i < progAnimB.length; i++) {
		$(progAnimB[i]).css("marginBottom",-$(progAnimB[i]).outerHeight(true))
	}
	// pagenation vertical scroll buttons
	$(".pagination-vertical .pagination_number li").css("top" , "0px")
	$(".pagination-vertical_up").click(function(){
		var pageMH = $(this).siblings(".pagination_number").height();
		var pageVLi = $(this).siblings(".pagination_number").children('li');
		var pageVT = parseInt(pageVLi.css("top"));
		var pageVH = parseInt(pageVLi.outerHeight(true));
		var pageSL = parseInt($(this).parent().attr("page-scroll-length"));
		var pageMax = parseInt((pageVH * pageVLi.length) - pageMH)
		if (pageVT <= -(pageMax - (pageVH * pageSL))) {
			pageVT = -pageMax;
		} else {
			pageVT -= (pageSL * pageVH);
		}
		$(pageVLi).css("top" , pageVT + "px");
	})
	$(".pagination-vertical_down").click(function(){
		var pageVLi = $(this).siblings(".pagination_number").children('li')
		var pageVT = parseInt(pageVLi.css("top"))
		var pageVH = parseInt(pageVLi.outerHeight(true))
		var pageSL = parseInt($(this).parent().attr("page-scroll-length"));
		if (pageVT >= - (pageVH * pageSL)) {
			pageVT = 0;
		} else {
			pageVT += (pageSL * pageVH)
		}
		$(pageVLi).css("top",pageVT+"px")
			
	})
	// pagination horizontal
	$(".pagination-horizontal .pagination_number li").css("left" , "0px")
	$(".pagination-horizontal_left").click(function(){
		var pageMH = $(this).siblings(".pagination_number").width();
		var pageVLi = $(this).siblings(".pagination_number").children('li');
		var pageVT = parseInt(pageVLi.css("left"));
		var pageVH = parseInt(pageVLi.outerWidth(true));
		var pageSL = parseInt($(this).parent().attr("page-scroll-length"));
		var pageMax = parseInt((pageVH * pageVLi.length) - pageMH)
		if (pageVT <= -(pageMax - (pageVH * pageSL))) {
			pageVT = -pageMax;
		} else {
			pageVT -= (pageSL * pageVH);
		}
		$(pageVLi).css("left" , pageVT + "px");
	})
	$(".pagination-horizontal_right").click(function(){
		var pageVLi = $(this).siblings(".pagination_number").children('li')
		var pageVT = parseInt(pageVLi.css("left"))
		var pageVH = parseInt(pageVLi.outerWidth(true))
		var pageSL = parseInt($(this).parent().attr("page-scroll-length"));
		if (pageVT >= - (pageVH * pageSL)) {
			pageVT = 0;
		} else {
			pageVT += (pageSL * pageVH)
		}
		$(pageVLi).css("left",pageVT+"px")
			
	})
	// dropdown
	$(".dropdown_menu").slideUp(0);
	$(".dropdown_toggle.toggled + .dropdown_menu").slideDown(0);
	$(".dropdown_toggle").click(function(){
		$(this).next(".dropdown_menu").slideToggle();
		$(this).toggleClass("toggled");
	});
	$(".dropdown_toggle.hide-all").click(function(){
		$(this).next(".dropdown_menu").find(".dropdown_menu").slideUp();
		$(this).next(".dropdown_menu").find(".dropdown_toggle").removeClass("toggled");
	});
	// accordian
	$(".accordian_menu").slideUp(0);
	$(".accordian_toggle.toggled").next(".accordian_menu").slideDown(0);
	$(".accordian_toggle").click(function(){
		if ($(this).next(".accordian_menu").css("display") == "none") {
			$(this).parents(".accordian").find(".accordian_menu").slideUp();
			$(this).next(".accordian_menu").slideDown();
			$(this).parents(".accordian").find(".accordian_toggle").removeClass("toggled")
			$(this).addClass("toggled")
		} else {
			$(this).next(".accordian_menu").slideUp();
			$(this).removeClass("toggled")
		}
	})
	// navbar
	var bodyMarginT = parseInt($("body").css("marginTop"))
	$(".navbar.navbar-fix").parents("body").css("marginTop", $(".navbar.navbar-fix").outerHeight(true) + bodyMarginT);
	$(".navbar .navbar_drawer").click(function(){
		$(this).siblings(":not(.navbar_title)").slideToggle();
	})

	// leftbar
	var leftBarStart = 0;
	var leftBarCurrent = 0;
	var leftbarWid = parseInt(2 * parseInt($(".leftbar").css("width")) / 3)
	$('.leftbar').each(function() {
		$(".leftbar_drawer").click(function(){
			var lBMI = parseInt($(".leftbar").css("marginLeft"));
			if ($(".leftbar").css("marginLeft") == lBMI + "px") {
				$(".leftbar").css("marginLeft" , "0px")
				$(this).css("transform" , "rotateZ(90deg)")
			} if ($('.leftbar').css("marginLeft") == '0px') {
				$(".leftbar").css("marginLeft" , "-100%")
				$(this).css("transform" , "rotateZ(0deg)")
			}
		});
		$("body").on("touchstart" , function(e){
			leftBarStart = e.originalEvent.touches[0].clientX;
		});
		$("body").on("touchmove" , function(e) {
			if ($(window).width() < 992) {
				leftBarCurrent = leftBarStart - e.originalEvent.touches[0].clientX;
				var lBMC = parseInt($(".leftbar").css("marginLeft"));
				if (leftBarStart <= 70) {
					if (lBMC > 0 ) {
						$(".leftbar").css("marginLeft" , 0)
					}
					else {
						$(".leftbar").css("marginLeft" , -100 - leftBarCurrent + "%")
					}
				}
			}
		})
		$("body").on("touchend" , function(){
			var lBMC = parseInt($(".leftbar").css("marginLeft"));
			if (lBMC < -leftbarWid) {
				$(".leftbar").css("marginLeft" , "-100%")
			} else {
				$(".leftbar").css("marginLeft" , "0px")
			}
		});
	});

	// rotate-vertical
	$('.rotate-vertical').each(function () {
		var rotVerth = $(this).width() / 2
		if ($(this).css('margin-top') == '0px') {
			$(this).css('margin-top', rotVerth)	
		}
		if ($(this).css('margin-bottom') == '0px') {
			$(this).css('margin-bottom', rotVerth)	
		}
	});


	// Form Validation
	// use function eltaformsuccess on success of validation
	$('.validate-form').submit(function(event) {
		var emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		var submitform = $(this);
		var vpl = $(this).find('[data-validate="password"]').length;
		var vpvl = parseInt($(this).find('[data-validate="password"]').attr('data-length'));
		var emailvalidator = false;
		var passwordvalidator = false;
		$(this).find('[data-validate="email"]').each(function() {
			var errorMsg = $(this).find('.validate-email');
			if ($(this).val() == '') {
				$(submitform).find('.validate-email *').hide();
				$(submitform).find('.validate-email .empty-error').slideDown();
				event.preventDefault();
			} else if (emailregex.test($(this).val())) {
				$(submitform).find('.validate-email *').hide();
				$(submitform).find('.validate-email .success').slideDown();
				emailvalidator = true;
			} else {	
				$(submitform).find('.validate-email *').hide();
				$(submitform).find('.validate-email .not-valid-error').slideDown();
				event.preventDefault();
			}
		});
		var passwordV = '';
		if (vpl == 1) {
			$(this).find('[data-validate="password"]').each(function() {
				if ($(this).val() == '') {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .empty-error').slideDown();
					event.preventDefault();
				} else if ($(this).val().length < vpvl ) {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .length-error').slideDown();
					event.preventDefault();
				} else {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .success').slideDown();
					passwordvalidator = true;
				}
			});
		} else if (vpl > 1) {
			$(this).find('[data-validate="password"]').each(function() {
				if ($(this).val() == '') {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .empty-error').slideDown();
					event.preventDefault();
					return false;
				} else if ($(this).val().length < vpvl ) {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .length-error').slideDown();
					event.preventDefault();
				} else {
					$(submitform).find('.validate-password *').hide();
					passwordV = passwordV + ',/">,<.@#^&*<?' + $(this).val();
				}
			});
			var passwordV = passwordV.split(',/">,<.@#^&*<?');
			for (var i = 1; i < passwordV.length - 1; i++) {
				if (passwordV[i] != passwordV[i+1]) {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .not-valid-error').slideDown();
					event.preventDefault();
				} else {
					$(submitform).find('.validate-password *').hide();
					$(submitform).find('.validate-password .success').slideDown();
					passwordvalidator = true;
				}
			}
		}
		if (emailvalidator == true && passwordvalidator == true) {
			eltaformsuccess()
		}
	});
})