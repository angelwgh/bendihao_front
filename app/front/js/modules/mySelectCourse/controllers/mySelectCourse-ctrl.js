define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'global',
        'mySelectCourseService',
        'HB_notification',
        '$timeout',
        '$state',
        function ($scope, $sce, global, mySelectCourseService, HB_notification, $timeout, $state) {
            $scope.format = "yyyy-MM-dd";
            $scope.status = {
                opened: false,
                endOpened: false
            };
            $scope.model = {
                //分页查询参数
                queryParam: {
                    courseCategoryId: "",//课程类别ID
                    courseName: "",//课程名称
                    lastStudyTimeStart: null,//最后学习时间开始
                    lastStudyTimeEnd: null,//最后学习时间结束
                    studyState: "-1",//学习状态,-1查询全部,0-未学习，1-学习中，2-学习完成
                    pageNo: 1,//页码
                    pageSize: 18//页大小
                },
                courseCategoryList: [],
                //保存课程信息
                courseInfo: {
                    courseId: '',//课程id
                    courseName: '',//课程名称
                    courseDescription: '',//课程描述
                    coursePhoto: '',
                    courseCategoryName: '',//课程分类名称
                    courseUploadTime: '',//课程上传时间
                    goodTime: '',//被赞次数
                    isGood: false,//是否已赞
                    finishPercent: '',//课程完成度
                    PreviousStudyTime: ''//上次学习时间
                },
                courseInfoList: []//保存课程信息列表数据
            };
            $scope.events = {};

            //页面控制显示隐藏的变量
            $scope.pageVar = {
                hasCourseCategory: false,//true显示公告列表，false显示默认图片
                hasCourse: false//true显示公告列表，false显示默认图片
            };

            //监控课程类别列表是否有数组（如果课程分类有数据，表示有课程（如果添加完之后没数据，类别列表也要显示））
            $scope.$watch('model.courseCategoryList.length', function (newValue, oldValue) {
                if (newValue > 0) {
                    $scope.pageVar.hasCourseCategory = true;
                } else {
                    $scope.pageVar.hasCourseCategory = false;
                }
            });
            //监控课程列表是否有数据
            $scope.$watch('model.courseInfoList.length', function (newValue, oldValue) {
                if (newValue > 0) {
                    $scope.pageVar.hasCourse = true;
                } else {
                    $scope.pageVar.hasCourse = false;
                }
            });

            //我的选修课查询课程类别（只在第一次加载页面时加载，后面都不再刷新）
            mySelectCourseService.findCourseCategory().then(function (data) {
                if (data.status) {
                    $scope.model.courseCategoryList = data.info;
                } else {
                    HB_notification.showTip('获取课程类别数据失败！', "error");
                }
            });
            //获取获取我的选修课数据
            mySelectCourseService.findByQuery($scope.model.queryParam).then(function (data) {
                if (data.status) {
                    angular.forEach(data.info,function(item){
                        item.courseShortName = item.courseName
                        if (item.courseShortName.length > 15) {
                            item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                        }
                    });
                    $scope.model.courseInfoList = data.info;
                } else {
                    HB_notification.showTip(data.info, "error");
                }
            });
            $scope.events = {
                returnParent: function ($e) {
                    $state.go('states.mySelectCourse').then(function () {
                        $state.reload();
                    })
                    $e.preventDefault();
                },
                //选择课程类别
                selectCourseCategory: function (e, categoryId) {
                    $scope.model.queryParam.courseCategoryId = categoryId;
                    $scope.events.findByQuery();
                },
                //按条件查询课程数据
                findByQuery: function () {
                    //e.stopPropagation();
                    $scope.model.courseInfoList=[];
                    $scope.model.queryParam.lastStudyTimeStart=$scope.model.queryParam.lastStudyTimeStart?$scope.events.formatDate(new Date($scope.model.queryParam.lastStudyTimeStart)):null;
                    $scope.model.queryParam.lastStudyTimeEnd=$scope.model.queryParam.lastStudyTimeEnd?$scope.events.formatDate(new Date($scope.model.queryParam.lastStudyTimeEnd)):null;
                    $scope.model.queryParam.pageNo = 1;//重置页码
                    if ($scope.model.courseCategoryList.length == 0) {
                        $scope.pageVar.hasCourseCategory = true;
                    }
                    //获取选课中心课程列表数据
                    mySelectCourseService.findByQuery($scope.model.queryParam).then(function (data) {
                        if (data.status) {
                            angular.forEach(data.info,function(item){
                                item.courseShortName = item.courseName
                                if (item.courseShortName.length > 15) {
                                    item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                                }
                            });
                            $scope.model.courseInfoList = data.info;
                        } else {
                            HB_notification.showTip(data.info, "error");
                        }
                    });
                },
                //主页面条件查询时在条件输入框回车提交查询
                pressEnterKey: function (e) {
                    if (e.keyCode == 13) {
                        $scope.events.findByQuery();
                    }
                },
                //滚动条加载更多事件
                findMore: function () {
                    //e.stopPropagation();
                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo + 1;//重置页码
                    //获取选课中心课程列表数据
                    return mySelectCourseService.findByQuery($scope.model.queryParam).then(function (data) {
                        if (data.status) {
                            angular.forEach(data.info,function(item){
                                item.courseShortName = item.courseName
                                if (item.courseShortName.length > 15) {
                                    item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                                }
                            });
                            Array.prototype.push.apply($scope.model.courseInfoList, data.info);
                            if (data.info.length == 0) {
                                $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo - 1;//页码减一
                            }
                        } else {
                            HB_notification.showTip(data.info, "error");
                        }
                    });
                },
                //删除选修课
                removeCourse: function (e, courseInfo) {
                    var delCourse = courseInfo;
                    HB_notification["confirm"]('亲，确定要删除选修课吗？', function () {
                        mySelectCourseService.removeCourse({courseId: courseInfo.courseId}).then(function (data) {
                            if (data.status) {
                                var index = $scope.model.courseInfoList.indexOf(delCourse);
                                if (index > -1) {
                                    $scope.model.courseInfoList.splice(index, 1);
                                }
                                //$scope.events.findByQuery(e);
                            } else {
                                HB_notification.showTip(data.info, "error");
                            }
                        });
                    });
                },
                //播放课程 1--试听（学员没选的播放是试听） 2--播放（学员选择之后的播放是播放）
                playCourse: function (e, courseId) {
                    var url = '/front/#/play/' + courseId + '/2/';
                    window.open(url)
                },
                //查看详情
                viewDetail: function (e, id) {
                    $state.go('states.courseDetail', {courseId: id});
                },
                //跳转添加选修课界面（选课中心）
                addChooseCourse: function (e) {
                    e.stopPropagation();
                    $scope.$state.go("states.mySelectCourse.add");
                },
                showDatePicker: function (e, type) {
                    e.stopPropagation();
                    if (1 == type) {
                        $scope.status.opened = !$scope.status.opened;
                    } else if (2 == type) {
                        $scope.status.endOpened = !$scope.status.endOpened;
                    }

                },

                //转换日期格式 yyyy-MM-dd HH:mm:ss
                formatDate:function (date) {
                        var y = date.getFullYear();
                        var m = date.getMonth() + 1;
                        m = m < 10 ? ('0' + m) : m;
                        var d = date.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        var h = date.getHours();
                        var minute = date.getMinutes();
                        var second=date.getSeconds();
                        h = h < 10 ? ('0' + h) : h;
                        minute = minute < 10 ? ('0' + minute) : minute;
                        second = second<10?('0'+second):second;
                    //+' '+h+':'+minute+':'+second
                        return y + '-' + m + '-' + d;
                }
            };
        }];
});
