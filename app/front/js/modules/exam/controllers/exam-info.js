/**
 * Created by WDL on 2015/8/27.
 */
define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'examService', '$stateParams', '$state', function ($scope, HB_notification, examService, $stateParams, $state) {

        //console.log($stateParams);

        var SysSecond;
        var InterValObj;
        var seconds; //
        var currentTimeSecond;
        var examStartTimeSecond, examEndTimeSecond;
        var NowTime, StartTime, EndTime, CurrentTime;


        $scope.examId = $stateParams.roundId;  //场次id
        $scope.examRoundType = $stateParams.examModeType;
        $scope.paperId = $stateParams.paperId;  //答卷id，试卷id
        $scope.state = $stateParams.dimension; //未考，已考， 漏考
        $scope.parent = $stateParams.location;
        $scope.$watch($stateParams, function (newValue, oldValue) {
            if ($scope.examId) {
                method.examInfo();
            } else {
                HB_notification.showTip('加载数据有错误！', 'info');
            }
        });

        $scope.status = 1;
        $scope.confirmbutton = true;
        $scope.querybutton = true;
        $scope.timebutton = true;
        $scope.endbutton = true;
        $scope.noquerybutton = true;
        $scope.enter = true;  //无法进入考试

        $scope.isshow = false;  //是否显示 ，所属培训班
        $scope.cannotExamTime = false;  //是否显示， 开考多久不可考试
        $scope.cannotHandExamTime = false; //是否显示， 开考后多久内不许交卷
        $scope.scorePublishWay = false;  //是否显示，成绩公布方式
        $scope.scorePublishTime = false;  //是否显示，成绩公布时间

        $scope.model = {
            examInfos: {
                marking: false,
                examName: null,
                theTrainingClass: null,
                examScore: 0.0,
                examPassScore: 0.0,
                examTime: 0,
                examStartTime: null,
                examEndTime: null,
                cannotExamTime: 0,
                cannotHandExamTime: 0,
                scorePublishWay: 0,
                scorePublishTime: null,
                enter: false,
                end: false
            },
            timeAttr: {
                status: null,
                currentTimeSecond: null,
                examStartTimeSecond: null,
                examEndTimeSecond: null
            }
        };

        $scope.events = {
            stateSkip: function (e) {
                e.preventDefault();
                $state.go($scope.parent,{
                    viewType:'test'//学习档案模块需要返回次参数确定要显示的页面，我的考试模块不需要次参数，不影响我的考试模块
                });
            },
            comfirmExam: function (e) {
                e.preventDefault();
                window.open("/exam/#/examine/" + $stateParams.roundId);
                $state.go($scope.parent);
            },
            querybutton: function (e) {
                e.preventDefault();
                window.open("/exam/#/viewPublish/" + $stateParams.paperId);
            },
            noquerybutton: function (e) {
                e.preventDefault();
                window.open("/exam/#/viewUnPublish/" + $stateParams.paperId);
            }
        };

        var method = {
            examInfo: function () {
                examService.examInfo($scope.examId, $scope.examRoundType, $scope.paperId).then(function (data) {
                    if (data.status) {
                        $scope.model.examInfos = data.info;

                        if (data.info.examModeType == 2) {
                            var examEndTime = data.info.examEndTime;
                            var examStartTime = data.info.examStartTime;
                            var time1 = new Date(examEndTime).getTime();
                            var time2 = new Date(examStartTime).getTime(); //截止时间

                            var time3 = (time1 - time2) / 1000;
                            var m = Math.floor(time3 / 60);
                            $scope.model.examInfos.examTime = m;

                            if (data.info.cannotExamTime) {
                                $scope.cannotExamTime = true;  //是否显示， 开考多久不可考试
                            }

                            if (data.info.cannotHandExamTime) {
                                $scope.cannotHandExamTime = true; //是否显示， 开考后多久内不许交卷
                            }
                        } else if (data.info.examModeType == 1) {
                            //$scope.model.examInfos.examTime
                        }

                        if (data.info.scorePublishWay) {
                            $scope.scorePublishWay = true;  //是否显示，成绩公布方式
                            if (data.info.scorePublishWay == 0) {
                                $scope.model.examInfos.scorePublishWay = '不公布';
                            } else if (data.info.scorePublishWay == 1) {
                                $scope.model.examInfos.scorePublishWay = '考完公布';
                            } else if (data.info.scorePublishWay == 2) {
                                $scope.model.examInfos.scorePublishWay = '限时公布';
                                if (data.info.scorePublishTime) {
                                    $scope.scorePublishTime = true; //是否显示，成绩公布时间
                                }
                            }
                        }

                        $scope.model.examInfos.marking = data.info.marking;
                        if (data.info.theTrainingClass) {
                            $scope.isshow = true;
                        }
                        method.findStatus();
                    } else {
                        HB_notification.showTip('获取考试信息失败', 'error');
                    }
                });


            },
            findStatus: function () {
                //examService.findStatus($scope.examId, $scope.status).then(function (data) {
                examService.findStatus($scope.examId, $scope.examRoundType, $scope.paperId).then(function (data) {
                    if (data.status) {
                        $scope.model.timeAttr = data.info;
                        NowTime = currentTimeSecond = data.info.currentTimeSecond;
                        StartTime = examStartTimeSecond = data.info.examStartTimeSecond;
                        EndTime = examEndTimeSecond = data.info.examEndTimeSecond;
                        /*NowTime = new Date(currentTimeSecond).getTime();
                        EndTime = new Date(examEndTimeSecond).getTime(); //截止时间
                         StartTime = new Date(examStartTimeSecond).getTime();*/
                        console.log("NowTime" + NowTime);
                        console.log("EndTime" + StartTime);
                        CurrentTime = (StartTime - NowTime) / 1000;

                        var end = EndTime - NowTime;
                        //if (data.info.status == 'A') {

                        //开考多久不可考试 分钟  转 毫秒
                        var cannotExamTime = $scope.model.examInfos.cannotExamTime * 60 * 1000;
                        var flag = false;
                        if (!$scope.model.examInfos.enter && $scope.model.examInfos.examModeType == 2) {
                            flag = true;
                        }
                        if (flag && (StartTime + cannotExamTime - NowTime) <= 0 && (EndTime - NowTime) >= 0) {
                            $scope.confirmbutton = true;
                            $scope.querybutton = true;
                            $scope.timebutton = true;
                            $scope.endbutton = true;
                            $scope.noquerybutton = true;
                            $scope.enter = false;
                            $scope.$apply();
                        } else if ($scope.state == '1' && end <= 0) {
                            $scope.confirmbutton = true;
                            $scope.querybutton = true;
                            $scope.noquerybutton = true;
                            $scope.timebutton = true;
                            $scope.enter = true;
                            $scope.endbutton = false;
                            $scope.$apply();
                        } else if (end <= 0 || $scope.model.examInfos.end) {
                            $scope.confirmbutton = true;
                            $scope.timebutton = true;
                            $scope.endbutton = true;
                            $scope.enter = true;
                            if ($scope.model.examInfos.marking) {
                                $scope.querybutton = false;
                            } else {
                                $scope.noquerybutton = false;
                            }
                            $scope.$apply();
                        } else if (CurrentTime <= 0) {
                            $scope.querybutton = true;
                            $scope.timebutton = true;
                            $scope.endbutton = true;
                            $scope.noquerybutton = true;
                            $scope.enter = true;
                            $scope.confirmbutton = false;
                            $scope.$apply();
                        } else {
                            $scope.confirmbutton = true;
                            $scope.querybutton = true;
                            $scope.endbutton = true;
                            $scope.noquerybutton = true;
                            $scope.enter = true;
                            $scope.timebutton = false;
                            $scope.$apply();
                            InterValObj = window.setInterval(method.GetRTime, 1000);
                        }
                    }
                });
            },
            GetRTime: function () {
                //var EndTime= new Date('2015/08/31 10:00'); //截止时间
                //var NowTime = new Date();
                //var t =EndTime.getTime() - NowTime.getTime();
                //console.log("EndTime: " + EndTime.getTime());
                //console.log("NowTime: " + NowTime.getTime());
                //console.log("CurrentTime: " + t);
                //NowTime = NowTime + 1000;

                /*var d=Math.floor(t/1000/60/60/24);
                 t-=d*(1000*60*60*24);
                 var h=Math.floor(t/1000/60/60);
                 t-=h*60*60*1000;
                 var m=Math.floor(t/1000/60);
                 t-=m*60*1000;
                 var s=Math.floor(t/1000);*/
                if (CurrentTime >= 0) {
                    var d = Math.floor(CurrentTime / 60 / 60 / 24);
                    var h = Math.floor(CurrentTime / 60 / 60 % 24);
                    var m = Math.floor(CurrentTime / 60 % 60);
                    var s = Math.floor(CurrentTime % 60);

                    h = d * 24 + h;

                    //document.getElementById("t_d").innerHTML = d + "天";
                    //document.getElementById("t_h").innerHTML = h + "时";
                    //document.getElementById("t_m").innerHTML = m + "分";
                    //document.getElementById("t_s").innerHTML = s + "秒";
                    $scope.time = h + " : " + m + " : " + s;
                    $scope.$apply();

                    CurrentTime = CurrentTime - 1;
                } else {
                    $scope.querybutton = true;
                    $scope.noquerybutton = true;
                    $scope.timebutton = true;
                    $scope.endbutton = true;
                    $scope.enter = true;
                    $scope.confirmbutton = false;
                    $scope.$apply();
                    window.clearInterval(InterValObj);
                    //这里可以添加倒计时时间为0后需要执行的事件

                }
            }
        };

        /*method.findStatus();
         method.examInfo();*/
    }]
})
