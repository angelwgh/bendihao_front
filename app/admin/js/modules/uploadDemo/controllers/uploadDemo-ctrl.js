define (function () {
	'use strict';
	return ['$scope', '$timeout', '$$$audition', function ($scope, $timeout, $$$audition) {
		$scope.model = {
			uploadHeadValue: '546546546'
		};


		$scope.model.queueTpl = [
			'<li>',
			'<span class="file-tit to"> 1.<span class="ico ico-video"></span>${fileName} (${fileSize})</span>',
			'<span class="upload-progress"><span class="current" style="width: 60%"></span></span>',
			'<span class="file-state">上传完成</span>',
			'<span class="fr-ico">',
			'<a href="#" class="ico-op ico-up"></a>',
			'<a href="#" class="ico-op ico-down"></a>',
			'<a href="#" class="ico-op ico-del"></a>',
			'</span>',
			'</li>'
		].join ('');

		$scope.appendFile = function () {
			$scope.model.uploadFilesValue = $scope.model.uploadFilesValue ? $scope.model.uploadFilesValue : [];
			var time = new Date ().getTime ();
			$scope.model.uploadFilesValue.push ({
				name: '亡灵走秀' + time + '.exe',
				size: 50000,
				formatSize: '5M',
				id: 'file__' + time,
				renameName: '亡灵走秀' + time,
				ext: 'exe',
				record: true
			});
		};
		$scope.openListenWindow = function (a, b, c) {
			$$$audition.createDom (a, b, c);
		}
	}];
});
