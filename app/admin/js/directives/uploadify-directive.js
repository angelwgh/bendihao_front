/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */
(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define (['uploadify'], factory (angular));
	} else {
		factory ();
	}
} (function (angular) {

	/**
	 * example:
	 * ---------------------{{result}}-----------------获取最后的上传的值
	 <div uploadify button-text="上传图片" upload-file-result="caonima" auto="false">
	 <input type="file" id="uploadify" name="uploadify"/>
	 <button kendo-button ng-click="upload()">上传</button>
	 </div>
	 */
	return ['$timeout', function ($timeout) {
		return {
			restrict: 'EA',
			transclude: true,
			controller: ['$scope', function ($scope) {
				$scope.progress = 0;
				$scope.uploadProgress = false;
				$scope.uploadSuccess = false;
				$scope.uploadStart = false;
				$scope.uploadError = false;
				$scope.uploadComplete = false;
				this.QUEUE_ERROR = window.SWFUpload.QUEUE_ERROR;
				this.FILE_STATUS = window.SWFUpload.FILE_STATUS;
				this.UPLOAD_ERROR = window.SWFUpload.UPLOAD_ERROR;
			}],
			//replace: true,
			template: '<div ng-transclude></div>',
			link: function (scope, elem, attrs, ctrl) {
				scope.model = scope.model ? scope.model : {};
				var inputInstance = $ (elem),
					commonConfig = {
						//buttonClass: 'k-button k-primary',
						buttonText: '上传文件',
						overrideEvents: ['onDialogClose', 'onSelectError', 'onUploadError'],
						//height: 30,
						uploader: 'http://172.17.0.102:8080/bdResource/Upload?requestContext={customId:1,platformId:1,unitId:1,projectId:1,platformVersionId:1,sourceId:1}&uploadSync=true&context={customId:1,platformId:1,unitId:1,projectId:1,platformVersionId:1,sourceId:1}',
						swf: '../bower_components/uploadify/uploadify.swf',
						//width: 80,
						/**
						 *
						 * @param file
						 */
						onUploadStart: function (file) {
						},
						/**
						 *
						 * @param file 要上传的文件对象
						 * @param bytesUploaded 已经上传了多少字节
						 * @param bytesTotal 文件的总共字节数
						 * @param totalBytesUploaded
						 * @param totalBytesTotal
						 */
						onUploadProgress: function (file, bytesUploaded, bytesTotal,
													totalBytesUploaded, totalBytesTotal) {

						},
						/**
						 *
						 * @param file
						 * @param data
						 * @param response
						 */
						onUploadSuccess: function (file, data, response) {
							if (attrs['uploadFileResult']) {
								apply (function () {
									if (commonConfig['multi']) {
										scope[attrs['uploadFileResult']].push (angular.fromJson (data));
									} else {
										scope[attrs['uploadFileResult']] = angular.fromJson (data);
									}
								});
							}
						},
						/**
						 *
						 * @param file
						 */
						onUploadComplete: function (file) {

						},

						/**
						 *
						 * @param file
						 * @param errorCode
						 * @param errorMsg
						 * @param errorString
						 */
						onUploadError: function (file, errorCode, errorMsg, errorString) {
							var msg = '上传失败';
							switch (errorCode) {
								case ctrl.UPLOAD_ERROR.HTTP_ERROR:
									msg = '上传成功!';
									break;
								case ctrl.UPLOAD_ERROR.MISSING_UPLOAD_URL:
									msg = '没有上传地址!';
									break;
								case ctrl.UPLOAD_ERROR.IO_ERROR:
									msg = 'IO 错误!';
									break;
								case ctrl.UPLOAD_ERROR.SECURITY_ERROR:
									msg = '安全认证不通过!';
									break;
								case ctrl.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
									msg = '超过上传限制!';
									break;
								case ctrl.UPLOAD_ERROR.UPLOAD_FAILED:
									msg = '上传失败!';
									break;
								case ctrl.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
									msg = '上传文件的数量超过限制上传数量!';
									break;
								case ctrl.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
									msg = '文件校验不通过!';
									break;
								case ctrl.UPLOAD_ERROR.FILE_CANCELLED:
									msg = '上传被取消!';
									break;
								case ctrl.UPLOAD_ERROR.UPLOAD_STOPPED:
									msg = '上传被终止!';
									break;
								default:
									break;
							}

							apply (function () {
								scope.model.uploadErrorMessage = msg;
							});
						},

						onSelectError: function (file, errorCode, errorMsg, errorString) {

							var msg = '上传失败';
							switch (errorCode) {
								case ctrl.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
									msg = '上传文件的数量超过限制上传数量!';
									break;
								case ctrl.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
									msg = '文件大小不能超过' + attrs['fileSizeLimit'];
									break;
								case ctrl.QUEUE_ERROR.ZERO_BYTE_FILE:
									msg = '不能上传0字节的文件!';
									break;
								case ctrl.QUEUE_ERROR.INVALID_FILETYPE:
									msg = '文件类型必须为' + attrs['fileTypeExts'];
									break;
								default:
									break;
							}

							apply (function () {
								scope.model.uploadErrorMessage = msg;
							});
						},

						onDialogClose: function (queueData) {
							if (queueData.filesSelected != 0 && queueData.filesErrored === 1) {
								//scope.node.windows.uploadMessageShow.center ().open ();
							}
						},

						/**
						 *
						 * @param instance uploadify的实例对象
						 */
						onInit: function (instance) {
							console.log (instance);
						}
					};


				function apply (fn) {
					if (fn && typeof fn === 'function') {
						scope.$apply (fn);
					}
				}


				elem.css ({width: commonConfig.width + 4, height: commonConfig.height + 4});

				commonConfig = angular.extend (commonConfig, getAttrs ());

				if (commonConfig['multi']) {
					scope[attrs['uploadFileResult']] = [];
				} else {
					scope[attrs['uploadFileResult']] = {};
				}

				$timeout (function () {
					inputInstance.uploadify (commonConfig);
				});

				scope.upload = function () {
					inputInstance.uploadify ('upload', '*');
				};

				function getAttrs () {
					var result = {};
					for (var attr in attrs.$attr) {
						result[attr] = attrs[attr] === "false" || attrs[attr] === "true" ? attrs[attr] !== 'false' : attrs[attr];
					}

					return result;
				}
			}
		}
	}
	]
}));
