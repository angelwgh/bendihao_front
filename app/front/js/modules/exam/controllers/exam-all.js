define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'examService', '$stateParams', '$state', function ($scope, $notify, examService, $stateParams, $state) {

        $scope.model = {
            params: {
                pageNo: 1,
                pageSize: 20
            },

            paperList: []

        };
        $scope.node = {windows: null};

        $scope.events = {
            detail: function(e, paper) {
                e.preventDefault();
                $state.go('states.exam.info', {
                    paperId: paper.id,
                    roundId: paper.examRoundInfo.id,
                    examModeType: paper.examRoundInfo.examModeType,
                    dimension: paper.state,
                    location: 'states.exam.all'
                });
            },

            findMore: function() {
                $scope.model.params.pageNo += 1;
                return examService.queryBeforeAdvertList($scope.model.params).then(function(response) {
                    if (response.state == 1) {
                        if (response.jsonBody.length) {
                            Array.prototype.push.apply($scope.model.paperList, response.jsonBody);
                        } else {
                            $scope.model.params.pageNo -= 1;
                        }
                    } else {
                        $notify.alert('数据加载失败. ' + response.msg);
                    }
                });
            }
        };

        examService.queryBeforeAdvertList($scope.model.params).then(function(response) {
            if (response.state == 1) {
                $scope.model.paperList = response.jsonBody;
            } else {
                $notify.alert('数据加载失败. ' + response.msg);
            }
        });

    }];
});
