define([
    'angular',
    'const/global-constants',
    'directives/remote-validate-directive',
    'directives/compare-to-directive',
    'directives/upload-shop-directive',
    'modules/shopManager/controllers/shopManager-ctrl',
    'modules/shopManager/services/shopManager-service', 
    'restangular',
    'services/kendoui-commons',
    'services/kendoui-constants'
],
function (angular, global, validateDirective, compareToDirective, uploadShop, shopManagerCtrl, shopManagerService) {'use strict';
  return angular.module('app.shopManager', ['restangular','kendo.ui.constants', 'kendo.ui.commons'])
    .constant('global', global)
    .directive ('ajaxValidate', validateDirective)
    .directive('compare', compareToDirective)//引入匹配校验指令
    .directive ('uploadShop', uploadShop)
    .controller('app.shopManager.shopManagerCtrl', shopManagerCtrl)
    .factory('shopManagerService', shopManagerService);
});
