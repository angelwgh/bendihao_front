define(['angularUiRouter', 'modules/feedback/main'], function () {
    'use strict';
    return angular.module('app.states.feedback', ['ui.router'])
        .config(function ($stateProvider) {
        $stateProvider.state('states.feedback', {
            url: '/feedback',
            sticky: true,
            views: {
                '@': {
                    templateUrl: 'views/feedback/feedback.html',
                    controller: 'app.feedback.feedbackCtrl'
                }
            }
        });
    });
});

