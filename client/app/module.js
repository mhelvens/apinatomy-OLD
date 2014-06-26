'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['lodash', 'angular',
        'tile-map/module',
        'trace-diagram/module',
        'angular-animate',
        'angular-bootstrap',
        'angular-recursion',
        'angular-slider'], function (_, ng) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var app = ng.module('ApiNATOMY', [ 'tile-map'        , 'trace-diagram'        ,
	                                   'ngAnimate'       , 'ui.bootstrap'         ,
	                                   'RecursionHelper' , 'vr.directives.slider' ]);


	//// Global configuration:
	//
	app.config(function ($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	});


	//// Register the variables we want to be available in every $scope everywhere.
	//
	app.run(['$rootScope', function ($rootScope) {
		$rootScope.constructor.prototype._ = _;
		$rootScope.constructor.prototype.console = console;
		$rootScope.constructor.prototype.Math = Math;
	}]);


	return app;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
