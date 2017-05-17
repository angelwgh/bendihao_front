/**
 * Created by Administrator on 2015/8/21.
 */
define(function () {
    'use strict'
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/testQuestion');
        });

        return {
            findQuestionById: function (questionId, questionType) {
                return base.one('findQuestionById').get({questionId: questionId, questionType: questionType});
            }
        };
    }]
});
