define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'examService', '$state', function ($scope, $notify, examService, $state) {

        $scope.model = {
            params: {
                mode: 2,   // 所有课程
                pageNo: 1,
                pageSize: 20
            },

            paperList: []

        };

        $scope.events = {
            detail: function(e, paper) {
                e.preventDefault();
                $state.go('states.exam.info', {
                    paperId: paper.id,
                    roundId: paper.examRoundInfo.id,
                    examModeType: paper.examRoundInfo.examModeType,
                    dimension: paper.state,
                    location: 'states.exam.lost'
                });
            },

            findMore: function() {
                $scope.model.params.pageNo += 1;
                return examService.getMyExamPaper($scope.model.params).then(function(response) {
                    if (response.status) {
                        if (response.info.length) {
                            angular.forEach(response.info, function(paper, index) {
                                paper.beginTime = new Date(paper.beginTime).getTime();
                                paper.endTime = new Date(paper.endTime).getTime();
                            });
                            Array.prototype.push.apply($scope.model.paperList, response.info);
                        } else {
                            $scope.model.params.pageNo -= 1;
                        }
                    } else {
                        $notify.alert('数据加载失败. ' + response.info);
                    }
                });
            }
        };

        examService.getMyExamPaper($scope.model.params).then(function(response) {
            if (response.status) {
                $scope.model.paperList = response.info;
                angular.forEach(response.info, function(paper, index) {
                    paper.beginTime = new Date(paper.beginTime).getTime();
                    paper.endTime = new Date(paper.endTime).getTime();
                });
            } else {
                $notify.alert('数据加载失败. ' + response.info);
            }
        });

    }];
});
