/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/FxbManager/recommendController');
        });
        return {
            queryRecommendUser: function (uid) {
                return base.one('queryRecommendUser').get({uid: uid});
            }
        };
    }]
});
