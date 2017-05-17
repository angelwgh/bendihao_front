/*jshint unused: vars */
define ([
		'directives/hb-tab-directive',
		'const/futureStates',
		'const/modules',
		'uiRouterExtras',
		'oclazyload',
		'kendo/kendo.web',
		'angularSanitize',
		'home',
		'states/home-state',
		'services/principal',
		'common/hbCommon',
		'common/interceptor',
		'common/hb-nice-scroll',
		'common/placeholder',
		'angularAnimate'
	],

	function (myTab, futureStates, modules) {
		'use strict';

		/**
		 * 加载后于kendo的all
		 */
		require (['kendo/messages/kendo.messages.zh-CN', 'kendo/cultures/kendo.culture.zh-CN']);

		var app = angular.module ('app',
			['kendo.directives',
				'oc.lazyLoad',
				'ct.ui.router.extras',
				'app.home',
				'app.states.home',
				'HB_interceptor',
				'hbNiceScroll',
				'AuthorizationSystem',
				'ui.router',
				'ngSanitize',
				'hbCommon',
				'Placeholder',
				'ngAnimate']
		);

		app.directive ('tabStan', myTab);

		app.factory ('TabService', [function () {
			var TabService = {};
			TabService.appendNewTab = angular.noop;
			return TabService;
		}]);

		app.constant ('futureStates', futureStates);
		app.constant ('modules', modules);

		app.config (function ($interpolateProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $futureStateProvider, HBInterceptorProvider,
							  $httpProvider, /**restAngular配置项目的一个服务*/ RestangularProvider, futureStates, modules) {

			// 为了修复IE系列编译后dom的换行
			// 以'${{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
			$interpolateProvider.startSymbol ('b{{');

			HBInterceptorProvider.app = 'admin';
			//////////////////////////////
			//  请求响应拦截器            //
			//////////////////////////////
			$ocLazyLoadProvider.config ({
				jsLoader: requirejs,
				loadedModules: ['states'],
				modules: modules.modules
			});

			var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
				var deferred = $q.defer ();
				$ocLazyLoad.load (futureState.module)
					.then (function (name) {
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
            RestangularProvider.setDefaultHttpFields({cache: false});

        });

		app.run (['$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
			}
		]);
		return app;
	});
