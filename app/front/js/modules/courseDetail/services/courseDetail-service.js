/**
 * Created by Administrator on 2015/8/21.
 */
define(function () {
    'use strict'
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/myObligatory');
        });

        return {
            getCourseInfo: function (courseId) {
                return base.one('getCourseInfo').get({courseId: courseId});
            }
        };
    }]
});
