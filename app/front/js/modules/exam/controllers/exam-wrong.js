define(function () {
    'use strict';
    return ['$scope', 'examService', 'HB_notification', '$state', function ($scope, examService, HB_notification, $state) {
        $scope.model = {
            wrongParams: {
                pageNo: 1,
                pageSize: 5
            },
            wrongs: [],
            maxSize: 5,
            bigTotalItems: 0
        };
        $scope.events = {
            /**
             * 分页下标改变
             * @param bigCurrentPage
             */
            pageChange: function () {
                findWrongQuestionPage();
            },
            showLeftDatePicker: function ($e) {
                $scope.model.leftOpened = !$scope.model.leftOpened;
                $e.stopPropagation();
            },
            /**
             * 查看多个考试名称
             */
            viewExamNames: function (examNames, e) {
                e.preventDefault();
                $scope.model.showView = true;
                $scope.model.examNames = examNames;
                HB_notification.content($scope, '试题所属考试', 'views/exam/wrong-dialog.html' /**所属考试名称*/);
            },
            /**
             * 查看多个考试名称
             */
            viewQuestion: function (question, e) {
                e.preventDefault();
                $state.go('states.questionView', {
                    questionId: question.questionId,
                    questionType: question.questionType,
                    states: 'states.exam.wrong'
                })
            },
            showRightDatePicker: function ($e) {
                $scope.model.rightOpened = !$scope.model.rightOpened;
                $e.stopPropagation();

            },
            /**
             * 查询
             */
            search: function () {
                $scope.model.wrongParams.pageNo = 1;
                findWrongQuestionPage();
            },
            /**
             *
             * @param e
             */
            toSearch: function (e) {
                if (e.keyCode == 13) {
                    $scope.model.wrongParams.pageNo = 1;
                    findWrongQuestionPage();
                }
            },
            /**
             * 按时间搜索
             * @param e
             * @param seledtIndex
             * @param value
             */
            searchTime: function (e, seledtIndex, value) {
                e.preventDefault();
                $scope.model.seledtIndex = seledtIndex;
            }
        };
        function findWrongQuestionPage() {
            examService.findWrongQuestionPage($scope.model.wrongParams).then(function (data) {
                if (data.status) {
                    $scope.model.wrongs = data.info;
                    $scope.model.bigTotalItems = data.totalSize
                }
            });

        }

        function init() {
            findWrongQuestionPage();
        }

        init();
    }
    ];
})
;
