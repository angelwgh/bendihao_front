/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/play');
        });
        return {
            findPlayLessonInfo: function (courseId, playType, coursewareId) {
                return base.one('findPlayLessonInfo').get({
                    courseId: courseId,
                    playType: playType,
                    coursewareId: coursewareId
                });
            },


            findCourseReviewPage: function (pageNo, pageSize, courseId) {
                return base.one('findCourseReviewPage').get({courseId: courseId, pageNo: pageNo, pageSize: pageSize});
            },
            getMultimediaPlayInfo: function (moduleKey) {
                return base.one('getMultimediaPlayInfo').get({moduleKey: moduleKey});
            },

            releaseReview: function (courseId, contents) {
                return base.all('releaseReview').post({cseId: courseId, contents: contents});
            },
            addPraiseRecord: function (courseId, type) {
                return base.all('addPraiseRecord').post({cseId: courseId, type: type});
            },
            addMyChooseCourse: function (courseId) {
                return base.one('addMyChooseCourse').get({courseId: courseId});
            },
            removeMyChooseCourse: function (courseId) {
                return base.one('removeMyChooseCourse').get({courseId: courseId});
            },

            getPlayParams: function (courseId, coursewareId, playTyp) {
                return base.one('getPlayParams').get({
                    courseId: courseId,
                    courseWareId: coursewareId,
                    playType: playTyp
                });
            }
        }
    }]
});
