/**
 * Created by Administrator on 2015/8/21.
 */
define(function () {
    'use strict'
    return ['$scope', 'HB_notification', 'questionViewService', '$stateParams', '$state', function ($scope, HB_notification, questionViewService, $stateParams, $state) {
        $scope.model = {
            selectIndex: 0
        };
        $scope.events = {
            select: function (index) {
                $scope.model.selectIndex = index;
            },
            goBack: function (e) {
                e.preventDefault();
                $state.go($stateParams.states);
            }
        };
        function findQuestion() {
            questionViewService.findQuestionById($stateParams.questionId, $stateParams.questionType).then(function (data) {
                if (data.status) {
                    $scope.model.questionView = data.info;
                }
            });
        }

        function init() {
            findQuestion();
        }

        init();
    }];
});
