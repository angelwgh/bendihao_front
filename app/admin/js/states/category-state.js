define (['angularUiRouter', 'modules/category/main'], function () {
	'use strict';
	return angular.module ('app.states.category', ['ui.router']).config (
		function ($stateProvider) {
			$stateProvider
				.state ('states.category', {
				url: '/category',
				sticky: true,
				views: {
					'states.category@': {
						templateUrl: 'views/category/category.html',
						controller: 'app.category.categoryCtrl'
					}
				}
			})
		});
});
