$(document).ready(function () {
	
	// Create Data Tabel and Write Table Data
	// Data table will be created in JSON file with variable name "create_data"
	// To write Data from JSON file in HTML we will use format "writeData('1st Key]2nd Key]...')" which must be in HTML element of class "write_data"
	// e.g. we have Data Table
	// var create_data = {
	// 	"Student Profile":{
	// 		"Date of Birth":"27/03/1993",
	// 		"Degree":"MSc",
	// 		"Address":"Jhelum"
	// 	},
	// 	"Student Name":['Ali Haider','Asghar Ali']
	// }
	// to write Data we will create HTML element like below
	// <li class="write_data">
	// 	writeData('Student Profile]Degree')
	// </li>
	// RESULT: 
	// <li class="write_data">
	// 	MSc
	// </li>
	// or
	// <span class="write_data">writeData('Student Name]0')</span>
	// RESULT;
	// <li class="write_data">
	// 	Ali Haider
	// </li>
	//	To write all values in child JSON file, we will use "x.value" and to write all keys we will use "x.key" and to write key-value pair we will use "x.pair".

	if (typeof create_data !== 'undefined') {
		$('.write_data').each(function(i, elA) {
			var func = eval($(this).html());
			function writeData(elem) {
				var result = '["'+elem.split(']')[0]+'"]';
				if (elem.match(']')) {
					var elemSp = elem.split(']');
					for (var j = 1; j < elemSp.length; j++) {
						if (elemSp[j] == 'x.value') {
							var fresult = eval('create_data' + result)
							for (x in fresult) {
								var crClone = $(elA).html('').clone();
								$(elA).before(crClone.prepend(fresult[x]));
							}
							$(elA).remove()
						}
						if (elemSp[j] == 'x.key') {
							var fresult = eval('create_data' + result)
							for (x in fresult) {
								var crClone = $(elA).html('').clone();
								$(elA).before(crClone.prepend(x));
							}
							$(elA).remove()
						} 
						if (elemSp[j] == 'x.pair') {
							var fresult = eval('create_data' + result)
							for (x in fresult) {
								var crClone = $(elA).html('').clone();
								var crCloneB = $(elA).html('').clone();
								$(elA).before(crClone.prepend(x));
								$(elA).before(crCloneB.prepend(fresult[x]));
							}
							$(elA).remove()
						} else {
							result += '["' + elemSp[j] + '"]';
							var fresult = eval( 'create_data' + result);
							$(elA).html(fresult)
						}
					}
				} else {
					$(elA).html(create_data[elem]);
				}
			}
		});
	}

	// CREATE CLASS
	// To create dynamic classes we will JSON file with var "create_class". e.g. {"CSS_Type (Use '_' instead of '-' e.g. border_bottom)":{'SIZE NAME':'VALUE','SIZE-2 NAME':'VALUE-2'...}}. Here is an example {"border_bottom":{"sm":"20px"}}. Then to use our dynamic class we will write class "CSS_Type-SIZE" e.g. "border_bottom-sm" which will add border-bottom = 20px to the element.
	// To create color like bg-COLOR, text_color-COLOR, we will write CSS_Type is color then in child JSON file we will write color name in key and color in value e.g.
	// var create_class = "color": {
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
						CSSFile.append('.' + colorClass[z] + '-' + y + '{' + colorType[z] + ':' + create_class[x][y] + ';}' );
					}
					CSSFile.append('.table-stripped-' + y + ' tr:nth-child(even){' + colorType[0] + ':' + create_class[x][y] + ';}' )
				}
			} else {
				y = x.replace('_','-');
				for (z in create_class[x]) {
					CSSFile.append('.' + x + '-' + z + '{' + y + ':' + create_class[x][z] + ';' + '}')
				}
			}
		}
		$('head').append(CSSFile)
	}
	// Set style to first child elements in attribute "add-to-child"
	// To add class to all child element, simply write class in attribute. 
	// But to add class to only child element by tag name, then use suffix -chd-TAGNAME e.g. bg-black-chd-span
	// And to add class to only nth child element, use suffix -nth_chd-(N,M,...) where (N,M >= 1) represent any number. e.g. bg-black-nth_chd(4,2) add to 4th-child and 2nd-child
	// And to add class to only child element except some, use suffix -not_chd-(N,M,...) where (N,M >= 1) represent any number. e.g. bg-black-not_chd(4,2) add to all child element excepts 4th and 2nd-child
	// And to add class to only last child element, use suffix -last_chd e.g. bg-black-last_chd
	$('.add-to-child').each(function() {
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
	// to add a class on hover, first we add class onhover and then add class with suffix '-hover'
	$('.onhover').each(function (i, elA) {
		var myelem = $(this)
		$(this).on('mouseenter' , function () {
			var classes = $(this).attr('class').split(' ');
			var hoverFormat = ""; 
			var hoverClass = "";
			var hoverClasses = "";
			var overClass = "";
			$(classes).each(function(j, elB) {
				if (elB.match('-hover$') != null) {
					hoverFormat = elB.split('-')[0];
					hoverClass = elB.split('-hover')[0];
					hoverClasses = hoverClasses + " " + elB.split('-hover')[0]
					for (var k = 0; k < classes.length; k++) {
						if(classes[k].match(hoverFormat) && !classes[k].match(hoverClass)) {
							overClass = overClass + " " + classes[k]
						}
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
