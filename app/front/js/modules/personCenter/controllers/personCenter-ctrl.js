define (function () {
	'use strict';
	return ['$scope', 'HB_notification', '$timeout', function ($scope, HB_notification, $timeout) {
		$scope.name = '草泥马';

		$scope.title = '测试demo';
		$scope.navs = [
			{name: 'test1', url: 'states.personCenter.test1'},
			{name: 'test2', url: 'states.personCenter.test2'},
			{name: 'test3', url: 'states.personCenter.test3'}
		];

		$scope.endScroll = function () {
			return $timeout (function () {
				$scope.testArray.push (new Date ().getTime ());
			}, 1000);
		}

		$scope.endScroll1 = function () {
			return $timeout (function () {
				$scope.testArray1.push (new Date ().getTime ());
			}, 1000);
		}
		$scope.showDatePicker = function ($e) {
			$scope.status.opened = !$scope.status.opened;
			$e.stopPropagation ();
		};

		$scope.tempUrl = 'templates/common/datepicker.html';

		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function () {
			console.log ('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;
		$scope.test = '测试自定义内容的dialog';
		$scope.moduleDialog = function () {
			// 默认地址templates/common/temp.html
			HB_notification.moduleDialog ($scope, 'templates/common/temp.html' /**内容模板的地址*/);
		};

		$scope.dialog = function (type) {

			if (angular.equals (type, 'confirm')) {
				HB_notification[type] ('事实上confirm', function () {
					window.console.log ('啛啛喳喳');
				});
			} else if (angular.equals (type, 'content')) {
				HB_notification[type] ($scope, '这是标题', 'views/personCenter/testContent.html');
			} else {
				HB_notification[type] ('事实上');
			}
		};

		$scope.tip = function (type) {
			HB_notification.showTip ('这个是一个长Tip', type);
		};


		$scope.lessons = [
			1, 2, 3, 4, 5, 6, 7, 8,
			1, 2, 3, 4, 5, 6, 7, 8,
			1, 2, 3, 4, 5, 6, 7, 8];

		$scope.loadMore = function () {
			return $timeout (function () {
				var last = $scope.lessons[$scope.lessons.length - 1];
				for (var i = 1; i <= 8; i++) {
					$scope.lessons.push (last + i);
				}
			}, 2000);
		};
	}];
});
