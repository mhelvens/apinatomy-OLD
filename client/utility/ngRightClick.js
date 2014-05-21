'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['app/module'], function (app) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	app.directive('ngRightClick', function ($parse) {
		return function (scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', function (event) {
				scope.$apply(function () {
					fn(scope, {$event: event});
				});
			});
		};
	});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
