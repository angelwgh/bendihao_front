define (['angularUiRouter', 'modules/noticeManage/main'], function () {
	'use strict';
	return angular.module ('app.states.noticeManage', ['ui.router']).config (
		function ($stateProvider) {
			$stateProvider.state ('states.noticeManage', {
				url: '/noticeManage',
				sticky: true,
				views: {
					'states.noticeManage@': {
						templateUrl: 'views/noticeManage/noticeManage.html',
						controller: 'app.noticeManage.noticeManageCtrl'
					}
				}
			})
				.state ('states.noticeManage.view', {
				url: '/view/:noticeId',
				templateUrl: 'views/noticeManage/viewInfo.html',
				controller: 'app.noticeManage.noticeManageViewCtrl'
			});
		});
});
