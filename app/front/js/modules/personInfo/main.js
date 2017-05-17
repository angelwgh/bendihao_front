define ([
		'angular',
        'directives/remote-validate-directive',
        'directives/compare-to-directive',
        'const/global-constants',
		'modules/personInfo/controllers/personInfo-ctrl',
        'modules/personInfo/controllers/personImg-ctrl',
        'modules/personInfo/controllers/personModify-ctrl',
		'modules/personInfo/services/personInfo-service',
		'directives/upload-head-directive'
	],
    function (angular, validateDirective, compareToDirective, global, personInfoCtrl, personImgCtrl, personModifyCtrl, personInfoService, hbUploadHead) {
		'use strict';
		return angular.module ('app.personInfo', [])

            .constant('global', global)

            .directive('ajaxValidate', validateDirective)

            .directive('compare', compareToDirective)

			.controller ('app.personInfo.personInfoCtrl', personInfoCtrl)

            .controller('app.personInfo.personImgCtrl', personImgCtrl)

            .controller('app.personInfo.personModifyCtrl', personModifyCtrl)

			.factory ('personInfoService', personInfoService)

			.directive ('hbUploadHead', hbUploadHead)

	});
