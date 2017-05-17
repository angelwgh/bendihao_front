define([
    'angular',
    'const/global-constants',
    'modules/feedback/controllers/feedback-ctrl',
    'modules/feedback/services/feedback-service'
], function (angular, global, feedbackCtrl, feedbackService) {
    'use strict';
    return angular.module('app.feedback', [])
        .constant('global', global)
        .controller('app.feedback.feedbackCtrl', feedbackCtrl)
        .factory('feedbackService', feedbackService)
        ;
});
