/*jshint unused: vars */
require.config ({
	//baseUrl: '../../../bower_components/',
	paths: {
		app: './app',
		controllers: 'controllers',
		services: 'services',
		kendo: '../../../bower_components/KendoUI/js',
		angular: '../../../bower_components/angular/angular',
		angularAnimate: '../../../bower_components/angular-animate/angular-animate',
		angularCookies: '../../../bower_components/angular-cookies/angular-cookies',
		angularMocks: '../../../bower_components/angular-mocks/angular-mocks',
		angularResource: '../../../bower_components/angular-resource/angular-resource',
		angularRoute: '../../../bower_components/angular-route/angular-route',
		angularSanitize: '../../../bower_components/angular-sanitize/angular-sanitize',
		angularTouch: '../../../bower_components/angular-touch/angular-touch',
		angularUiRouter: '../../../bower_components/angular-ui-router/release/angular-ui-router',
		restangular: '../../../bower_components/restangular/dist/restangular',
		jquery: '../../../bower_components/jquery/dist/jquery',
		oclazyload: '../../../bower_components/oclazyload/dist/ocLazyLoad.min',
		uiRouterExtras: '../../../bower_components/ui-router-extras/release/ct-ui-router-extras',
		d3: '../../../bower_components/d3/d3',
		lodash: '../../../bower_components/lodash/lodash',
		webuploader: '../../../bower_components/webuploader_fex/dist/webuploader',
		'webuploader.flashonly': '../../../bower_components/webuploader_fex/dist/webuploader.flashonly',
		cropper: '../../../bower_components/cropper/dist/cropper',
		angularProgress: '../../../bower_components/ngprogress/build/ngProgress',
		uploadify: '../../../bower_components/uploadify/jquery.uploadify',
		'playLoader': '../../../bower_components/StudyLibrary/scripts/common/loader',
		multimediaDocument: '../../../bower_components/StudyLibrary/scripts',
		jqueryNiceScroll: '../../../bower_components/jquery.nicescroll/jquery.nicescroll'

	},
	shim: {
		angular: {deps: ['jquery'], exports: 'angular'},
		//  Restangular depends on either lodash or underscore{要使用这个必须依赖lodash或者underscore}
		restangular: {deps: ['lodash'], exports: 'restangular'},
		cropper: {deps: ['jquery'], exports: 'cropper'},
		jqueryNiceScroll: {deps: ['jquery'], exports: 'jqueryNiceScroll'},
		webuploader: {deps: ['jquery'], exports: 'webuploader'},
		uploadify: {deps: ['jquery', 'angular'], exports: 'uploadify'},
		angularAnimate: {deps: ['angular'], exports: 'angularAnimate'},
		angularCookies: {deps: ['angular'], exports: 'angularCookies'},
		angularResource: {deps: ['angular'], exports: 'angularResource'},
		angularSanitize: {deps: ['angular'], exports: 'angularSanitize'},
		angularRoute: {deps: ['angular'], exports: 'angularRoute'},
		oclazyload: {deps: ['angular'], exports: 'oclazyload'},
		angularTouch: {deps: ['angular'], exports: 'angularTouch'},
		angularMocks: {deps: ['angular'], exports: 'angularMock'},
		angularUiRouter: {deps: ['angular'], exports: 'angularUiRouter'},
		uiRouterExtras: {deps: ['angularUiRouter'], exports: 'uiRouterExtras'},
		d3: {exports: 'd3'},
		lodash: {exports: '_'},
		app: {deps: ['angular'], exports: 'app'}
	},
	packages: [],
	waitSeconds: 0
});
require (['angular', 'app'], function (angular) {
	'use strict';
	var html = angular.element (document.getElementsByTagName ('html')[0]);
	angular.bootstrap (html, ['app']);
});
