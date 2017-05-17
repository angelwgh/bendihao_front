/*jshint unused: vars */
define ([
		'const/futureStates',
		'const/modules',
		'uiRouterExtras',
		'oclazyload', 'home', 'states/home-state',
		'directives/metro-desktop-directive',
		//'common/hbFrontCommon',
		'common/hb-notification',
		'angularSanitize',
		'services/principal',
		'common/interceptor',
		'common/hbBootstrap',
		'common/placeholder',
		'common/hb-nice-scroll'
	],
	function (futureStates, modules) {
		'use strict';
		var frontModule = angular.module ('app',
			[
				'oc.lazyLoad',
				'ct.ui.router.extras',
				'app.home',
				'app.states.home',
				'AuthorizationSystem',
				'ui.router',
				'HB_interceptor',
				'ui.bootstrap',
				'ngSanitize',
				//'hbFrontCommon',
				'hbNiceScroll',
				'DeskTop',
				'Placeholder',
				'HB_notifications'
			]
		);

		frontModule.constant ('futureStates', futureStates);
		frontModule.constant ('modules', modules);

		frontModule.config (
			function ($interpolateProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
					  $futureStateProvider, $httpProvider,
					  /**restAngular配置项目的一个服务*/
					  RestangularProvider, HBInterceptorProvider) {

				// 为了修复IE系列编译后dom的换行
				// 以'${{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
				$interpolateProvider.startSymbol ('b{{');

				HBInterceptorProvider.app = 'front';

				/////////////////////////////
				//配置RestAngular			//
				/////////////////////////////

				RestangularProvider.addFullRequestInterceptor (function
					(element, operation, route, url, headers, params, httpConfig) {
					if (operation === 'post') {
						if (headers['Content-Type'] && angular.isObject (element)) {
							if (headers['Content-Type'].indexOf ('application/x-www-form-urlencoded') !== -1) {
								element = $.param (element);
							}
						}
					}
					return {
						element: element,
						params: params,
						headers: headers,
						httpConfig: httpConfig
					};
				});
				RestangularProvider.setDefaultHttpFields ({cache: false});
				$ocLazyLoadProvider.config ({
					//debug: true,
					jsLoader: requirejs,
					//events: true,
					loadedModules: ['states'],
					modules: modules.modules
				});

				var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
					var deferred = $q.defer ();
					$ocLazyLoad.load (futureState.module).then (function (name) {
						deferred.resolve ();
					}, function () {
						deferred.reject ();
					});
					return deferred.promise;
				}];

				$futureStateProvider.stateFactory ('ocLazyLoad', ocLazyLoadStateFactory);

				$futureStateProvider.addResolve (['$q', '$injector', '$http', function ($q, $injector, $http) {
					var deferd = $q.defer (),
						promise = deferd.promise;
					angular.forEach (futureStates.futureStates, function (futureState) {
						$futureStateProvider.futureState (futureState);
					});
					deferd.resolve (futureStates.futureStates);
					return promise;
				}]);
			})
			.run (['$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
			}
		]);

		return frontModule;
	})
;
