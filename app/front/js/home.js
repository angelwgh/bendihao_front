define (['angular',
	'restangular'
], function (angular, siderBarCtrl) {
	'use strict';
	return angular.module ('app.home', ['restangular'])

		.controller ('topController', ['$scope', '$rootScope', '$timeout',
		function ($scope, $rootScope, $timeout) {
			$rootScope.toolBarSettings = {
				showOperators: false,
				theStyle: {display: 'none'}
			};

			$scope.timer = $timeout (function () {
				$scope.animateCompanyName = true;
			}, 1000).$$timeoutId;
			$timeout.cancel ($scope.timer);


			$scope.hideUserOperators = function ($e) {
				if ($ ($e.target).closest ('#_use_settings').length > 0) {
					$rootScope.toolBarSettings.showOperators = !$rootScope.toolBarSettings.showOperators;
				} else {
					if ($rootScope.toolBarSettings.showOperators) {
						$rootScope.toolBarSettings.showOperators = false;
					}
				}
				hideInIe8 ();
				function hideInIe8 () {

					var isIe8 = (function (ua) {
						var ie = ua.match (/MSIE\s([\d\.]+)/) ||
							ua.match (/(?:trident)(?:.*rv:([\w.]+))?/i);
						return ie && parseFloat (ie[1]);
					}) (navigator.userAgent);

					if (isIe8 === 8) {
						if ($rootScope.toolBarSettings.showOperators) {
							$rootScope.toolBarSettings.theStyle.display = 'block';
						} else {
							$rootScope.toolBarSettings.theStyle.display = 'none';
						}
					} else {
						if ($rootScope.toolBarSettings.showOperators) {
							$rootScope.toolBarSettings.theStyle.display = 'block';
						}
					}
				}

			}
		}])

});
