define(['angularUiRouter', 'modules/playCourse/main'], function () {
    'use strict';
    return angular.module('app.states.play', [
        'ui.router'
    ]).config(function ($stateProvider,
                        $urlRouterProvider) {
            $stateProvider.state('states.play', {
                url: '/play/:courseId/:playType/:coursewareId',
                sticky: true,
                views: {
                    '@': {
                        templateUrl: 'views/playCourse/index.html',
                        controller: 'app.play.playCtrl'
                    }
                }
            });
        }
    );
});
