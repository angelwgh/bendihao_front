define (['angular', 'modules/uploadDemo/controllers/uploadDemo-ctrl'
	, 'directives/upload-image-directive'
	//, 'directives/upload-files-directive'
	, 'directives/upload-head-directive',
	'services/audition'
], function (angular, uploadDemoCtrl, uploadImage,
			 uploadHead) {

	'use strict';

	return angular.module ('app.uploadDemo', ['auditionModule'])
	/**
	 * 模块首页控制器代码
	 */
		.controller ('app.uploadDemo.uploadDemoCtrl', uploadDemoCtrl)

		.directive ('uploadImage', uploadImage)

		.directive ('uploadHead', uploadHead)

});
