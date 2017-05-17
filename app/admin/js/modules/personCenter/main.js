define ([
	'angular',
	'const/global-constants',
	'modules/personCenter/controllers/personCenter-ctrl',
	'modules/personCenter/services/personCenter-service',
	'directives/compare-to-directive',
	'directives/upload-head-directive'
], function (angular, global, personCenterCtrl, personCenterService, compareToDirective, uploadHead) {
	'use strict';
	return angular.module ('app.personCenter', [])
		.constant ('global', global)
		.directive ('compare', compareToDirective)//引入匹配校验指令
		.directive ('uploadHead', uploadHead)
		.controller ('app.personCenter.personCenterCtrl', personCenterCtrl)
		.factory ('personCenterService', personCenterService)
});
