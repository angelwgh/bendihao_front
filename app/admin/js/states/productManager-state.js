define (['angularUiRouter', 'modules/productManager/main'], function () {
	'use strict';
	return angular.module ('app.states.productManager',
		['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.productManager', {
			url: '/productManager',
			sticky: true,
			views: {
				'states.productManager@': {
					templateUrl: 'views/productManager/productManager.html',
					controller: 'app.productManager.productManagerCtrl'
				}
			}
		});
	});
});
