/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/7/28
 * 时间: 17:31
 *
 */
define (['const/global-constants', 'webuploader.flashonly', 'cropper'],
	function (constant_, WebUploader) {
		'use strict';
		function Hb_UploadHead ($scope, $targetElement, targetAttributes,
								$timeout, ngModuleCtrl, hbBasicData) {
			this.$timeout = $timeout;
			this.ngModuleCtrl = ngModuleCtrl;
			this.targetAttributes = targetAttributes;
			this.hbBasicData = hbBasicData;
			// 图片展示容器
			this.imagePreviewContainer = $ ('#image_preview_container');
			this.file = null;

			/*
			var flag = false;

			if (targetAttributes.flag === 'n'){
				flag = true;
			}*/
			//
			this.$scope = $scope;
			this.defaultConfiguration = $.extend ({}, {
				// {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
				// {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				disableGlobalDnd: false, dnd: undefined,
				pick: {
					id: '#upload_btn',
					innerHTML: targetAttributes.buttonText || '选择文件',
					//{Boolean} 是否开起同时选择多个文件能力。
					multiple: false
				},

				// 设置用什么方式去生成缩略图。
				thumb: {
					quality: 70,

					// 不允许放大
					allowMagnify: false,

					// 是否采用裁剪模式。如果采用这样可以避免空白内容。
					crop: false
				},
				accept: {
					title: 'files',
					extensions: 'jpg,png'
				},
				auto: false,
				swf: constant_.webUploaderSwfDir,
				server: this.hbBasicData.imageSourceConfig.uploadImageUrl + '?uploadSync=true',
				// 上传最大并发数: 默认---3
				threads: 3
			}, targetAttributes);
			this.events = (function () {
				return {
					/*
					 * param --file {File}File对象
					 *
					 * 当文件被加入队列以后触发。
					 */
					fileQueued: 'fileQueued',
					/*
					 * param --file {File}File对象
					 *			response {Object}服务端返回的数据
					 *	当文件上传成功时触发。
					 */
					uploadSuccess: 'uploadSuccess'
				}
			}) ();
			return this.init ();
		}

		Hb_UploadHead.prototype.init = function () {
			var that = this,
				uploader = WebUploader.Uploader;
			that.uploaderInstance = new uploader (this.defaultConfiguration);
			__eventBinding.call (this);
			return this;
		};

		function __eventBinding () {
			var that = this;
			that.uploaderInstance.on (that.events.fileQueued, function (file) {
				that.file = file;
				that.uploaderInstance.makeThumb (file, function (error, src) {
						if (error) {
							alert ('不能预览');
							return;
						}
						//img = document.createElement ('img');
						//img.src = globleConstant.showImageUrl + $rootScope.globle.editor.insertImage.newPath;
						/*if (that.targetAttributes.flag === 'n'){
							if (that.imagePreviewContainer.attr('src') == 'images/image_container.png') {
								that.imagePreviewContainer.attr ('src', src);
								that.imagePreviewContainer.attr ('width', 80);
								that.imagePreviewContainer.attr ('height', 80);
							} else {
								var img = document.createElement ('img');
								img.src = src;
								img.width = 80;
								img.height = 80;
								that.imagePreviewContainer.after(img);
							}
						} else {
							that.imagePreviewContainer.attr ('src', src);
						}*/
						that.imagePreviewContainer.attr ('src', src);
						
						//
					},
					1 // 当值是0-1的时候 为百分百
					,
					1 // 当值是0-1的时候 为百分百
				);

				//imgConInstance
			});

			that.uploaderInstance.on (that.events.uploadSuccess, function (file, response) {
				that.$timeout (function () {
					var res = angular.fromJson (response);
					that.ngModuleCtrl.$setViewValue (res);
					that.$scope.node.uploadHeadWindow.close ();
				})
			});

		}

		return ['$timeout', '$log', 'hbBasicData', function ($timeout, $log, hbBasicData) {
			return {
				scope: {
					result: '=result',
					closeVar: '=close'
				},
				require: 'ngModel',
				restrict: 'A',
				templateUrl: 'templates/common/upload-shop-image.html',
				link: function (scope, element, attrs, ngModel) {
					var instance = new Hb_UploadHead (scope, element, attrs, $timeout, ngModel, hbBasicData),
						imgCon = instance.imagePreviewContainer;
					scope.windowConfig = {
						title: false,
						visible: true,
						resizable: false,
						draggable: false,
						modal: true,
						open: function () {
							var width = 665,
								height = 530,
								theWindow = this.element.parent ();
							theWindow.css ({
								position: 'fixed',
								left: '50%',
								top: '50%',
								marginLeft: '-' + (width / 2) + 'px',
								marginTop: '-' + (height / 2) + 'px'
							});
							element.show();
						},
						close: function () {
							$timeout (function () {
								scope.closeVar = false;
							}, 500);
						}
					};

					function uploadImg () {
						var server = instance.uploaderInstance.options.server;

						//&needOperate=[{type:\'truncate\',x:40,y:40, width: 50,height:50}]
						instance.uploaderInstance.option ('server', server);

						instance.uploaderInstance.upload ();
					}
					scope.getResult = function () {
						uploadImg ();
					};
				}
			}
		}]
	});
