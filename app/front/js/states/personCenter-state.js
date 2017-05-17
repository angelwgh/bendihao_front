define (['angularUiRouter', 'modules/personCenter/main'], function () {
	'use strict';
	return angular.module ('app.states.personCenter', [
		'ui.router'
	]).config (function ($stateProvider) {
			$stateProvider
				.state ("states.personCenter", {
				url: "/personCenter",
				views: {
					'@': {
						templateUrl: 'views/personCenter/personCenter.html',
						controller: 'app.personCenter.personCenterCtrl'
					}
				}
			})
				.state ('states.personCenter.editPassword', {
					url: '/editPassword',
					views: {
						'': {
							templateUrl: 'views/personCenter/editPassword.html'
						}
					}
				})
				.state ('states.personCenter.test1', {
				url: '/test1',
				views: {
					'': {
						templateUrl: 'views/personCenter/ceshi1.html'
					}
				}
			})
				.state ('states.personCenter.test2', {
				url: '/test2',
				views: {
					'': {
						templateUrl: 'views/personCenter/ceshi2.html'
					}
				}
			})
				.state ('states.personCenter.test3', {
				url: '/test3',
				views: {
					'': {
						templateUrl: 'views/personCenter/ceshi3.html'
					}
				}
			})
		}
	);
});
