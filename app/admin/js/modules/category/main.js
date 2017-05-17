define(['angular',
  'modules/category/controllers/category-ctrl',
  'modules/category/services/category-service',
  'directives/compare-to-directive',
  'directives/remote-validate-directive',
  'restangular',
  'services/kendoui-constants',
  'services/kendoui-commons'
], function (angular, categoryCtrl, categoryService,compareToDirective,validateDirective) {
  'use strict';
  return angular.module('app.category', ['restangular','kendo.ui.constants', 'kendo.ui.commons'])
    .directive('compare', compareToDirective)//引入匹配校验指令
    .directive ('ajaxValidate', validateDirective)//引入远程校验指令
    .controller('app.category.categoryCtrl', categoryCtrl)//指定视图与controller绑定的名称，与state文件中配置一致
    .factory('categoryService', categoryService);//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
});
