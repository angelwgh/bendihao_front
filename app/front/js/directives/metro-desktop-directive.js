/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/4
 * 时间: 14:18
 *
 */

define (['angular'], function (angular) {
	'use strict';
	var DeskTop = angular.module ('DeskTop', []);
	DeskTop.factory ('menuService', ['$http', 'hbBasicData', function ($http, hbBasicData) {
var datasMenu = {data: [
									{
										"name": "个人中心",
										"bgColor": "#63c53c",
										"icon": "personCenter.png",
										"tip": "个人中心",
										"width": "300",
										"height": "300",
										"size": "middle",
										"menuId": "nunununun300",
										"url": "states.personInfo.basicInfo"
									},
									{
										"name": "广告管理",
										"bgColor": "#6d7ddd",
										"icon": "myExam.png",
										"tip": "广告管理",
										"width": "300",
										"height": "300",
										"menuId": "nunununun300",
										"size": "middle",
										"url": "states.exam.all"
									},
									{
										"name": "意见反馈",
										"bgColor": "#de566e",
										"icon": "feedback.png",
										"tip": "意见反馈",
										"size": "middle",
										"width": "300",
										"height": "300",
										"menuId": "nunununun300",
										"url": "states.feedback"
									}
								]};
		var menuService = {},
			PAGE_NUMBER = [12];
		menuService.onePageWidth = 1125;

		menuService.loadMenu = function () {
			//return hbBasicData.getMenuList();
			return {then: function(callback){
				callback(datasMenu);
			}};
		};

		menuService.getPageCord = function (element) {
			var cord = {x: 0, y: 0};
			while (element) {
				cord.x += element.offsetLeft;
				cord.y += element.offsetTop;
				element = element.offsetParent;
			}
			return cord;
		};

		menuService.getOffset = function (event) {
			var target = event.target, // 当前触发的目标对象
				eventCord,
				pageCord,
				offsetCord;

			// 计算当前触发元素到文档的距离
			pageCord = menuService.getPageCord (target);

			// 计算光标到文档的距离
			eventCord = {
				X: window.pageXOffset + event.clientX,
				Y: window.pageYOffset + event.clientY
			};

			// 相减获取光标到第一个定位的父元素的坐标
			offsetCord = {
				X: eventCord.X - pageCord.x,
				Y: eventCord.Y - pageCord.y
			};
			return offsetCord;
		};

		menuService.rebuildDataInfo = function (data) {
			var temp = [];
			angular.forEach (PAGE_NUMBER, function (index) {
				temp.push (_.take (data, index));
				data = _.drop (data, index);
			});
			return temp;
		};

		menuService.getRandomColor = function () {
			return '#' + ('00000' + (Math.random () * 0x1000000 << 0).toString (16)).slice (-6);
		};

		return menuService;
	}]);

	DeskTop.directive ('hbDesktop', ['menuService', '$timeout', function (menuService, $timeout) {
		return {
			restrict: 'AE',
			controller: ['$scope', '$element', function ($scope, $element) {
				$scope.currentPageIndex = 0;
				$scope.groupStyle = {left: 0};

				$scope.changePage = function (to) {
					if (to <= -1) {
						return false;
					}
					if (to >= menuService.pageSize) {
						return false;
					}
					$scope.currentPageIndex = to;
					$scope.groupStyle.left = (-1 * ( $scope.currentPageIndex * menuService.onePageWidth )) + 'px';
				};

				function thenDo (data) {
					$scope.menus = menuService.rebuildDataInfo (data.data);
					menuService.pageSize = $scope.menus.length;
				}

				function bindEvent () {
					$timeout (function () {
						var menuPageLength = menuService.pageSize,
							elements = $element.find ('div.app-cont'),
							nowContainerWidth = menuPageLength * menuService.onePageWidth;

						$scope.desktopStyle = {
							width: nowContainerWidth + 'px'
						};

						elements.on ('mouseenter', function (e) {
							flowMagicOver (e);
						});

						elements.on ('mouseleave', function (e) {
							flowMagicOver (e);
						});
					});
				}
				
				//$scope.menus = datasMenu;
				//menuService.pageSize = $scope.menus.length;
				var loaMenu_ = menuService.loadMenu ();

				loaMenu_.then (thenDo);

				loaMenu_.then (bindEvent);

			}]
		};


		function setSpos (top, left) {
			return {top: top + 'px', left: left + 'px'};
		}

		/**
		 * 动画到哪里
		 * @param desc
		 * @param spos
		 */
		function animateWhere (desc, spos) {
			desc.animate (spos, "fast");
		}

		/**
		 * 一些东西动画效果
		 * @param desc
		 * @param spos
		 * @param epos
		 */
		function animateSometing (desc, spos, epos) {
			desc.css (spos).animate (epos, "fast").find ('span').css ({paddingLeft: '110px'}).animate ({paddingLeft: '85px'});
		}

		/**
		 * 完成所有事件的函数
		 * @param out
		 * @param desc
		 * @param spos
		 * @param epos
		 */
		function doAll (out, desc, spos, epos) {
			if (out) {
				animateWhere (desc, spos);
			} else {
				animateSometing (desc, spos, epos);
			}
		}

		function flowMagicOver (e) {
			var $this = $ (e.target).closest ('div.app-cont'),
				_desc, width = $this.width (), height = $this.height (),
				cursorLeft = e.offsetX === undefined ? menuService.getOffset (e).X : e.offsetX,
				cursorTop = e.offsetY === undefined ? menuService.getOffset (e).Y : e.offsetY,
				cursorRight = width - cursorLeft,
				cursorBottom = height - cursorTop,
				_min = Math.min (cursorLeft, cursorTop, cursorRight, cursorBottom),
				_out = e.type === 'mouseleave', rect = {};

			_desc = $this.find (".adv-hover").stop (true);

			rect[cursorLeft] = function (epos) { //鼠从标左侧进入和离开事件
				doAll (_out, _desc, setSpos (0, -width), epos);
			};

			rect[cursorTop] = function (epos) { //鼠从标上边界进入和离开事件
				doAll (_out, _desc, setSpos (-height, 0), epos);
			};

			rect[cursorRight] = function (epos) { //鼠从标右侧进入和离开事件
				doAll (_out, _desc, setSpos (0, width), epos);
			};

			rect[cursorBottom] = function (epos) { //鼠从标下边界进入和离开事件
				doAll (_out, _desc, setSpos (height, 0), epos);
			};

			// firefox 下面执为NAN
			rect[_min] ({left: 0, top: 0}); // 执行对应边界 进入/离开 的方法
		}
	}]);

	DeskTop.directive ('hbToolBar', ['$state', function ($state) {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				title: '=title'
			},
			template: ['<div class="header">',
				'<div class="wrap clearfix">',
				'<a ui-sref="^.home" class="h-btn btn-min" title="桌面"></a>',
				'<a ui-sref="^.home" class="h-btn btn-close" title="关闭"></a>',
				'<div class="title">b{{title}}</div>',
				'</div>',
				'</div>'].join (''),
			link: function ($scope) {
				$scope.back = function () {
					$window.history.back ();
				}
			}
		}
	}]);

	DeskTop.directive ('hbNavigation', ['$rootScope', 'menuService', function ($rootScope, menuService) {
		return {
			restrict: 'AE',
			scope: {
				navigation: '=navs',
				title: '=title'
			},
			replace: true,
			template: ['<div class="list-nav pull-left">',
				'<ul class="list-nav-ul">',
                //'<li ng-if="title"><a href="javascript:void(0)" class="list-nav-tit">b{{title}}</a></li>',
				'<li ng-repeat="nav in navigation"><a ui-sref="b{{nav.url}}" ng-class="{\'list-nav-current\': $state.includes(\'b{{nav.url}}\')}">b{{nav.name}}</a></li>',
				'</ul>',
				'</div>'].join (''),
			link: function ($scope, $element, $attributes) {
				$scope.$state = $rootScope.$state;
				$scope.$stateParams = $rootScope.$stateParams;
			}
		}
	}]);

    DeskTop.directive('courseStudyBar', [function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            template: ['<div class="header">',
                '<div class="wrap clearfix">',
                '<a ui-sref="^.home" class="h-btn btn-min" title="桌面"></a>',
                '<a ui-sref="^.home" class="h-btn btn-close" title="关闭"></a>',
                '<div class="title">在学课程</div>',
                '</div>',
                '</div>'].join(''),
            link: function ($scope, $element, $attributes) {

            }
        }
    }]);

    DeskTop.directive('courseStudy', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            controller: ['$scope', function ($scope) {
                $scope.submenu = false;
                if ($rootScope.viewId == 1) {
                    $scope.submenu = true;
                }
                $scope.method = {
                    showsubmenu: function (event) {
                        event.stopPropagation();
                        if ($scope.submenu) {
                            $scope.submenu = false;
                        } else {
                            $scope.submenu = true;
                        }
                    },
                    stopEvent: function (event) {
                        event.stopPropagation();
                    }
                };
            }],
            scope: {
                navigation: '=navs'
            },
            replace: true,
            template: ['<div class="list-nav pull-left">',
                '<ul class="list-nav-ul">',
                '<li><a ui-sref="states.courseStudy.basicCourseStudy" ng-class="{\'list-nav-current\': $state.includes(\'states.courseStudy.basicCourseStudy\')}">在学课程</a></li>',
                '<li ng-click="method.showsubmenu($event)"><a href="javascript:void(0)" ng-class="{\'list-nav-current\': $state.includes(\'states.courseStudy.jobCompulsory || states.courseStudy.compulsoryCourse\')}">在学必修课<span  ng-class="{\'ico ico-close\':submenu, \'ico ico-open\': !submenu}"></span></a>',
                '<ul class="sub-list-nav" ng-if="submenu">',
                '<li ng-click="method.stopEvent($event)"><a ui-sref="states.courseStudy.jobCompulsory" ng-class="{\'list-nav-current\': $state.includes(\'states.courseStudy.jobCompulsory\')}">在学岗位课</a></li>',
                '<li ng-click="method.stopEvent($event)"><a ui-sref="states.courseStudy.compulsoryCourse" ng-class="{\'list-nav-current\': $state.includes(\'states.courseStudy.compulsoryCourse\')}">在学尊享课</a></li>',
                '</ul>',
                '</li>',
                '<li><a ui-sref="states.courseStudy.electiveCourse" ng-class="{\'list-nav-current\': $state.includes(\'states.courseStudy.electiveCourse\')}">在学选修课</a></li>',
                '</ul>',
                '</div>'].join(''),

            link: function ($scope, $element, $attributes) {
                $scope.$state = $rootScope.$state;
                $scope.$stateParams = $rootScope.$stateParams;
            }
        }
    }]);
});
