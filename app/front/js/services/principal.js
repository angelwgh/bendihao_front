/**
 * Created with IntelliJ IDEA.
 * User: wengpengfei
 * Date: 2015/5/29
 * Time: 14:13
 */

define (function () {
	'use strict';

	var authorizationSystem = angular.module ('AuthorizationSystem', []);

    authorizationSystem.factory('hbBasicData', ['$http', 'HBInterceptor', function ($http, HBInterceptor) {
        var hbBasicData = {
            menuList: [],
            imageSourceConfig: {}
        };
        hbBasicData.getMenuList = function () {
            return $http.get('/web/sso/userMenuAuth', {
                params: {type: HBInterceptor.getAppString()}
            });
        };
        return hbBasicData;
    }]);

	authorizationSystem.factory ('authorize', ['$window', '$http', '$rootScope',
		function ($window, $http, $rootScope) {
			var isDefined = angular.isDefined;
			return {
				DEV_MODE_FOR_PERMIT: true,
				/**
				 * 设置登录状态
				 * @param login 是否登录
				 */
				"setLogin": function (login) {
					this.getSessionStorage ()
						.setItem ('isLogged', login);
				},
				/**
				 * 判断permission是否在权限列表permissionList当中
				 * @param permissionList
				 * @param permission
				 * @returns {boolean}
				 */
				"existPermission": function (permissionList, permission) {
					return !(typeof permissionList[permission] === 'undefined');
				},

				/**
				 * 从后端获取当前角色下面的所有权限
				 *      1.将返回的js对象转换成json字符串
				 * @returns {HttpPromise} 返回promise
				 */
				"setPermissions": function (url) {
					var remoteUrl = url || 'datas/authorities.json',
						promise = $http.get (remoteUrl),
						that = this;
					promise.success (function (data) {
						that.getSessionStorage ()
							.setItem ('authorizeList',
							angular.toJson (data['info']));
						$rootScope.$broadcast ('permissionsChanged')
					});
					return promise;
				},

				/**
				 * sessionStorage当中保存的数据以键值保存， 值是字符串，所以获取到的要转成json，
				 * 返回js对象
				 * @returns {*|Object|Array|string|number}
				 */
				"getPermissions": function () {
					var authorizeListObj,
						als = this.getAuthorizeListStr ();
					if (als) {
						authorizeListObj = angular.fromJson (als);
					}
					return authorizeListObj;
				},

				"getAuthorizeListStr": function () {
					var storage = this.getSessionStorage (),
						authorizeListStr = storage.getItem ('authorizeList')
					return authorizeListStr;
				},

				"initOrNot": function () {
					var als = this.getAuthorizeListStr ();
					return isDefined (als);
				},

				/**
				 * 获取sessionStorage
				 * @returns {Storage}
				 */
				"getSessionStorage": function () {
					return $window.sessionStorage;
				},

				/**
				 * 判断是否登录
				 * @returns {*|boolean}
				 */
				"isLogon": function () {
					var isLogged = this.getSessionStorage ().getItem ('isLogged');
					return angular.isDefined (isLogged)
						&& isLogged !== '' && isLogged !== 'false';
				},

				/**
				 * 判断是否有这个权限显示某个动作
				 * @param permission
				 * @returns {*|boolean}
				 */
				"hasPermissionDo": function (permission) {
					return this.existPermission (this.getPermissions (), permission);
				},

				/**
				 * 判断当前的路由状态是否需要进行用户验证登录
				 * @param state
				 * @returns {{status: boolean}}
				 */
				"needCheckState": function (state) {
					//console.log(state);
					if (!isDefined (state.access)) {
						return false;
					}
					return state.access['requireLogin'];
				}
			}
		}]);

	authorizationSystem.run (['$http', '$rootScope', 'authorize', 'hbBasicData',
		function ($http, $rootScope, authorize, hbBasicData) {
			$rootScope.showApp_$$ = false;
			$http.get ('../FxbManager/userController/userInfo')
				.then (function (data) {
				if (data.data.state === 1) {
					if (data.data.jsonBody) {
						if (data.data.jsonBody.userId === null || data.data.jsonBody.userId === '') {
							window.location.href = '/login/login.html';
						} else {
							$rootScope.showApp_$$ = true;
							$rootScope.$$userInfo = data.data.jsonBody;
							//$rootScope.$$userInfo = data.data.info;
							hbBasicData.imageSourceConfig.uploadImageUrl = data.data.jsonBody['resourceServicePath'];
						}
					}
				} else {
					$rootScope.showApp_$$ = false;
				}
			});

			// 路由开始转换的时候触发事件
			$rootScope.$on ('$stateChangeStart', function (e, toState) {
				// 模拟设置当前为登录状态
				authorize.setLogin (false);

				authorize.setPermissions ()
					.then (function () {
					var needLogin =
							authorize.needCheckState (toState),
						isLogin = authorize['isLogon'] ();

					if (!isLogin && needLogin) {
						e['preventDefault'] ();
						$state.go ('login');
					}
				});
			});
		}]);

	/**
	 * 定义指令hasPermission
	 * @example <div has-permission="code"></div>
	 *      code为后台返回的数据当中权限的唯一的权限编码
	 */

	authorizationSystem.directive ('hasPermission', ['authorize', function (authorize) {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				var permission = attrs['hasPermission'];

				/**
				 * 必须有设置内容
				 */
				if (!angular.isDefined (permission) || permission === '') {
					console.log ('%c hasPermission必须提供mark', 'color:red; font-size: 18px;font-weight: bold;');
					return false;
				}
				/**
				 * 必须为字符串
				 */
				if (!angular.isString (permission)) {
					console.log ('%c hasPermission 的值必须为字符串', 'color:red; font-size: 18px;font-weight: bold;');
					return false;
				}

				function togglePermission () {
					var hasPermit = authorize.hasPermissionDo (permission);
					if (!hasPermit) {
						element.addClass ('hide');
					} else {
						element.removeClass ('hide');
					}
				}

				if (!authorize.DEV_MODE_FOR_PERMIT) {
					togglePermission ();
				}

				// 监听权限列表发生变化事件
				scope.$on ('permissionsChanged', togglePermission);
			}
		}
	}]);
});
