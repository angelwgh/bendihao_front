/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/FxbManager/shopController');
        });
        return {
            getAdminAccountList: function (params) {
                return base.one('queryShopList').get(params);
            },
            query: function (shopId) {
                return base.one('query').get({shopId: shopId});
            },
            update: function (shopInfo) {
                return base.all('update').post(shopInfo);
            },
            /*save: function(adminAccount, typeid) {
             //return Restangular.all("create").post(adminAccount);
             return Restangular.one("/web/admin/adminAccountAction/create").customPOST({adminAccount: adminAccount, typeid: typeid}, undefined, undefined, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
             }*/
            save: function (shopInfo) {
                return base.all("create").post(shopInfo);
            },
            enable: function (userId) {
                return base.one("enable").get({userId: userId});
            },
            enables: function (userIdList) {
                return base.all("enables").post(userIdList);
            },
            suspend: function (ids, isOpen) {
                return base.one("updateShopIsOpen").get({sid: ids, isOpen: isOpen});
            },
            suspends: function (userIdList) {
                return base.all("suspends").post(userIdList);
            },
            fire: function (userId) {
                return base.one("fire").get({userId: userId});
            },
            deletes: function (shopIds) {
                return base.all("deletes").post(shopIds);
            },
            reset: function (userId) {
                return base.one("reset").get({userId: userId});
            },
            resets: function (userIdList) {
                return base.all("resets").post(userIdList);
            },
            delete: function (sid) {
                return base.one("delete").get({sid: sid});
            }
        };
    }]
});
