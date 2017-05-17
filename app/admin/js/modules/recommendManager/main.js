define([
    'angular',
    'const/global-constants',
    'directives/remote-validate-directive',
    'directives/compare-to-directive',
    'directives/upload-shop-directive',
    'modules/recommendManager/controllers/recommendManager-ctrl',
    'modules/recommendManager/services/recommendManager-service', 
    'restangular',
    'services/kendoui-commons',
    'services/kendoui-constants'
],
function (angular, global, validateDirective, compareToDirective, uploadShop, recommendManagerCtrl, recommendManagerService) {'use strict';
  return angular.module('app.recommendManager', ['restangular','kendo.ui.constants', 'kendo.ui.commons'])
    .constant('global', global)
    .directive ('ajaxValidate', validateDirective)
    .directive('compare', compareToDirective)//引入匹配校验指令
    .directive ('uploadShop', uploadShop)
    .controller('app.recommendManager.recommendManagerCtrl', recommendManagerCtrl)
    .factory('recommendManagerService', recommendManagerService);
});
