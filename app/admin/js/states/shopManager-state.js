define (['angularUiRouter', 'modules/shopManager/main'], function () {
	'use strict';
	return angular.module ('app.states.shopManager',
		['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.shopManager', {
			url: '/shopManager',
			sticky: true,
			views: {
				'states.shopManager@': {
					templateUrl: 'views/shopManager/shopManager.html',
					controller: 'app.shopManager.shopManagerCtrl'
				}
			}
		});
	});
});
