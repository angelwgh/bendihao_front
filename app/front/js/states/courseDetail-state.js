define(['angularUiRouter', 'modules/courseDetail/main'], function () {
    'use strict';
    return angular.module('app.states.courseDetail', ['ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state("states.courseDetail", {
                    url: "/courseDetail/:courseId/:states/:playType",
                    sticky: true,
                    views: {
                        '@': {
                            templateUrl: 'templates/common/course-detail.html',
                            controller: 'app.courseDetail.courseDetailCtrl'
                        }
                    }
                })
        });
});
