define([
    'angular',
    'const/global-constants',
    'directives/remote-validate-directive',
    'directives/compare-to-directive',
    'modules/productManager/controllers/productManager-ctrl',
    'modules/productManager/services/productManager-service', 'restangular',
    'services/kendoui-commons',
    'services/kendoui-constants'
],
function (angular, global, validateDirective, compareToDirective, productManagerCtrl, productManagerService) {'use strict';
  return angular.module('app.productManager', ['restangular','kendo.ui.constants', 'kendo.ui.commons'])
    .constant('global', global)
    .directive ('ajaxValidate', validateDirective)
    .directive('compare', compareToDirective)//引入匹配校验指令
    .controller('app.productManager.productManagerCtrl', productManagerCtrl)
    .factory('productManagerService', productManagerService);
});
