define ([
		'angular',
		'modules/personCenter/controllers/personCenter-ctrl'
	],
	function (angular, personCenterCtrl) {
		'use strict';
		return angular.module ('app.personCenter', [])

			.controller ('app.personCenter.personCenterCtrl', personCenterCtrl)

	});
