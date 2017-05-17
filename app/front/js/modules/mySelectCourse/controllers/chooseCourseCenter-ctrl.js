define(function () {
    'use strict';
    return ['$scope',
        '$sce',
        'global',
        'chooseCourseCenterService',
        '$timeout',
        '$compile',
        'HB_notification',
        function ($scope, $sce, global, chooseCourseCenterService, $timeout, $compile, HB_notification) {

            var loadNode = [];//保存已加载过子节点的节点ID
            $scope.model = {
                //分页查询参数
                queryParam: {
                    courseCategoryId: '',//课程类别ID
                    courseName: '',//课程名称
                    orderType: '',//排序方式 0升序 1降序
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
                //课程列表
                courseInfoList: []//保存课程信息列表数据
            };
            $scope.events = {};

            //页面控制显示隐藏的变量
            $scope.pageVar = {
                hasQuery: false,//是否条件查询过
                hasCourse: false//true显示公告列表，false显示默认图片
            };

            /*//监控课程类别列表是否有数组（如果课程分类有数据，表示有课程（如果添加完之后没数据，类别列表也要显示））
             $scope.$watch('model.courseCategoryList.length', function (newValue, oldValue) {
             if (newValue > 0) {
             $scope.pageVar.hasCourseCategory = true;
             } else {
             $scope.pageVar.hasCourseCategory = false;
             }
             });*/

            //监控课程列表是否有数据
            $scope.$watch('model.courseInfoList.length', function (newValue, oldValue) {
                if (newValue > 0) {
                    $scope.pageVar.hasCourse = true;
                } else {
                    $scope.pageVar.hasCourse = false;
                }
            });

            //查询选课中心课程类别数据(异步加载)
            chooseCourseCenterService.GetCourseCategory({categoryId: ""}).then(function (data) {
                var htmls = "";
                if (data.status) {
                    angular.forEach(data.info, function (category) {
                        //||$("#class_'+category.id+'")===\'ico ico-open\'
                        htmls += '<li id="category_' + category.id + '"' +
                        'ng-class="{\'list-nav-current\':model.queryParam.courseCategoryId===\'' + category.id + '\'}">' +
                        '<a href="javascript:void(0);" ' +
                        'id="current_' + category.id + '" ' +
                        'ng-click="events.selectCourseCategory($event,\'' + category.id + '\',\'' + category.hasChildren + '\')"' +
                        '>' + category.name +
                        '<span class="ico ico-open" id="class_' + category.id + '" ' +
                        'ng-click="events.changeClass($event,\'' + category.id + '\')" ' +
                        'ng-show="' + category.hasChildren + '"></span>' +
                        '</a>' +
                        '</li>';
                    })
                    $("#category_all").append($compile(htmls)($scope));
                } else {
                    HB_notification.showTip(data.info, "error");
                }
            });

            //获取选课中心课程列表数据
            chooseCourseCenterService.findByQuery($scope.model.queryParam).then(function (data) {
                if (data.status) {
                    angular.forEach(data.info,function(item){
                        item.courseShortName = item.courseName
                        if (item.courseShortName.length > 15) {
                            item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                        }
                        if(item.courseContents.length>100){
                            item.courseContents=item.courseContents.substring(0,100)+"...";
                        }
                    });
                    $scope.model.courseInfoList = data.info;
                } else {
                    HB_notification.showTip(data.info, "error");
                }
            });

            $scope.events = {
                //查询选课中心课程类别数据(异步加载)
                getCourseCategory: function (e, categoryId) {
                    e.stopPropagation();
                    chooseCourseCenterService.GetCourseCategory({categoryId: categoryId}).then(function (data) {
                        if (data.status) {
                            $scope.model.courseCategoryList = data.info;
                        } else {
                            HB_notification.showTip(data.info, "error");
                        }
                    });
                },
                changeClass: function (e, id) {
                    e.stopPropagation();
                    //获取当前元素的样式名称
                    var className = $("#class_" + id).attr("class");
                    if (className == "ico ico-open") {//现在是关闭状态，点击之后展开，获取所选择类别的子类别
                        //改变图标的样式
                        $("#category_" + id).attr("class", "list-nav-current");
                        $("#class_" + id).attr("class", "ico ico-close");
                        //$("#category_"+id).attr("class","list-nav-current");
                        var index = loadNode.indexOf(id);
                        if (index > -1) {//有加载过，显示出子节点
                            $("#subCategory_" + id).css("display", "block");
                        } else {//没有加载过，则加载
                            //查询子分类
                            chooseCourseCenterService.GetCourseCategory({categoryId: id}).then(function (data) {
                                if (data.status) {
                                    loadNode.push(id);//加载成功后，将加载节点的id加入数组
                                    //有子分类才做操作
                                    if (data.info.length > 0) {
                                        var htmls = "";
                                        $("#category_" + id).attr("class", "list-nav-current");
                                        htmls += '<ul class="sub-list-nav" id="subCategory_' + id + '" style="display:block">';
                                        angular.forEach(data.info, function (category) {

                                            htmls += '<li id="category_' + category.id + '" ' +
                                            'ng-class="{\'current\':model.queryParam.courseCategoryId===\'' + category.id + '\'}" >' +
                                            '<a href="javascript:void(0);" ' +
                                            'id="current_' + category.id + '" ' +
                                            'ng-click="events.selectCourseCategory($event,\'' + category.id + '\',\'' + category.hasChildren + '\')"' +
                                            '>' + category.name +
                                            '<span class="ico ico-open" id="class_' + category.id + '" ' +
                                            'ng-click="events.changeClass($event,\'' + category.id + '\')"' +
                                            '"></span>' +
                                            '</a>' +
                                            '</li>';
                                        });
                                        htmls += '</ul>';
                                        $("#category_" + id).append($compile(htmls)($scope));
                                    }
                                } else {
                                    HB_notification.showTip(data.info, "error");
                                }
                            });
                        }
                    } else if (className == "ico ico-close") {//现在是展开状态，点击之后关闭
                        //改变图标样式
                        $("#class_" + id).attr("class", "ico ico-open");
                        //改变当前节点样式
                        $("#category_" + id).attr("class", "");
                        //隐藏孩子节点
                        $("#subCategory_" + id).css("display", "none");
                    }
                },
                //选择课程类别
                selectCourseCategory: function (e, id, hasChildren) {
                    e.stopPropagation();
                    if ("true" == hasChildren) {
                        $("#category_" + id).attr("class", "list-nav-current");
                        //获取当前元素的样式名称
                        var className = $("#class_" + id).attr("class");
                        if (className == "ico ico-open") {//现在是关闭状态，点击之后展开，获取所选择类别的子类别
                            //改变图标的样式
                            $("#class_" + id).attr("class", "ico ico-close");
                            //$("#category_"+id).attr("class","list-nav-current");
                            var index = loadNode.indexOf(id);
                            //有加载过，显示出子节点
                            if (index > -1) {
                                $("#subCategory_" + id).css("display", "block");
                            } else {//没有加载过，则加载
                                //查询子分类
                                chooseCourseCenterService.GetCourseCategory({categoryId: id}).then(function (data) {
                                    if (data.status) {
                                        loadNode.push(id);//加载成功后，将加载节点的id加入数组
                                        //有子分类，加载子分类，没有子分类，直接查询课程数据
                                        if (data.info.length > 0) {
                                            var htmls = "";
                                            $("#category_" + id).attr("class", "list-nav-current");
                                            htmls += '<ul class="sub-list-nav" id="subCategory_' + id + '" style="display:block">';
                                            angular.forEach(data.info, function (category) {
                                                htmls += '<li id="category_' + category.id + '" ' +
                                                'ng-class="{\'current\':model.queryParam.courseCategoryId===\'' + category.id + '\'}" >' +
                                                '<a href="javascript:void(0);" ' +
                                                'id="current_' + category.id + '" ' +
                                                'ng-click="events.selectCourseCategory($event,\'' + category.id + '\',\'' + category.hasChildren + '\')"' +
                                                '>' + category.name +
                                                '<span class="ico ico-open" id="class_' + category.id + '" ' +
                                                'ng-click="events.changeClass($event,\'' + category.id + '\')"' +
                                                'ng-show="' + category.hasChildren + '"></span>' +
                                                '</a>' +
                                                '</li>';
                                            });
                                            htmls += '</ul>';
                                            $("#category_" + id).append($compile(htmls)($scope));
                                        }
                                    } else {
                                        HB_notification.showTip(data.info, "error");
                                    }
                                });
                            }
                        } else if (className == "ico ico-close") {//现在是展开状态，点击之后关闭
                            //改变图标样式
                            $("#class_" + id).attr("class", "ico ico-open");
                            $("#category_" + id).attr("class", "");
                            $("#subCategory_" + id).css("display", "none");
                        }
                    } else {//没有子节点，直接加载课程数据
                        $scope.model.queryParam.courseCategoryId = id;
                        $scope.events.findByQuery(e);
                    }
                },
                Order: function (e, orderType) {
                    //降序
                    if(orderType==1){
                        $("#orderHigh").attr("class", "btn btn-r");
                        $("#orderLow").attr("class", "btn btn-g");
                    } else if(orderType==0){//升序
                        $("#orderHigh").attr("class", "btn btn-g");
                        $("#orderLow").attr("class", "btn btn-r");
                    }
                    $scope.model.queryParam.orderType=orderType;
                    $scope.events.findByQuery(e);
                },
                //按条件查询课程数据
                findByQuery: function (e) {
                    e.stopPropagation();
                    $scope.pageVar.hasQuery = true;
                    $scope.model.queryParam.pageNo = 1;//重置页码
                    //获取选课中心课程列表数据
                    chooseCourseCenterService.findByQuery($scope.model.queryParam).then(function (data) {
                        if (data.status) {
                            angular.forEach(data.info,function(item){
                                item.courseShortName = item.courseName
                                if (item.courseShortName.length > 15) {
                                    item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                                }
                                if(item.courseContents.length>100){
                                    item.courseContents=item.courseContents.substring(0,100)+"...";
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
                        $scope.events.findByQuery(e);
                    }
                },
                //滚动条加载更多事件
                findMore: function () {
                    //e.stopPropagation();
                    $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo + 1;//重置页码
                    //获取选课中心课程列表数据
                    return chooseCourseCenterService.findByQuery($scope.model.queryParam).then(function (data) {
                        if (data.status) {
                            angular.forEach(data.info,function(item){
                                item.courseShortName = item.courseName
                                if (item.courseShortName.length > 15) {
                                    item.courseShortName = item.courseShortName.substring(0, 15) + "...";
                                }
                                if(item.courseContents.length>100){
                                    item.courseContents=item.courseContents.substring(0,100)+"...";
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
                //试听课程 1--试听（学员没选的播放是试听） 2--播放（学员选择之后的播放是播放）
                playCourse: function (e, courseId) {
                    var url = '/front/#/play/' + courseId + '/1/';
                    window.open(url)
                },
                //将课程添加到我的选修课
                selectCourse: function (e, courseId) {
                    chooseCourseCenterService.selectCourse({courseId: courseId}).then(function (data) {
                        if (data.status) {
                            //查询选课中心课程类别
                            $scope.events.findByQuery(e);
                        } else {
                            HB_notification.showTip('选择课程失败！', "error");
                        }
                    });
                },
                //当鼠标移动到详情区域时触发事件
                changeDetailClass:function(e,imgId,detailId){
                    e.stopPropagation();
                    var elem= document.getElementById(imgId);
                    var rect = elem.getBoundingClientRect();
                    var contentDivRight=document.getElementById("contentDiv").getBoundingClientRect().right;//整个课程信息区域的div距离右边的宽度
                    var left = contentDivRight-rect.right // 距离右边的位置就是 距离左边的位置加上元素本身的宽度
                    if(left<250){
                        $("#detail_"+detailId).attr("class","detail-block detail-block-left")
                        $("#direction_"+detailId).attr("src","images/detail_arrow_1.png")
                    } else {
                        $("#detail_"+detailId).attr("class","detail-block detail-block-right")
                        $("#direction_"+detailId).attr("src","images/detail_arrow.png")
                    }
                }
            };
        }];
});
