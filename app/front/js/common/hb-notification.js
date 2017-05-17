/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/17
 * 时间: 17:30
 *
 */
define (['angular'], function (angular) {
	'use strict';

	var HB_notifications = angular.module ('HB_notifications', []);
	HB_notifications.factory ('HB_notification', __HB_notification);
	HB_notifications.directive ('hbNotificationConfirm', HB_confirm);
	HB_notifications.directive ('hbNotificationModuleDialog', Hb_ModuleDialog);
	HB_notifications.directive ('hbNotificationTip', Hb_tip);
	HB_notifications.directive ('hbNotificationAlert', HB_alert);
	HB_notifications.directive ('hbNotificationContent', Hb_ContentDialog);
	HB_notifications.directive ('hbNotification', Hb_notificationParent);

	__HB_notification.$inject = ['$compile', '$rootScope'];
	function __HB_notification ($compile, $rootScope) {
		var notificationService = {};

		notificationService.tips = [];

		function createModuleDialog (_scope, templateUrl) {
			notificationService.templateUrl = templateUrl || 'templates/common/temp.html';
			var domHtml = '<div hb-notification class="hb-notification"><div hb-notification-module-dialog></div></div>',
				compiled = $compile (domHtml),
				linkFn = compiled (_scope);
			angular.element ('body').append (linkFn);
		}

		function createContentDialog (_scope, title, contentUrl) {
			$rootScope.TIP_TITLE = title || '提示';
			notificationService.contentDialogContentUrlTemplate = contentUrl || 'templates/common/temp.html';
			var domHtml = '<div hb-notification class="hb-notification"><div class="mark"></div><div hb-notification-content></div></div>',
				compiled = $compile (domHtml),
				linkFn = compiled (_scope);
			angular.element ('body').append (linkFn);
		}

		function createDom (type, msg, arg) {
			var domHtml = '<div hb-notification class="hb-notification">';
			if (!angular.equals ('tip', type)) {
				$rootScope.TIP_TYPE = undefined;
			}
			switch (type) {
				case 'alert':
					domHtml += '<div class="mark"></div><div hb-notification-alert></div>';
					break;
				case 'confirm':
					domHtml += '<div class="mark"></div><div hb-notification-confirm></div>';
					break;
				case 'tip':
					domHtml += '<div hb-notification-tip></div>';
					break;
			}
			domHtml += '</div>';
			var compiled = $compile (domHtml),
				linkFn = compiled ($rootScope);
			$rootScope.TIP_TITLE = '提示';
			$rootScope.TIP_MSG = msg;

			if (!angular.isFunction (arg) && !angular.equals ('confirm', type)) {
				arg ? (function () {
					$rootScope.TIP_TYPE = arg
				}) () : undefined;
			} else {
				notificationService.confirmCallBackFunction = arg;
			}

			angular.element ('body').append (linkFn);
		}

		notificationService.alert = function (msg) {
			createDom ('alert', msg);
		};

		notificationService.confirm = function (msg, confirmFn) {
			createDom ('confirm', msg, confirmFn);
		};

		notificationService.showTip = function (msg, tipType) {
			createDom ('tip', msg, tipType);
		};

		notificationService.content = function (_scope, title, contentUrl) {
			$rootScope.TIP_TYPE = undefined;
			createContentDialog (_scope, title, contentUrl)
		};

		notificationService.moduleDialog = function (_scope, templateUrl) {
			createModuleDialog (_scope, templateUrl);
		};

		return notificationService;
	}

	Hb_notificationParent.$inject = ['HB_notification', '$timeout', '$q'];
	function Hb_notificationParent (HB_notification, $timeout, $q) {
		return {
			controller: function ($scope, $element) {
				var _this = this;
				$scope.fadeIn = true;
				this.closeWindow = function () {
					$scope.fadeIn = !$scope.fadeIn;
					HB_notification.openWindow.remove ();
				};

				this.confirmCertain = function () {
					if (!HB_notification.confirmCallBackFunction) {
						return false;
					}
					var defer = $q.defer (),
						promise = defer.promise;

					if (HB_notification.confirmCallBackFunction
						&& angular.isFunction (HB_notification.confirmCallBackFunction ())) {
						HB_notification.confirmCallBackFunction ();
					}
					defer.resolve ();

					promise.then (function () {
						_this.closeWindow ();
					});

					return promise;

				};

				if (HB_notification.openWindow) {
					this.closeWindow ();
				}

				function clearTips () {
					angular.forEach (HB_notification.tips, function (item) {
						item.remove ();
					});
					HB_notification.tips = [];
				}

				this.center = function ($dialog) {
					$timeout (function () {
						$scope.TIP_TYPE ? (function () {
							_this.addTip ($element);
							$dialog.css ({width: '150px'})
								.click (function () {
								$element.remove ();
							});
							$timeout.cancel (HB_notification.closeTimer);

							HB_notification.closeTimer = $timeout (function () {
								$element.remove ();
							}, 3000).$$timeoutId;
						}) () : (function () {
							$dialog.css ({width: '400px'});
						}) ();
						var elementWidth = $dialog.width (),
							elementHeight = $dialog.height ();
						$dialog.css ({
							top: '50%',
							left: '50%',
							marginLeft: (-1 * (elementWidth / 2)) + 'px',
							marginTop: (-1 * (elementHeight / 2)) + 'px'
						});
					});
				};

				this.addTip = function ($element) {
					clearTips ();
					HB_notification.tips.push ($element)
				}
			},
			link: function ($scope, $element, $attributes, controller) {

				HB_notification.openWindow = $element;

				$scope.closeWindow = controller.closeWindow;
			}
		}
	}

	HB_alert.$inject = [];
	function HB_alert () {
		return {
			replace: true,
			require: '?^hbNotification',
			template: ['<div class="dialog">',
				'<div class="dialog-body">',
				'<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
				'<div class="dialog-cont">b{{TIP_MSG}}</div>',
				'<div class="btn-center">',
				'<button type="button" class="btn btn-gr" ng-click="closeWindow()">确定</button>',
				'</div>',
				'</div>',
				'</div>'].join (''),
			link: function ($scope, $element, $attr, parentController) {
				parentController.center ($element);
			}
		}
	}

	HB_confirm.$inject = [];
	function HB_confirm () {
		return {
			replace: true,
			require: '?^hbNotification',
			template: ['<div class="dialog">',
				'<div class="dialog-body">',
				'<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
				'<div class="dialog-cont">b{{TIP_MSG}}</div>',
				'<div class="btn-center">',
				'<button type="button" class="btn btn-gr" ng-click="confirmCertain();">确定</button>',
				'<button type="button" class="btn btn-g" ng-click="closeWindow()">取消</button>',
				'</div>',
				'</div>',
				'</div>'].join (''),
			link: function ($scope, $element, $attr, parentController) {
				parentController.center ($element);
				$scope.confirmCertain = parentController.confirmCertain;
			}
		}
	}

	Hb_tip.$inject = [];
	function Hb_tip () {
		return {
			replace: true,
			require: '?^hbNotification',
			template: ['<div class="tip">',
				'<span class="ico ico-b{{TIP_TYPE}}"></span>',
				'<p>b{{TIP_MSG}}</p>',
				'</div>'].join (''),
			link: function ($scope, $element, $attr, parentController) {
				parentController.center ($element);
			}
		}
	}


	Hb_ModuleDialog.$inject = ['HB_notification'];
	function Hb_ModuleDialog (HB_notification) {
		return {
			replace: true,
			template: ['<div class="module-dialog">',
				'<div class="mark"></div>',
				'<div class="content">',
				'<div class="close-module-dialog" ng-click="closeWindow();"><span class="glyphicon glyphicon-remove"></span></div>',
				'<div class="main-tainer">',
				'<div ng-include="templateUrl"></div>',
				'</div>',
				'</div>',
				'</div>'].join (''),
			link: function ($scope) {
				$scope.templateUrl = HB_notification.templateUrl;
			}
		}
	}

	Hb_ContentDialog.$inject = ['HB_notification'];
	function Hb_ContentDialog (HB_notification) {
		return {
			replace: true,
			require: '?^hbNotification',
			template: ['<div class="dialog">',
				'<div class="dialog-body">',
				'<div class="dialog-tit">b{{TIP_TITLE}}<a href="javascript:void(0);" class="ico ico-close" ng-click="closeWindow();"></a></div>',
				'<div class="dialog-cont" ng-include="contentDialogContentUrlTemplate"></div>',
				'<div class="btn-center">',
				'<button type="button" class="btn btn-gr" ng-click="closeWindow()">确定</button>',
				'</div>',
				'</div>',
				'</div>'].join (''),
			link: function ($scope, $element, $attr, parentController) {
				$scope.contentDialogContentUrlTemplate = HB_notification.contentDialogContentUrlTemplate;
				parentController.center ($element);
			}
		}
	}


});
