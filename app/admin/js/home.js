define (['angular',
	'controllers/content-ctrl',
	'controllers/side-nav-ctrl',
	'directives/upload-image-directive',
	'const/global-constants',
	'controllers/managerIndex-ctrl',
	'controllers/managerIndexView-ctrl',
	'services/managerIndex-service',
	'modules/noticeManage/services/noticeManage-service',
	'services/audition',
	'services/kendoui-constants',
	'restangular'
], function (angular, contentCtrl, sideNavCtrl, uploadImageDirective, globleConstant, managerIndexCtrl, managerIndexViewCtrl,
			 managerIndexService, noticeManageService) {
	'use strict';
	return angular.module ('app.home', ['restangular', 'kendo.ui.constants', 'auditionModule'])
		.controller ('topController', ['$rootScope', '$scope', '$timeout', '$window', 'KENDO_UI_EDITOR', '$compile',
		'KENDO_UI_WINDOW', 'KENDO_UI_TIP', 'TabService', '$http'
		, function ($rootScope, $scope, $timeout, $window, KENDO_UI_EDITOR, $compile, KENDO_UI_WINDOW, KENDO_UI_TIP, TabService, $http) {

			/////////////////////////////////////////
			/////////// 属性//////////////////////////
			//////////////////////////////////////////
			$scope.node = {TIPWindow: null};
			$scope.model = {TIPWindow: {typeConfirm: true, title: '', message: ''}};
			/*页面ui的基础配置*/
			$scope.ui = {TIPConfig: KENDO_UI_WINDOW, Tip: KENDO_UI_TIP, editor: KENDO_UI_EDITOR};
			/* 切换左边的菜单栏要用的样式属性 */
			$rootScope.sideStyle = {};
			$rootScope.contentStyle = {};
			$rootScope.showMenu = true;

			/**
			 * 全局定义属性方法给后续的子模块调用
			 * @type {{closeRightAway: boolean, confirmDialogFn: null, typeConfirm: boolean, reload: Function,
			 *     reloadWithParam: Function, closeWindow: Function, toggleSideNav: Function, currentState: string,
			 *     isCurrentState: Function, showTip: Function, stateGo: Function, alert: Function, confirm: Function}}
			 */
			$rootScope.globle = {

				// 富文本配置项
				editor: {
					imgWidth: 100,// 默认图片展示宽度
					imgHeight: 100, // 默认图片高度
					editorInstance: null, // 当前选中的富文本对象
					insertImage: undefined,
					/**
					 * 获取富文本的上传图片的窗体
					 */
					getWindow: function () {
						return $rootScope.globle.editor.uploadImageWindow;
					},
					/**
					 * 富文本取消上传图片的操作,数据信息
					 */
					cancel: function () {
						this.clearData ();
					},

					destroyEditorWindow: function () {
						var editorWindow = this.getWindow ();
						editorWindow.close ();
						$timeout (function () {
							editorWindow.destroy ();
						}, 500);
					},

					/**
					 * 往编辑器里面插入添加的图片
					 * @returns {boolean}
					 */
					insertInto: function () {
						if (!$rootScope.globle.editor.insertImage) {
							$rootScope.globle.showTip ('请选择图片', 'warning');
							return false;
						}
						var editor = $rootScope.globle.editor,
							range = editor.editorInstance.getRange (),
							img = document.createElement ('img');
						img.src = globleConstant.showImageUrl + '/tempfile/' + $rootScope.globle.editor.insertImage.jsonBody[0].saveFile;
						img.width = $rootScope.globle.editor.imgWidth;
						img.height = $rootScope.globle.editor.imgHeight;
						range.insertNode (img);
						editor.editorInstance.focus ();
						this.clearData ();
					},

					/**
					 * 销毁上传图片窗体并清空数据
					 */
					clearData: function () {
						this.destroyEditorWindow ();
						this.imgHeight = 100;
						this.imgWidth = 100;
						this.editorInstance = null;
						this.insertImage = undefined;
					},
					windowConfig: {
						modal: true,
						title: false,
						content: 'templates/common/editor-upload-image.html',
						resizable: false,
						draggable: false,
						open: function () {
							var $this = this.element,
								$parent = $this.parent ();
							$parent.css ({
								top: '50%', left: '50%',
								marginTop: '-' + (410 / 2) + 'px',
								marginLeft: '-' + (400 / 2) + 'px',
								position: 'fixed!important'
							});
						}
					}
				},
				closeRightAway: false,
				confirmDialogFn: null,
				typeConfirm: false,
				/**
				 * 刷新路由状态
				 * @param view
				 */

				reload: function (view) {
					$state.reload (view);
				},

				/**
				 * 带参数刷新路由状态
				 * @param view
				 * @param params
				 */

				reloadWithParam: function (view, params) {
					$state.transitionTo (view, params, {
						reload: true, inherit: false, notify: true
					});
				},

				/**
				 * 关闭打开的窗口
				 */
				closeWindow: function () {
					if (this.confirmDialogFn && this.typeConfirm) {
						this.confirmDialogFn ();
					}
					$scope.node.TIPWindow.close ();
					this.confirmDialogFn = null;
				},
				/**
				 * 切换左侧导航蓝
				 */
				toggleSideNav: function () {
					$rootScope.showMenu = !$rootScope.showMenu;
					var marginLeft = $rootScope.showMenu ? 0 : -250;
					$rootScope.sideStyle['margin-left'] === '-250px' ? $rootScope.sideStyle = {} : $rootScope.sideStyle = {'margin-left': '-250px'};
					$rootScope.contentStyle['margin-left'] = $rootScope.sideStyle['margin-left'] === '-250px' ? 0 : '250px';
					$rootScope.$broadcast('events:changeSideWidth', marginLeft);
				},
				/**
				 * 当前状态， 默认为states.home {首页}
				 */
				currentState: 'states.home',
				/**
				 * 判断是否是当前状态
				 * @param param
				 * @returns {boolean}
				 */
				isCurrentState: function (param) {
					return this.currentState === param;
				},

				/**
				 * 展示tip
				 * @param message
				 * @param type
				 */
				showTip: function (message, type) {
					var tip = _getTip ();
					tip.show ({message: message}, type);
				},

				/**
				 * 伪装状态跳转
				 * @param where
				 * @param title
				 * @param params
				 */
				stateGo: function (where, title, params, parentView) {
					TabService.appendNewTab (title, where, params, parentView);
				},
				/**
				 * 弹窗
				 * @param title
				 * @param message
				 */
				alert: function (title, message) {
					resetWindow (0, title, message);
				},
				/**
				 * 确定框
				 * @param title
				 * @param message
				 * @param fn
				 */
				confirm: function (title, message, fn) {
					this.confirmDialogFn = fn;
					resetWindow (1, title, message);
				}

			};

			/**
			 * 获取tip
			 * @returns {*}
			 * @private
			 */
			function _getTip () {
				return $scope.node['notification_tip'];
			}

			/**
			 * 重新设置弹窗的内容
			 * @param type
			 * @param title
			 * @param message
			 */
			function resetWindow (type, title, message) {
				$scope.model.TIPWindow.title = title;
				$scope.model.TIPWindow.message = message;
				$timeout (function () {
					$scope.node.TIPWindow.open ();
				});
				$rootScope.globle.typeConfirm = type;
			}

			////////////////////////////////////////////////////////
			//////// 设置富文本的上传图片的按钮样式以及触发后弹窗////////
			///////////////////////////////////////////////////////
			$scope.ui.editor.tools[$scope.ui.editor.tools.length] = {
				name: 'insertImage',
				tooltip: '插入图片',
				exec: function exec (e) {
					$rootScope.globle.editor.editorInstance = $ (this).data ("kendoEditor");
					// 清空数据

					angular.element ('body').append ($compile ('<div kendo-window="globle.editor.uploadImageWindow" k-options="globle.editor.windowConfig"></div>') ($rootScope));
					return false;
				}
			};
		}
	])

		.controller ('app.home.contentCtrl', contentCtrl)
		.controller ('app.home.managerIndexCtrl', managerIndexCtrl)
		.controller ('app.home.managerIndexViewCtrl', managerIndexViewCtrl)
		.controller ('app.home.sideNavCtrl', sideNavCtrl)
		.factory ('managerIndexService', managerIndexService)
		.factory ('noticeManageService', noticeManageService)
		.directive ('uploadImage', uploadImageDirective);
});
