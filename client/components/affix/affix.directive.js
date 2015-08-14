'use strict';

angular.module('newsApp')
  .directive('affix', function ($window) {
    return {    
      restrict: 'EA',
      link: function (scope, element, attrs) {         
      
      		var affixTop = $(element).offset().top;
      		var bottom = $('.wrapper > div.ng-scope > section').outerHeight(true) - 
      			$('.wrapper > div.ng-scope > section > .main-content').outerHeight(true);
      			$(element).affix({
					  offset: {
					    top: affixTop,
					    bottom:bottom					  
					  }
					});
      		
      		$(element).attr('style', "");
			$(element).attr('style', 'width:' +  $(element).width() + 'px');
			$('.csstransforms3d .wrapper > div.ng-scope > section').attr("style",  "-webkit-transform: none;  transform: none;");
			$(element).on("affixed.bs.affix", function () {
				//console.log("click affix");
				
				var width = 'width:' +  $(element).width() + 'px';
				$(element).attr('style', "");
				$(element).attr('style', width);
			});
			$(window).resize(function() {
				var affixTop = $(element).offset().top;
      			$(element).affix({
					  offset: {
					    top: affixTop					  
					  }
				});	

				$(element).attr('style', "");
				$(element).attr('style', 'width:' +  $(element).width() + 'px');

			});
		}     
    };
  });