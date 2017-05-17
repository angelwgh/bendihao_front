/**
 * Created by Administrator on 2015/8/12.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/personInfo');
        });

        return {
            updatePersonInfo: function (personInfo) {
                return base.all("update/" + personInfo.id).post(personInfo);
            },
            personInfo: function () {
                return base.one("personInfo").get();
            },
            random6Number: function (type, send) {
                return base.one("random6Number/" + type).get({send: send});
            },
            findRandomNumber: function (type) {
                return base.one("findRandomNumber/" + type).get();
            },
            findRandomNumberValidate: function (personInfo) {
                return base.one("findRandomNumber").get({type: personInfo.type, code: personInfo.code});
            },
            findEmailRandomNumber: function (emailInfo) {
                return base.one("findEmailRandomNumber").get({type: emailInfo.type, code: emailInfo.code});
            }
        };

    }];
});
