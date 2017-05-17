define (['angularUiRouter', 'modules/library/main'], function () {
	'use strict';
	return angular.module ('app.states.library', ['ui.router']).config (function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$stateProvider.state ('states.library', {
			url: '/library/:newlibray',
			sticky: true,
			views: {
				'states.library@': {
					templateUrl: 'views/exam/question-library.html',
					controller: 'app.library.questionLibraryCtrl'
				}
			}
		});
	});
});
