/*   Project: Popup Lightbox 
 *   Author: Asif Mughal
 *   URL: www.codehim.com
 *   License: MIT License
 *   Copyright (c) 2019 - Asif Mughal
 */
/* File: jquery.popup.lightbox.js */
(function ($) {
	$.fn.popupLightbox = function (options) {

		var setting = $.extend({
			width: 480,
			height: 880,
			inAnimation: "ZoomIn",

		}, options);

		return this.each(function () {

			var target = $(this);

			var popupWindow = $section();

			var closeBtn = $button();

			var nextBtn = $button();

			var prevBtn = $button();

			var imgStat = $div();

			var imgFig = $figure();

			var capBar = $figcaption();

			var imgs = target.find(".img_details img").first();
			var imgs2 = target.find(".img_details2 img").first();
			// if (imgs2.length > 0) {
			// 	imgs = imgs.add(imgs2.get(0));
			// }

			var totalImgs = imgs.length;
			var totalImgs2 = imgs2.length;

			var imgNum = 0;
			var current, thisCaption;


			if (totalImgs2 > 0) {
				$(nextBtn).addClass("btn-next")
					.appendTo(popupWindow);

				$(prevBtn).addClass("btn-prev")
					.appendTo(popupWindow);
			}

			$(closeBtn).addClass("btn-close")
				.appendTo(popupWindow)
				.html("<i class=\"fa times fa-times\"></i>");

			$(imgStat).addClass("lightbox-status")
				.appendTo(popupWindow);


			$(imgFig).addClass("img-show")
				.appendTo(popupWindow);

			$(popupWindow).addClass("lightbox animated faster " + setting.inAnimation).appendTo("body");


			//set up unique number for each image 

			// for (var i = 0; i < imgs.length; i++) {
			//
			// 	$(imgs).eq(i).attr({
			// 		'data-num': i,
			// 		'id': '#img' + i,
			// 	});
			//
			//
			// }

			if ($(window).width() > 620) {


				$(popupWindow).css({
					'width': setting.width,
					'height': setting.height,
					'position': 'fixed',
					'top': '50%',
					'marginTop': -(setting.height / 2),
					'right': '256px',
					'marginLeft': -(setting.width / 2),
					'zIndex': '999',
					'overflow': 'hidden',

				});

			} else {
				$(popupWindow).css({
					'width': '100%',
					'height': '100%',
					'top': 0,
					'left': 0,


				});


			}


			// $(capBar).addClass("img-caption animated fadeInUp");


			$(target).click(function () {

				document.getElementById('overlay').style.display = 'block';

				var thisImg = imgs;
				// var thisNum = $(this).attr("data-num") * 1;
				var thisNum = 0;

				imgs.show();


				imgNum = thisNum;

				$(prevBtn).hide();
				$(nextBtn).show();

				if (totalImgs2 > 0) {
					$(imgStat).html("1/2");
				}

				$(imgFig).html(thisImg)
					.parent().fadeIn();

				// $(capBar).html($caption).appendTo(imgFig);
				var imgElement = $("figure.img-show img");
				imgElement.css("display", "");

			});


			//Next image 

			$(nextBtn).click(function () {

				$(prevBtn).fadeIn();
				$(nextBtn).hide();

				imgs2.fadeIn();
				imgs.hide();
				$(imgFig).html(imgs2);

				var imgElement = $("figure.img-show img");
				imgElement.css("display", "");

				if (totalImgs2 > 0) {
					$(imgStat).html("2/2");
				}

			});

			//Previous image 

			$(prevBtn).click(function () {

				$(nextBtn).fadeIn();
				$(prevBtn).hide();

				imgs.fadeIn();
				imgs2.hide();
				$(imgFig).html(imgs);

				var imgElement = $("figure.img-show img");
				imgElement.css("display", "");

				if (totalImgs2 > 0) {
					$(imgStat).html("1/2");
				}

			});


			function $div() {
				return document.createElement("div");
			}

			function $button() {
				return document.createElement("button");

			}

			function $section() {

				return document.createElement("section");

			}

			function $figure() {
				return document.createElement("figure");
			}

			function $figcaption() {
				return document.createElement("figcaption");

			}


			$(".btn-close").click(function () {
				$(this).parent().fadeOut();
				imgNum = 0;
				document.getElementById('overlay').style.display = 'none';


			});


		});
	};

})(jQuery);
