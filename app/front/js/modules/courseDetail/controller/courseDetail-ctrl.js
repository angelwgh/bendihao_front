/**
 * Created by Administrator on 2015/8/21.
 */
define(function () {
    'use strict'
    return ['$scope', 'HB_notification', 'courseDetailService', '$stateParams', '$state', function ($scope, HB_notification, courseDetailService, $stateParams, $state) {
        $scope.model = {
            selectIndex: 0
        };
        $scope.events = {
            select: function (index) {
                $scope.model.selectIndex = index;
            },
            /**
             * 播放课程
             */
            playCourse: function (courseId, coursewareId) {
                if ($stateParams.playType) {
                    var url = '/front/#/play/' + courseId + '/1' + '/' + coursewareId;
                } else {
                    var url = '/front/#/play/' + courseId + '/2' + '/' + coursewareId;
                }
                window.open(url)
            },
            goBack: function (e) {
                e.preventDefault();

                $state.go($stateParams.states);
            }
        };
        function findLessonInfo() {
            courseDetailService.getCourseInfo($stateParams.courseId).then(function (data) {
                if (data.status) {
                    $scope.model.course = data.info;
                }
            });
        }

        function init() {
            findLessonInfo();
        }

        init();
    }];
});
