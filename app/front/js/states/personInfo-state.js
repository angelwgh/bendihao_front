define (['angularUiRouter', 'modules/personInfo/main'], function () {
	'use strict';
	return angular.module ('app.states.personInfo', ['ui.router'])
		.config (function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise ('/personInfo/basicInfo');
		$stateProvider
			.state ("states.personInfo", {
			url: "/personInfo",
			abstract: true,
			views: {
				'@': {
					templateUrl: 'views/personInfo/personInfo.html',
					controller: 'app.personInfo.personInfoCtrl'
				}
			}
		}).state ('states.personInfo.personInfoModify', {
			url: '/personInfoModify',
			views: {
				'': {
                    templateUrl: 'views/personInfo/personInfoModify.html',
                    controller: 'app.personInfo.personModifyCtrl'
				}
			}
		})
			.state ('states.personInfo.basicInfo', {
			url: '/basicInfo',
			views: {
				'': {
                    templateUrl: 'views/personInfo/basic-data.html',
                    controller: 'app.personInfo.personInfoCtrl'
				}
			}
		})
			.state ('states.personInfo.personPasswordModify', {
			url: '/personPasswordModify',
			views: {
				'': {
					templateUrl: 'views/personInfo/personPasswordModify.html'
				}
			}
		}).state ('states.personInfo.personImgModify', {
			url: '/personImgModify',
			views: {
				'': {
                    templateUrl: 'views/personInfo/personImgModify.html',
                    controller: 'app.personInfo.personImgCtrl'
				}
			}
		});
	});
});
