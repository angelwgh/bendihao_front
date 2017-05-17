define([
    'angular',
    'const/global-constants',
    'modules/feedback/controllers/feedback-ctrl',
    'modules/feedback/controllers/edit-controller',
    'modules/feedback/controllers/view-controller',
    'modules/feedback/services/feedback-service'
], function (angular, global, feedbackCtrl, editController, viewController, feedbackService) {
    'use strict';
    return angular.module('app.feedback', [])
        .constant('global', global)
        .controller ('app.feedback.editController', editController)
        .controller ('app.feedback.viewController', viewController)
        .controller('app.feedback.feedbackCtrl', feedbackCtrl)
        .factory('feedbackService', feedbackService)
        ;
});
