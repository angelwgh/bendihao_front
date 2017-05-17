/** * Created by admin on 2015/5/11.*/
define (['angular',
	'modules/normal/controllers/normal-ctrl',
	'services/kendoui-constants',
	'services/kendoui-commons',
	'lodash'
], function (angular, normalCtrl) {
	'use strict';
	return angular.module ('app.normal', ['kendo.ui.constants', 'kendo.ui.commons'])
		.controller ('app.normal.normalCtrl', normalCtrl);
});
