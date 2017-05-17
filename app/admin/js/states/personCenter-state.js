define (['angularUiRouter', 'modules/personCenter/main'], function () {
	'use strict';
	return angular.module ('app.states.personCenter', ['ui.router']).config (
		function ($stateProvider) {
			$stateProvider.state ('states.personCenter', {
				url: '/personCenter',
				sticky: true,
				views: {
					'states.personCenter@': {
						templateUrl: 'views/personCenter/personCenter.html',
						controller: 'app.personCenter.personCenterCtrl'
					}
				}
			});
		});
});
