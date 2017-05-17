define (['angular',
		'modules/usermanage/controllers/usermanage-ctrl',
		'directives/pager-directive'
	],
	function (angular, usermanageCtrl, pagerDirective) {
		'use strict';
		return angular.module ('app.usermanage', []).controller ('app.usermanage.usermanageCtrl', usermanageCtrl);

	});
