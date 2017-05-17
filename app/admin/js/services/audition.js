/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/18
 * 时间: 16:28
 *

 */
define(['angular', 'playLoader'], function (angular, playLoader) {

    'use strict';
    var auditionModule = angular.module('auditionModule', []);

    auditionModule.directive('playArea', ['$$$audition', function ($$$audition) {
        return {
            restrict: 'C',
            templateUrl: 'templates/common/audition.html',
            controller: ['$scope', '$$$audition', '$element', '$attrs', '$timeout', function ($scope, $$$audition, $element, $attrs, $timeout) {
                $scope.model = {
                    pageNo: 1,
                    pageSize: 5,
                    //播放类型 1为管理员试听、2为学员播放、3为学员试听
                    playType: '',
                    trial: true,
                    currentCoursewareId: '',//当前播放的课件Id
                    coursewareOutlineDtos: [],
                    currentDomain: '',
                    playParams: {}
                };
                $scope.closePlayArea = function () {
                    $$$audition.removeDom();
                };
                $scope.events = {
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
                     * 选中分页下标
                     */
                    selectPageIndex: function (index, e) {
                        $scope.model.pageNo = index;
                        findCourseReviewPage(false);
                        e.preventDefault();

                    },
                    /**
                     * 进入课程
                     * @param subCoursewareOutline
                     * @param e
                     */
                    enterCourseware: function (subCoursewareOutline, e) {
                        if (subCoursewareOutline.moduleType == 2) {
                            $$$audition.getMultimediaPlayInfo(subCoursewareOutline.moduleKey).then(function (data) {
                                if (data.status) {
                                    playThree(data.info);
                                    $scope.model.subCoursewareOutlineId = subCoursewareOutline.id;
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
                    selectSubCourseOutline: function (e, subCourseOutline) {
                        angular.forEach($scope.model.course.courseUpdate.courseOutlineDtos, function (data) {
                            angular.forEach(data.subCourseOutlines, function (subCourseOutlineData) {
                                subCourseOutlineData.select = false;
                            });
                        });
                        $$$audition.getPlayParams(subCourseOutline.cseId, subCourseOutline.cweId).then(function (data) {
                            if (data.status) {
                                selectPlay(data.info);
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
                    var coursewareId = null;
                    if ($attrs.coursewareid) {
                        coursewareId = $attrs.coursewareid;
                    }
                    $$$audition.getLessonInfo($attrs.courseid, coursewareId).then(function (data) {
                        if (data.status) {
                            $scope.model.course = data.info;
                            $scope.model.currentDomain = data.info.currentDomain;
                            $scope.model.videoStreamHost = data.info.videoStreamHost;
                            $scope.model.resourcePath = data.info.resourcePath;
                            select(data.info.lessonPlay.playParams.courseWareId);
                            defaultPlay(data.info.lessonPlay);
                        }
                    });
                }

                function findCourseReviewPage(add) {
                    $$$audition.findCourseReviewPage($scope.model.pageNo, $scope.model.pageSize, $attrs.courseid).then(function (data) {
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
                    playParams.container = {id: "media-container", width: 340, height: 240, limit: 'null'};
                    playParams.streamPath = data.videoResourceList[0].path;
                    playParams.streamHost = $scope.model.videoStreamHost;
                    playParams.studyMode = '0';

                    $scope.model.type = playParams.type;
                    playParams.test = true;
                    playLoader.loaderInit(playParams);
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
                 * 第一次播放
                 */
                function defaultPlay(lessonPlay) {
                    if (lessonPlay.coursewareOutlineDtos == null || lessonPlay.coursewareOutlineDtos.length == 0) {
                        trialPlayDocumentAndVido(lessonPlay.playParams);
                        $scope.showCourseOutline = false;
                        $scope.showCourseware = false;
                    } else {
                        $scope.model.coursewareOutlineDtos = lessonPlay.coursewareOutlineDtos;
                        $scope.model.subCoursewareOutlineId = lessonPlay.playParams.subCoursewareOutlineId;
                        $scope.showCourseware = true;
                        trialPlayThreeAndScorm(lessonPlay.playParams, lessonPlay);
                    }
                }

                /**
                 * 选中播放
                 */
                function selectPlay(lessonPlay) {
                    if (lessonPlay.coursewareOutlineDtos == null || lessonPlay.coursewareOutlineDtos.length == 0) {
                        trialPlayDocumentAndVido(lessonPlay.playParams);
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
                 * 试听三分屏和scorm
                 */
                function trialPlayThreeAndScorm(context, playType) {
                    var playParams = {
                        test: context.test,
                        studyMode: '0',
                        type: context.type == 1 ? 'pdf' : (context.type == 2 ? 'three' : 'scorm'),
                        streamHost: context.streamHost,
                        streamPath: context.type != 2 ? '/mfs' + context.streamPath : context.streamPath
                    };
                    $scope.model.type = context.type;
                    if (context.type == 3) {
                        playParams.container = {id: "play_content", width: 878, height: 600, limit: 'null'}
                        $scope.showParent = false;
                    } else {
                        playParams.lessonDocument = addLecturePath(context.lectureList);
                        playParams.lessonCatalog = context.chaptersList;
                        playParams.container = {id: "media-container", width: 340, height: 240, limit: 'null'}
                        $scope.showParent = true;
                    }
                    $scope.model.type = playParams.type;
                    playParams.test = true;
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

                /**
                 * 点击后播放文档或者scrom
                 * @param data
                 */
                function playScromAndDocument(data) {
                    var playParams = $scope.model.playParams;
                    playParams.type = data.moduleType == 3 ? 'scorm' : 'pdf';
                    playParams.container = {id: "play_content", width: 878, height: 600, limit: 'null'};
                    playParams.streamPath = '/mfs' + data.moduleData;
                    playParams.streamHost = $scope.model.currentDomain;
                    playParams.studyMode = '0';
                    playParams.test = true;
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
                    if (context.type == 1) {
                        playParams.container = {id: "play_content", width: 878, height: 600, limit: 'null'}
                    } else {
                        if (context.lectureList && context.lectureList.length > 0) {
                            playParams.lessonDocument = addLecturePath(context.lectureList);
                            playParams.lessonCatalog = context.chaptersList;
                            playParams.container = {id: "media-container", width: 340, height: 240, limit: 'null'}
                            playParams.type = 'three';
                        } else {
                            playParams.container = {id: "video_content", width: 880, height: 600, limit: 'null'}
                        }
                    }

                    $scope.model.type = playParams.type;

                    playLoader.loaderInit(playParams);
                }

                function init() {
                    findLessonInfo();
                    findCourseReviewPage(true);
                }

                $timeout(function () {
                    init();
                })
            }],
            scope: {},
            link: function (scope, element, attrs) {

            }
        }

    }]);

    auditionModule.factory('$$$audition', ['$compile', '$rootScope', 'Restangular', function ($compile, $rootScope, Restangular) {
        var listenService = {},
            base = Restangular.withConfig(function (config) {
                config.setBaseUrl('/web/admin/lesson');
            });
        listenService.createDom = function (/**课程id*/courseId, /**课件id*/coursewareId, /**播放类型*/playType) {
            var compileFunction = $compile('<div class="play-area zoomInDown animated"' +
                'courseId="' + courseId + '"' +
                'coursewareId="' + coursewareId + '"' +
                ' playType="' + playType + '" style="z-index: ' + new Date().getTime() + '"></div>'),
                link = compileFunction($rootScope);
            this.listenDom = link;
            angular.element('body').append(link);
        };

        listenService.removeDom = function () {
            this.listenDom.remove();
        };
        listenService.getLessonInfo = function (courseId, coursewareId) {
            return base.one('findPlayLessonInfo').get({courseId: courseId, coursewareId: coursewareId});
        };
        listenService.findCourseReviewPage = function (pageNo, pageSize, courseId) {
            return base.one('findCourseReviewPage').get({courseId: courseId, pageNo: pageNo, pageSize: pageSize});
        };
        listenService.getMultimediaPlayInfo = function (moduleKey) {
            return base.one('getMultimediaPlayInfo').get({moduleKey: moduleKey});
        };
        listenService.getPlayParams = function (courseId, coursewareId, type) {
            return base.one('getPlayParams').get({courseId: courseId, courseWareId: coursewareId, playType: type});
        };
        return listenService;
    }]);
});
