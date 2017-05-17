define (['angularUiRouter', 'modules/recommendManager/main'], function () {
	'use strict';
	return angular.module ('app.states.recommendManager',
		['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.recommendManager', {
			url: '/recommendManager',
			sticky: true,
			views: {
				'states.recommendManager@': {
					templateUrl: 'views/recommendManager/recommendManager.html',
					controller: 'app.recommendManager.recommendManagerCtrl'
				}
			}
		});
	});
});
