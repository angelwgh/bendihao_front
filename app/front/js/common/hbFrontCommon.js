/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/18
 * 时间: 11:54
 *
 */

define (['angular'], function (angular) {

	var hbFrontCommon = angular.module ('hbFrontCommon', []);

	hbFrontCommon.directive ('messageWarner', messageWarner);

	hbFrontCommon.factory ('messageService', messageService);
	messageService.$inject = ['$http'];
	function messageService ($http) {
		var getMessageUrl = 'http://192.168.1.72:3000/messages';
		this.getMessages = function () {
			return $http.get (getMessageUrl);
			//return [];
		};
		return this;
	}

	messageWarner.$inject = ['$interval', 'messageService', '$timeout'];
	function messageWarner ($interval, messageService, $timeout) {
		var messageWarnerDirective = {
			restrict: 'A',
			replace: true,
			templateUrl: 'templates/common/message.html',
			scope: {
				clearMessagesModel: '=',
				msgNumberShown: '='
			}
		};
		messageWarnerDirective.controller = ['$scope', '$interval', 'messageService', function ($scope, $interval, messageService) {
			$scope.messages = [];
			$scope.interval = $interval (function () {
				messageService.getMessages ().success (function (data) {
					$scope.messages = $scope.messages.concat (data);
					$scope.msgNumberShown = $scope.messages.length;
				})
			}, 3000);

			$scope.watchInstance_clear = $scope.$watch ('clearMessagesModel', function () {
				if ($scope.clearMessagesModel === 0) {
					$scope.msgNumberShown = 0;
					$scope.setMessageNullTimer = $timeout (function () {
						$scope.messages = [];
						$timeout.cancel ($scope.setMessageNullTimer);
					}, 1000).$$timeoutId;
					$scope.currentMessageIndex = 0;
					$scope.showMessageContent = false;
					$scope.clearMessagesModel = 1;
				}
			});
			$scope.watchInstance = $scope.$watch ('messages.length',
				function () {
					$scope.showMessageContent = true;
				});

			$scope.$on ('$destroy', function () {
				$interval.cancel ($scope.interval);
				$scope.watchInstance ();
				$scope.watchInstance_clear ();
			})
		}];

		messageWarnerDirective.link = function ($scope, $element, $attr) {
			$scope.currentMessageIndex = 0;
			$scope.showMessageContent = false;
			$scope.prev = function ($e) {
				$e.preventDefault ();
				if ($scope.currentMessageIndex === 0) {
					return false;
				} else {
					$scope.currentMessageIndex--;
				}

			};
			$scope.next = function ($e) {
				$e.preventDefault ();
				if ($scope.currentMessageIndex + 1 === $scope.messages.length) {
					return false;
				} else {
					$scope.currentMessageIndex++;
				}
			};
			$scope.close = function ($e) {
				$e.preventDefault ();
				$scope.currentMessageIndex = 0;
				$scope.showMessageContent = false;
			};
		};

		return messageWarnerDirective;
	}
});