define(['angularUiRouter', 'modules/mySelectCourse/main'], function () {
    'use strict';
    return angular.module('app.states.mySelectCourse', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.mySelectCourse', {
            url: '/mySelectCourse',
            sticky: true,
            views: {
                '@': {
                    templateUrl: 'views/mySelectCourse/mySelectCourse.html',
                    controller: 'app.mySelectCourse.mySelectCourseCtrl'
                }
            }
        })
            .state('states.mySelectCourse.add', {
            url: '/add',
            views: {
                '': {
                    templateUrl: 'views/mySelectCourse/add.html',
                    controller: 'app.mySelectCourse.chooseCourseCenterCtrl'
                }
            }
        });
    });
});
