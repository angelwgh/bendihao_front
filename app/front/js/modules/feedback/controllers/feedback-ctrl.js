define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'feedbackService', function ($scope, HB_notification, feedbackService) {

        $scope.model = {
            feedback: {
                type: 1,
                desc: null,
                mobile: null
            }
        };

        $scope.events = {
            create: function () {
                feedbackService.create($scope.model.feedback).then(function (data) {
                    if (data.status) {
                        $scope.model.feedback.type = 1;
                        $scope.model.feedback.desc = null;
                        $scope.model.feedback.mobile = null;
                        //alert("反馈留言成功！");
                        HB_notification.showTip("反馈留言成功！", "success");
                    } else {
                        //alert("反馈留言失败！");
                        HB_notification.showTip("反馈留言失败！", "error");
                    }
                });
            }
        }
    }];
});
