define (['angularUiRouter', 'modules/usermanage/main'], function () {
	'use strict';
	return angular.module ('app.states.usermanage', ['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.usermanage', {
			url: '/usermanage',
			sticky: true,
			views: {
				'states.usermanage@': {
					templateUrl: 'views/usermanage/usermanage.html',
					controller: 'app.usermanage.usermanageCtrl'
				}
			}
		});
	});
});
