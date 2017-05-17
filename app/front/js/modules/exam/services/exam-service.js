define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var exam = Restangular.withConfig(function (config) {
            config.setBaseUrl('/FxbManager/advertController/');
        });
        var examInfo = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/examInfo/');
        });

        return {
            queryBeforeAdvertList: function (params) {
                return exam.all('queryBeforeAdvertList').post(params);
            },

            examInfo: function (roundId, examModeType, answerPaperId) {
                return examInfo.one('findExamInfo/' + roundId).get({
                    examModeType: examModeType,
                    answerPaperId: answerPaperId
                });
            },
            findStatus: function (examId, status, answerPaperId) {
                return examInfo.one("findStatus/" + examId).get({status: status, answerPaperId: answerPaperId});
            },

            findWrongQuestionPage: function (params) {
                return exam.one("findWrongQuestionPage").get(params);
            },
            saveAdvert: function(advert) {
                return exam.all("addBeforeAdvert").post(advert);
            }

        }
    }]
});
