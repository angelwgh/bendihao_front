define(['angularUiRouter', 'modules/exam/main'], function () {
    'use strict';
    return angular.module('app.states.exam', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider
                .state('states.exam', {
                    url: '/exam',
                    sticky: true,
                    views: {
                        '@': {
                            templateUrl: 'views/exam/exam-basic.html',
                            controller: 'app.exam.basic'
                        }
                    }
                })
                .state('states.exam.info', {
                    url: '/info/:roundId/:examModeType/:dimension/:location/:paperId',
                    views: {
                        '@': {
                            templateUrl: 'views/exam/exam-info.html',
                            controller: 'app.exam.info'
                        }
                    }
                })
                .state ('states.exam.all', {
                    url: '/all',
                    views: {
                        '': {
                            templateUrl:'views/exam/exam-all.html',
                            controller: 'app.exam.all'
                        }
                    }
                })
                .state ('states.exam.wait', {
                    url: '/wait',
                    views: {
                        '': {
                            templateUrl:'views/exam/exam-wait.html',
                            controller: 'app.exam.wait'
                        }
                    }
                })
                .state ('states.exam.finish', {
                    url: '/finish',
                    views: {
                        '': {
                            templateUrl:'views/exam/exam-finish.html',
                            controller: 'app.exam.finish'
                        }
                    }
                })
                .state ('states.exam.lost', {
                    url: '/lost',
                    views: {
                        '': {
                            templateUrl:'views/exam/exam-lost.html',
                            controller: 'app.exam.lost'
                        }
                    }
                })
                .state ('states.exam.wrong', {
                    url: '/wrong',
                    views: {
                        '': {
                            templateUrl:'views/exam/exam-wrong.html',
                            controller: 'app.exam.wrong'
                        }
                    }
                });

        });
});
