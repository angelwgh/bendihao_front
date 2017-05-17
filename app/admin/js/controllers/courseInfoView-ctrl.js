define(function () {
    'use strict';
    return ['$scope', '$stateParams', '$state', '$$$audition', function ($scope, $stateParams, $state,$$$audition) {
        $scope.model = {
            selectIndex: 0,
            reviews: [],
            course: {},
            courseOutlines: [],
            pageNo: 1,
            pageSize: 5
        };
        $scope.events = {
            //查看详情页面试听
            tryListen: function (a, b, c) {
                if ($scope.model.course.status == 1) {
                    $$$audition.createDom($stateParams.courseId, b, c);
                }
            },
            viewMore: function (e) {
                $scope.model.pageNo++;
                findCourseReviewPage(true);
                e.preventDefault();
            }
        };

        function init() {
            $scope.model.selectIndex = 0;
            $scope.model.pageNo = 1;
            findCourseReviewPage();
            findLessonInfo();
        }

        init();
    }];

});
