define([
        'angular',
        'modules/playCourse/controllers/play-ctrl',
        "modules/playCourse/services/play-service"
    ],
    function (angular, playCtrl, playService) {
        'use strict';
        return angular.module('app.play', [])
            .controller('app.play.playCtrl', playCtrl)
            .factory('lessonPlayService', playService)
    });
