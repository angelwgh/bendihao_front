/**
 * Created by Administrator on 2015/8/2.
 */
define(function(){

    return ['Restangular', function(Restangular){

        var base = Restangular.withConfig(function(config){
           config.setBaseUrl("/FxbManager/SecondHandController");
        });

        return {
            save: function(feedback) {
                return base.all('create').post(feedback);
            },

            update: function(feedback) {
                return base.all('updateFeedback/' + feedback.id).post(feedback);
            },

            queryById: function(id) {
                return base.one('queryMongoById/' + id).get();
            }
        };
    }];
});
