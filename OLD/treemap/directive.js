'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['lodash',
	'angular',
	'../../client/app/module',
	'partial/tile-map/service',
	'partial/treemap/layout/predefined',
	'$bind/service',
	'partial/treemap/tile/directive'], function
		(_, ng, app) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var DEFAULT_TILE_SPACING = '1px';
	var DEFAULT_TILE_LAYOUT = 'twentyFourTile';


	app.directive('amyTreemap', ['$q', '$window', '$bind', 'TileMap', function ($q, $window, $bind, TileMap) {
		return {

			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			restrict: 'E',
			scope   : {
				attrLayout     : '@layout',
				attrTileSpacing: '@tileSpacing',
				onRedrawFn     : '&onRedraw'
			},

			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			controller: ['$scope', function ($scope) {

				//// controller interface for the treemap

				var children = [];
				var controller = {

					height: undefined,

					width: undefined,

					registerMouseEnter: function () {
						$scope.focus = true;
					},

					registerMouseLeave: function () {
						$scope.focus = false;
					},

					registerChild: function (child) {
						children.push(child);
						controller.requestRedraw();
					},

					positionInTreemap: function () {
						return {
							top            : 0,
							left           : 0,
							height         : controller.height(),
							width          : controller.width(),
							childTopOffset : $scope.tileSpacing,
							childLeftOffset: $scope.tileSpacing
						};
					},

					requestRedraw: _($bind(function () {
						var positions = TileMap(
								_(children)
										.pluck('layoutInterface')
										.map(function (childIface, i) {
											return _.chain(childIface).clone().assign({ index: i }).value();
										}).value(),
								$scope.layout,
								controller.height() - $scope.tileSpacing,
								controller.width() - $scope.tileSpacing
						);

						//// adjust for tile spacing

						_(positions).each(function (pos) {
							pos.hidden = (pos.height === 0 || pos.width === 0);
							pos.top += $scope.tileSpacing;
							pos.left += $scope.tileSpacing;
							pos.height -= $scope.tileSpacing;
							pos.width -= $scope.tileSpacing;
						});

						//// apply repositioning to the child tiles

						_(children).each(function (child, i) {
							child.reposition(positions[i]);
						});

						$scope.onRedrawFn();

					})).debounce(40).value()

				};

				return controller;
			}],

			////////////////////////////////////////////////////////////////////////////////////////////////////////////

			compile: function () {
				return {

					pre: function preLink($scope) {

						//// normalizing attributes

						_($scope).assign({
							layout     : _($scope.attrLayout).or(DEFAULT_TILE_LAYOUT),
							tileSpacing: _.parseInt(_($scope.attrTileSpacing).or(DEFAULT_TILE_SPACING))
						});

					},

					post: function postLink($scope, iElement, iAttrs, controller) {
						controller.height = _(iElement).bindKey('height').value();
						controller.width = _(iElement).bindKey('width').value();
						$($window).on('resize', $bind(controller.requestRedraw));
					}

				};
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};
	}]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////