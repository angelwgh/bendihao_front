define (function (homeModule) {
	'use strict';
	return ['$scope', function ($scope) {
		$scope.name = "首页";

		$scope.events = {
			openConfirm: function () {
				$scope.globle.confirm ('我是', '傻逼', function () {
					$scope.globle.showTip ('事实上', 'error');
				})
			}
		}

	}];
});
