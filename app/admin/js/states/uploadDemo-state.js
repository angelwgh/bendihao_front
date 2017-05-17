define (['angularUiRouter', 'modules/uploadDemo/main'], function () {
	'use strict';
	return angular.module ('app.states.uploadDemo', ['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.uploadDemo', {
			url: '/uploadDemo',
			sticky: true,
			views: {
				'states.uploadDemo@': {
					templateUrl: 'views/uploadDemo/uploadDemo.html',
					controller: 'app.uploadDemo.uploadDemoCtrl'
				}
			}
		})
			.state ('states.uploadDemo.edit', {
				url: '/edit/:id',
				views: {
					'': {
						template: '<a ng-click="globle.__Biu(this ,\'states.uploadDemo\', \'index\')">返回edit</a><input type="text"/>'
					}
				}
			})
			.state ('states.uploadDemo.release', {
				url: '/release',
				views: {
					'': {
						template: '<a ng-click="globle.__Biu(this ,\'states.uploadDemo\', \'index\')">返回release</a>'
					}
				}
			})
	});
});
