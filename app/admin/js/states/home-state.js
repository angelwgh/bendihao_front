define (['angularUiRouter'], function () {
	'use strict';
	return angular.module ('app.states.home', [
		'ui.router'
	]).config (function ($stateProvider,
						 $urlRouterProvider) {
			$urlRouterProvider.otherwise ('/home');
			$stateProvider
				.state ('states', {
				url: '',
				abstract: true,
				views: {
					'topView@': {
						templateUrl: 'views/home/top.html'
					},
					'menuView@': {
						templateUrl: 'views/home/sideNav.html',
						controller: 'app.home.sideNavCtrl'
					}
				}
			})
				.state ('states.home', {
				url: '/home',
				sticky: true,
				views: {
					'states.home@': {
						templateUrl: 'views/home/managerIndex.html',
						controller: 'app.home.managerIndexCtrl'
					}
				}
			})
				.state ('states.home.view', {
				url: '/view/:noticeId',
				templateUrl: 'views/home/viewInfo.html',
				controller: 'app.home.managerIndexViewCtrl'
			})
		}
	);
});
