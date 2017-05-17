/** * Created by admin on 2015/5/11.*/
define ([
		'angular',
		'modules/restangulartest/controllers/restangulartest-ctrl',
		'directives/pager-directive',
		'services/kendoui-window',
		'restangular'
	],

	function (angular, ctrl, pagerDirective, UIWindow) {
		'use strict';
		return angular.module ('app.restangulartest', ['restangular'])

			.controller ('app.restangulartest.restangulartestCtrl', ctrl)


			.directive ('hbPager', pagerDirective)

			.factory ('UIWindow', UIWindow)
	});
