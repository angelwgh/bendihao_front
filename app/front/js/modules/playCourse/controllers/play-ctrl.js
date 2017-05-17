/**
 * Created by Administrator on 2015/8/1.
 */
define(['playLoader'], function (playLoader) {
        'use strict';
        return ['$scope', 'lessonPlayService', '$stateParams', 'HB_notification', '$state', function ($scope, lessonPlayService, $stateParams, HB_notification, $state) {
            $scope.model = {
                pageNo: 1,
                pageSize: 5,
                //播放类型 1试听、2播放
                playType: '',
                trial: true,
                currentCoursewareId: '',//当前播放的课件Id
                coursewareOutlineDtos: [],
                currentDomain: '',
                contents: '',
                selectIndex: 0
            };
            $scope.events = {
                /**
                 * 选择选修课
                 */
                choose: function () {
                    lessonPlayService.addMyChooseCourse($stateParams.courseId).then(function (data) {
                        if (data.status) {
                            HB_notification.showTip('添加选修课成功', "success");
                            $scope.model.choose = true;
                        } else {
                            HB_notification.showTip('添加选修课失败', "error");
                        }

                    });

                },
                /**
                 * 取消选修课
                 */
                cancel: function () {
                    lessonPlayService.removeMyChooseCourse($stateParams.courseId).then(function (data) {
                        if (data.status) {
                            HB_notification.showTip('删除选修课成功', "success");
                            $scope.model.choose = false;
                        } else {
                            HB_notification.showTip('删除选修课失败', "error");
                        }
                    });

                },
                /**
                 * 去我的选修课
                 */
                goMyChooseCourse: function () {
                    $state.go('states.mySelectCourse');
                },
                /**
                 * 加载后面
                 * @param e
                 */
                behind: function (e) {
                    var total = $scope.total + $scope.model.pageSize,
                        org = $scope.total;
                    $scope.model.front = true;
                    if (total < $scope.model.totalPageSize) {
                        $scope.total = total;
                        $scope.model.behind = true;
                    } else if (total == $scope.model.totalPageSize) {
                        $scope.total = total;
                        $scope.model.behind = false;
                    } else {
                        $scope.total = $scope.model.totalPageSize;
                        $scope.model.behind = false;
                    }
                    lodaIndex(org + 1, $scope.total);
                    e.preventDefault();
                },
                /**
                 * 获取时间
                 * @param second
                 * @returns {{hour: number, minute: number, second: number}}
                 */
                getTime: function (second) {
                    var time = {hour: 0, minute: 0, second: 0};
                    if (second == 0) return time;
                    time.hour = Math.floor(second / 3600);
                    time.minute = Math.floor((second - time.hour * 60) / 60);
                    time.second = second % 60;
                    return time;
                },

                /**
                 * 加载前面
                 * @param e
                 */
                front: function (e) {
                    $scope.total = $scope.total - $scope.model.pageSize;
                    $scope.model.behind = true;
                    if ($scope.total <= $scope.model.pageSize) {
                        $scope.total = $scope.model.pageSize;
                        $scope.model.front = false;
                    } else {
                        $scope.model.front = true;
                    }
                    lodaIndex($scope.total - $scope.model.pageSize + 1, $scope.total);
                    e.preventDefault();
                },
                /**
                 * 点赞
                 */
                like: function () {
                    lessonPlayService.addPraiseRecord($stateParams.courseId, 1).then(function (data) {
                        if (data.status) {
                            $scope.like = true;
                            $scope.model.course.haveClicked = true;
                            $scope.model.course.likeNumber++;
                        }
                    });

                },
                /**
                 * 点踩
                 */
                tread: function () {
                    lessonPlayService.addPraiseRecord($stateParams.courseId, 2).then(function (data) {
                        if (data.status) {
                            $scope.tread = true;
                            $scope.model.course.haveClicked = true;
                            $scope.model.course.treadNumber++;
                        }
                    });
                },

                /**
                 * 选中分页下标
                 */
                selectPageIndex: function (index, e) {
                    $scope.model.pageNo = index;
                    findCourseReviewPage(false);
                    e.preventDefault();

                },
                /**
                 * 发布评论
                 */
                release: function () {
                    lessonPlayService.releaseReview($stateParams.courseId, $scope.model.contents).then(function (data) {
                        if (data.status) {
                            HB_notification.showTip('发表评论成功', "success");
                            $scope.model.contents = '';
                            $scope.model.pageNo = 1;
                            findCourseReviewPage(true);
                        }
                    });
                },
                /**
                 * 进入课程
                 * @param subCoursewareOutline
                 * @param e
                 */
                enterCourseware: function (subCoursewareOutline, index, e) {
                    if ($stateParams.playType == 1) {
                        if (index > 0) {
                            HB_notification.showTip('试听只能播放第一章节第一个课件', "error");
                            return false;
                        }
                    }
                    if (subCoursewareOutline.moduleType == 2) {
                        lessonPlayService.getMultimediaPlayInfo(subCoursewareOutline.moduleKey).then(function (data) {
                            if (data.status) {
                                playThree(data.info);
                                $scope.model.moduleKey = subCoursewareOutline.moduleKey;
                                $scope.showCoursewareCont = false;
                            }

                        });
                    } else {
                        $scope.model.subCoursewareOutlineId = subCoursewareOutline.id;
                        playScromAndDocument(subCoursewareOutline);
                        $scope.showCoursewareCont = false;
                    }

                    e.preventDefault();
                },
                /**
                 * 选中子章节
                 * @param i
                 * @param e
                 */
                selectSubCourseOutline: function (e, subCourseOutline, index, parentIndex) {
                    if ($stateParams.playType == 1) {
                        if (parentIndex > 0 || index > 0) {
                            HB_notification.showTip('试听只能播放第一章节第一个课件', "error");
                            return false;
                        }
                    }
                    if (subCourseOutline.status != 1) {
                        HB_notification.showTip('该课件不能播放请联系管理员', "error");
                        return false;
                    }
                    angular.forEach($scope.model.course.courseUpdate.courseOutlineDtos, function (data) {
                        angular.forEach(data.subCourseOutlines, function (subCourseOutlineData) {
                            subCourseOutlineData.select = false;
                        });
                    });
                    lessonPlayService.getPlayParams(subCourseOutline.cseId, subCourseOutline.cweId, $stateParams.playType).then(function (data) {
                        if (data.status) {
                            selectPlay(data.info);
                            $scope.model.cweId = subCourseOutline.cweId;
                            subCourseOutline.select = true;
                        }

                    });
                    e.preventDefault();
                }
            };

            function select(coursewareId) {
                var temp = false;
                angular.forEach($scope.model.course.courseUpdate.courseOutlineDtos, function (data) {
                    angular.forEach(data.subCourseOutlines, function (subCourseOutlineData) {
                        if (subCourseOutlineData.cweId == coursewareId) {
                            subCourseOutlineData.select = true;
                            data.isOpen = true;
                            temp = true;
                            return false;
                        }
                        if (temp) {
                            return false;
                        }

                    });
                });
            }

            function findLessonInfo() {
                lessonPlayService.findPlayLessonInfo($stateParams.courseId, $stateParams.playType, $stateParams.coursewareId).then(function (data) {
                    if (data.status) {
                        window.document.title = data.info.courseUpdate.name;
                        $scope.model.course = data.info;
                        $scope.model.currentDomain = data.info.currentDomain;
                        $scope.model.videoStreamHost = data.info.videoStreamHost;
                        $scope.model.resourcePath = data.info.resourcePath;
                        $scope.model.studyServicePath = data.info.studyServicePath;
                        select(data.info.lessonPlay.playParams.courseWareId);
                        setPlayParams(data.info.lessonPlay.playParams);
                        defaultPlay(data.info.lessonPlay);

                    }
                });
            }

            function findCourseReviewPage(add) {
                lessonPlayService.findCourseReviewPage($scope.model.pageNo, $scope.model.pageSize, $stateParams.courseId).then(function (data) {
                    if (data.status) {
                        $scope.model.reviews = data.info;
                        $scope.model.totalPageSize = data.totalPageSize;
                        if (add) {
                            $scope.total = data.totalPageSize;
                            if (data.totalPageSize > $scope.model.pageSize) {
                                $scope.model.behind = true;
                                $scope.total = $scope.model.pageSize;
                            }
                            lodaIndex($scope.total - $scope.model.pageSize, $scope.total);
                        }
                    }
                });
            }

            /**
             *点击播放三分屏
             */
            function playThree(data) {
                var playParams = $scope.model.playParams;
                playParams.type = 'three';
                playParams.lessonDocument = addLecturePath(data.lectureList);
                playParams.lessonCatalog = data.chaptersList;
                playParams.multimediaId = data.id;
                playParams.courseWareId = data.cweId;
                playParams.container = {id: "media-container", width: 340, height: 240, limit: 'null'};
                playParams.streamPath = data.videoResourceList[0].path;
                playParams.streamHost = $scope.model.videoStreamHost;
                if ($stateParams.playType == 2) {
                    playParams.studyMode = '1';
                } else {
                    playParams.studyMode = '0';
                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);
            }

            function setPlayParams(context) {
                var playParas = {
                    test: context.test,
                    plmId: context.platformId,
                    pvmId: context.platformVersionId,
                    prmId: context.projectId,
                    subPrmId: context.subProjectId,
                    unitId: context.unitId,
                    orgId: context.organizationId,
                    usrId: context.userId,
                    usrName: "-1",
                    objectId: context.objectId,
                    courseId: context.courseId,
                    multimediaId: context.mediaId,
                    courseWareId: context.courseWareId,
                    originalAbilityId: '-1',
                    streamHost: context.currentDomain,
                    initURL: $scope.model.studyServicePath
                };
                $scope.model.playParams = playParas;
            }

            /**
             * 第一次播放
             */
            function defaultPlay(lessonPlay) {
                if (lessonPlay.coursewareOutlineDtos == null || lessonPlay.coursewareOutlineDtos.length == 0) {
                    if ($stateParams.playType == 2) {
                        playVideoAndDocument(lessonPlay.playParams);
                    } else {
                        trialPlayDocumentAndVido(lessonPlay.playParams);
                    }
                    $scope.showCourseOutline = false;
                    $scope.showCourseware = false;
                } else {
                    $scope.model.coursewareOutlineDtos = lessonPlay.coursewareOutlineDtos;
                    $scope.model.moduleKey = lessonPlay.playParams.mediaId;
                    $scope.model.subCoursewareOutlineId = lessonPlay.playParams.subCoursewareOutlineId;
                    $scope.showCourseware = true;
                    if ($stateParams.playType == 2) {
                        playThreeAndScorm(lessonPlay.playParams);
                    } else {
                        trialPlayThreeAndScorm(lessonPlay.playParams);
                    }
                }
            }

            /**
             * 选中播放
             */
            function selectPlay(lessonPlay) {
                if (lessonPlay.coursewareOutlineDtos == null || lessonPlay.coursewareOutlineDtos.length == 0) {
                    if ($stateParams.playType == 2) {
                        playVideoAndDocument(lessonPlay.playParams);
                    } else {
                        trialPlayDocumentAndVido(lessonPlay.playParams);
                    }
                    $scope.showCourseOutline = false;
                    $scope.showCourseware = false;
                } else {
                    if (lessonPlay.coursewareOutlineDtos[0].moduleType == 0) {
                        $scope.showParent = true;
                    } else {
                        $scope.showParent = false;
                    }
                    $scope.model.coursewareOutlineDtos = lessonPlay.coursewareOutlineDtos;
                    $scope.model.subCoursewareOutlineId = lessonPlay.playParams.subCoursewareOutlineId;
                    $scope.showCourseware = true;
                    $scope.showCoursewareCont = true;
                    $scope.showCourseOutline = false

                }
            }

            /**
             * 播放单视频或者单文档
             * @param context
             */
            function playVideoAndDocument(context) {
                var playParams = $scope.model.playParams;
                playParams.studyMode = '1';
                playParams.multimediaId = context.mediaId;
                playParams.courseWareId = context.courseWareId;
                playParams.type = context.type == 1 ? 'pdf' : 'single';
                playParams.streamHost = context.streamHost;
                playParams.streamPath = context.type == 1 ? '/mfs' + context.streamPath : context.streamPath;
                $scope.model.type = context.type;
                if (context.type == 1) {
                    playParams.container = {id: "play_content", width: 878, height: 532, limit: 'null'}
                } else {
                    if (context.lectureList && context.lectureList.length > 0) {
                        playParams.lessonDocument = addLecturePath(context.lectureList);
                        playParams.lessonCatalog = context.chaptersList;
                        playParams.container = {
                            id: "media-container", width: 340, height: 240, limit: 'null'
                        };
                        playParams.type = 'three';
                    } else {
                        playParams.container = {id: "video_content", width: 878, height: 532, limit: 'null'}

                    }
                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);
            }

            /**
             * 试听单视频或者单文档
             */
            function trialPlayDocumentAndVido(context) {
                var playParams = {
                    test: context.test,
                    studyMode: '0',
                    type: context.type == 1 ? 'pdf' : 'single',
                    streamHost: context.streamHost,
                    streamPath: context.type == 1 ? '/mfs' + context.streamPath : context.streamPath
                };
                $scope.model.type = context.type;
                //播放类型为3的为学员试听
                if (context.type == 1) {
                    playParams.container = {id: "play_content", width: 878, height: 590, limit: '1|3|10|3|5'}
                } else {
                    var limit = null;
                    if (context.timeLength > 180 && context.timeLength < 600) {
                        limit = 60;
                    } else if (context.timeLength > 600) {
                        limit = 180;
                    } else {
                        limit = null;
                    }
                    if (context.lectureList && context.lectureList.length > 0) {
                        playParams.lessonDocument = addLecturePath(context.lectureList);
                        playParams.lessonCatalog = context.chaptersList;
                        playParams.container = {
                            id: "media-container", width: 340, height: 240, limit: limit, callback: function () {
                                HB_notification.showTip('课程预览时间到，如需查看完整课程，请将该课程选为选修课', "error");
                            }
                        };
                        playParams.type = 'three';
                    } else {
                        playParams.container = {
                            id: "video_content", width: 878, height: 532, limit: limit, callback: function () {
                                HB_notification.showTip('课程预览时间到，如需查看完整课程，请将该课程选为选修课', "error");
                            }
                        }
                    }

                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);

            }

            /**
             * 播放三分屏和scorm
             */
            function playThreeAndScorm(context) {
                var playParams = $scope.model.playParams;
                playParams.studyMode = '1';
                playParams.type = context.type == 1 ? 'pdf' : (context.type == 2 ? 'three' : 'scorm');
                playParams.multimediaId = context.mediaId;
                playParams.courseWareId = context.courseWareId;
                playParams.streamPath = context.type != 2 ? '/mfs' + context.streamPath : context.streamPath;
                playParams.streamHost = context.streamHost;
                if (context.type != 2) {
                    playParams.streamHost = $scope.model.currentDomain;
                    playParams.container = {id: "play_content", width: 878, height: 532, limit: 'null'};
                    $scope.showParent = false;
                } else {
                    playParams.lessonDocument = addLecturePath(context.lectureList);
                    playParams.lessonCatalog = context.chaptersList;
                    playParams.container = {id: "media-container", width: 340, height: 240, limit: 'null'}
                    $scope.showParent = true;
                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);
            }

            /**
             * 试听三分屏和scorm
             */
            function trialPlayThreeAndScorm(context) {
                var playParams = {
                    test: context.test,
                    studyMode: '0',
                    type: context.type == 1 ? 'pdf' : (context.type == 2 ? 'three' : 'scorm'),
                    streamHost: context.streamHost,
                    streamPath: context.type != 2 ? '/mfs' + context.streamPath : context.streamPath
                };
                $scope.model.type = context.type;
                if (context.type == 3) {
                    playParams.container = {id: "play_content", width: 878, height: 532, limit: 'null'}
                    $scope.showParent = false;
                } else {
                    var limit = 'null';
                    if (context.timeLength > 180 && context.timeLength < 600) {
                        limit = 60;
                    } else if (context.timeLength > 600) {
                        limit = 180;
                    } else {
                        limit = 'null';
                    }
                    playParams.lessonDocument = addLecturePath(context.lectureList);
                    playParams.lessonCatalog = context.chaptersList;
                    playParams.container = {
                        id: "media-container", width: 340, height: 240, limit: limit, callback: function () {
                            HB_notification.showTip('课程预览时间到，如需查看完整课程，请将该课程选为选修课', "error");
                        }
                    };
                    $scope.showParent = true;
                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);
            }

            /**
             * 添加讲义的播放地址
             * @param lectureList
             * @returns {*}
             */
            function addLecturePath(lectureList) {
                angular.forEach(lectureList, function (data) {
                    if (data.type == 4) {
                        data.path = $scope.model.currentDomain + '/mfs' + data.path;
                    } else {
                        data.path = $scope.model.resourcePath + '/mfs' + data.path;
                    }

                });
                return lectureList;
            }

            function lodaIndex(start, total) {
                $scope.model.pageIndexs = [];
                if (start <= 0) {
                    start = 1
                }
                for (var i = start; i <= total; i++) {
                    $scope.model.pageIndexs.push({index: i});
                }
            }

            /**
             * 点击后播放文档或者scrom
             * @param data
             */
            function playScromAndDocument(data) {
                var playParams = $scope.model.playParams;
                playParams.type = data.moduleType == 3 ? 'scorm' : 'pdf';
                playParams.multimediaId = data.id;
                playParams.courseWareId = $scope.model.cweId;
                playParams.container = {id: "play_content", width: 340, height: 240, limit: 'null'};
                playParams.streamPath = '/mfs' + data.moduleData;
                playParams.streamHost = $scope.model.currentDomain;
                if ($stateParams.type == 2) {
                } else {
                    playParams.studyMode = '0';
                }
                $scope.model.type = playParams.type;
                playLoader.loaderInit(playParams);
            }

            function init() {
                $scope.model.playType = $stateParams.playType;
                findLessonInfo();
                findCourseReviewPage(true);
            }

            init();
        }
        ]
    }
)
