define(['angularUiRouter', 'modules/questionView/main'], function () {
    'use strict';
    return angular.module('app.states.questionView', ['ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state("states.questionView", {
                    url: "/questionView/:questionId/:questionType/:states",
                    sticky: true,
                    views: {
                        '@': {
                            templateUrl: 'templates/common/questionView.html',
                            controller: 'app.questionView.questionViewCtrl'
                        }
                    }
                })
        });
});
