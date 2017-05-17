/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/18
 * 时间: 9:45
 *

 */

define (['lodash'], function (_) {
	'use strict';

	/**
	 * 指令为适应产品需求设定tab，kendo当中无法根据需求定义需要的功能，所以重写tab指令，
	 * 使用这个指令的一些规则:
	 *            1. 在需要这个tab的页面添加 <div tab-stan source="model.tabList"></div> 标签
	 *            2. source 指定这个tab默认展示的tab
	 *            3. 在首页a标签当中调用全局暴露的方法
	 *                          $rootScope.globle.appendNewTab(title -- 标题, where -- xx-state.js当中配置的view的名称);
	 *
	 */
	return ['$rootScope', '$timeout', '$window', '$compile', '$state', '$http', '$q', 'futureStates', 'TabService', '$stateParams',
		function ($rootScope, $timeout, $window, $compile, $state, $http, $q, futureStates, TabService, $stateParams) {
			return {
				restrict: 'A',
				replace: true,
				controller: ['$scope', function ($scope) {

					$scope.$state = $state;

					TabService.from = "0";
					// 设置默认的状态为home并且这个home不可关闭
					this.defaultView = 'states.home';
					TabService.HB_TAB = $scope.HB_TAB = {
						views: [],
						currentTab: this.defaultView,
						tabs: [
							{
								name: '首页',
								viewName: this.defaultView,
								position: 'index',
								closeAble: false,
								subs: [],
								activeView: {stateName: this.defaultView, params: undefined}
							}
						]
					};

					$rootScope.$on ('$stateChangeSuccess', function (a, currentState) {
						if (TabService.from === "0") {
							TabService.from = "1";
						} else {
							var theView = findView ($scope.HB_TAB.currentTab);
							if (theView) {
								theView.activeView.stateName = currentState.name;
								theView.activeView.params = angular.copy ($stateParams);
							}
						}
					});
					// -------------------

					/**
					 *  关闭tab的时候触发的事件
					 * @param $e
					 * @param index
					 * @param viewName
					 */
					$scope.closeTab = function ($e, index, viewName) {
						TabService.from = "0";
						$scope.HB_TAB.tabs.splice (index, 1);
						var preTab = $scope.HB_TAB.tabs[0];
						$scope.HB_TAB.currentTab = preTab.viewName;
						$timeout (function () {
							$state.go (preTab.activeView.stateName, preTab.activeView.params);
						}, 200);
						// 停止冒泡活动
						$e.stopPropagation ();
					};

					// 默认跳转到home页面去。 参数内容为空
					changeCurrent (this.defaultView, {});

					/**
					 * 根据view查询当前存在的view集合中是否存在这个view的对象， 返回
					 * @param view
					 * @returns {*}
					 */
					function findView (view) {
						return _.find ($scope.HB_TAB.tabs, function (item) {
							return item.viewName === view;
						});
					}


					/**
					 * d切换当前的状态为哪一个
					 * @param view
					 * @param params
					 */
					function changeCurrent (view, params) {
						return $state.go (view, params);
					}

					TabService.appendNewTab = function (title, view, params, parentView, closeAble) {
						var storeState = findView (parentView || view);
						TabService.from = "0";
						if (!storeState) {
							$scope.HB_TAB.tabs.push (
								{
									name: title, viewName: parentView || view,
									params: params,
									activeView: {stateName: view, params: params},
									closeAble: closeAble || true
								}
							);
						} else {
							storeState.params = params;
							storeState.activeView = {stateName: view, params: params};
						}

						$scope.HB_TAB.currentTab = parentView || view;
						changeCurrent (view, params);

					};

					$scope.clickTab = function ($e, view, params, exactlyView) {
						TabService.from = "0";
						$scope.HB_TAB.currentTab = exactlyView;
						changeCurrent (view, params);
						$e.preventDefault ();
					}
				}],
				templateUrl: 'templates/common/tab-directive.html'
			}
		}];
});
