define(function () {
    'use strict';
    return ['$scope', 'TabService', 'hbBasicData',
        function ($scope, TabService, hbBasicData) {
            $scope.model = {menuList: []};

            var data = [
                          {
                            "name": "首页",
                            "state": "states.home",
                            "menuIcon": "ico-1"
                          },
                          {
                            "name": "类别管理",
                            "state": "states.category",
                            "menuIcon": "ico-2"
                          },
                          {
                            "name": "商铺管理",
                            "menuIcon": "ico-3",
                            "subs": [
                              {
                                "name": "商铺信息管理",
                                "state": "states.shopManager",
                                "menuIcon": "ico-1"
                              },
                              {
                                "name": "商铺产品管理",
                                "state": "states.courseResourcesManager",
                                "menuIcon": "ico-1"
                              },
                              {
                                "name": "商铺活动管理",
                                "state": "states.courseResourcesManager",
                                "menuIcon": "ico-1"
                              },
                              {
                                "name": "商铺招聘管理",
                                "state": "states.courseResourcesManager",
                                "menuIcon": "ico-1"
                              },
                              {
                                "name": "商铺员工管理",
                                "state": "states.courseResourcesManager",
                                "menuIcon": "ico-1"
                              }
                            ]
                          },
                          {
                            "name": "二手物品",
                            "state": "states.feedback",
                            "menuIcon": "ico-4"
                          },
                          {
                            "name": "房产管理",
                            "state": "states.library",
                            "menuIcon": "ico-5"
                          },
                          {
                            "name": "网址导航",
                            "state": "states.orgManage",
                            "menuIcon": "ico-6"
                          },
                          {
                            "name": "推荐人统计",
                            "state": "states.recommendManager",
                            "menuIcon": "ico-8"
                          },
                          {
                            "name": "通知消息",
                            "state": "states.noticeManage",
                            "menuIcon": "ico-8"
                          },
                          {
                            "name": "用户管理",
                            "state": "states.personCenter",
                            "menuIcon": "ico-7"
                          }
            ];
            $scope.model.menuList =data;

            // 获取管理员有权限的菜单
            /*hbBasicData.getMenuList().then(function (data) {
                $scope.model.menuList = data.data;
            });*/

            $scope.model.isCurrent = false;
            $scope.model.currentTab = 'states.home';
            $scope.model.currentMenuName = '首页';

            $scope.events = {
                isCurrent: function (stateView) {
                    return TabService.HB_TAB.currentTab === stateView;
                },
                toggleSub: function ($e, menu, parentIsCurrentState, parentName) {
                    var $this = $($e.target),
                        $li = $this.closest('li');
                    $li.find('.ink').remove();
                    var $span = $('<span class="ink"></span>');
                    var daydayday = Math.max($li.outerWidth(), $li.outerHeight());

                    $li.css({position: 'relative', overflow: 'hidden'});
                    $span.css({
                        width: daydayday,
                        height: daydayday,
                        top: ($e.pageY - $li.offset().top - (daydayday / 2)) + 'px',
                        left: ($e.pageX - $li.offset().left - (daydayday / 2)) + 'px'
                    });
                    $li.append($span);
                    $span.addClass('animate-ink');

                    $scope.model.currentMenu = parentIsCurrentState;
                    $scope.model.currentMenuName = parentName;
                    menu.showSub = !menu.showSub;
                    if (menu.subs) {
                        if (menu.subs.length <= 0) {
                            return false;
                        }
                        return false;
                    }
                    $scope.globle.stateGo(menu.state, menu.name);
                }
            };
        }];
});
