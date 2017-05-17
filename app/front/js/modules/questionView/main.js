/**
 * Created by Administrator on 2015/8/20.
 */
define([
        'angular',
        'modules/questionView/controller/questionView-ctrl',
        'modules/questionView/services/questionView-service'
    ],
    function (angular, questionViewCtrl, questionViewService) {
        'use strict'
        return angular.module('app.questionView', [])
            .controller('app.questionView.questionViewCtrl', questionViewCtrl)
            .factory('questionViewService', questionViewService)
    });
