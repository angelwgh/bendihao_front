/**
 * Created by Administrator on 2015/8/2.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl("/web/front/feedbackFront");
        });

        return {
            create: function (feedback) {
                return base.all('create').post(feedback);
            }
        };
    }];
});
