/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */

define (['const/global-constants', 'webuploader.flashonly', 'angular'],
	function (constant_, WebUploader, angular) {
		'use strict';
		/**
		 * 实例化的对象
		 * @param $scope
		 * @param $targetElement
		 * @param targetAttributes
		 * @constructor
		 */
		function Hb_uploadImage ($scope, $targetElement, targetAttributes,
								 $log, ngModelCtrl, $timeout, hbBasicData) {
			this.version = '0.0.0.1';
			this.$scope = $scope;
			this.$timeout = $timeout;
			this.$log = $log;
			this.hbBasicData = hbBasicData;
			this.$ngModelCtrl = ngModelCtrl;
			this.name = 'Hb_uploadImage';
			this.$targetElement = $targetElement;
			this.targetAttributes = targetAttributes;
			this.events = {
				uploadSuccess: 'uploadSuccess',
				uploadProgress: 'uploadProgress',
				/*
				 * param -- file {File}File对象
				 *
				 * 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
				 */
				beforeFileQueued: 'beforeFileQueued'
			};
			this.defaultConfiguration = $.extend ({}, {
				// {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
				// {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				disableGlobalDnd: false, dnd: undefined,
				runtimeOrder: "flash",
				pick: {
					id: $targetElement || undefined,
					innerHTML: '选择文22件',
					//{Boolean} 是否开起同时选择多个文件能力。
					multiple: false
				},
				accept: {
					title: 'files',
					extensions: this.targetAttributes.extensions || 'jpg,jpeg,bmp,png'
				},
				auto: true,
				swf: constant_.webUploaderSwfDir + '?' + new Date ().getTime (),
				server: this.hbBasicData.imageSourceConfig.uploadImageUrl + '?uploadSync=false',
				// 上传最大并发数: 默认---3
				threads: 3
			}, targetAttributes);
//server: this.hbBasicData.imageSourceConfig.uploadImageUrl + '?uploadSync=false',
			this.__init ();
		}

		Hb_uploadImage.prototype.__init = function () {
			/**
			 * 适应三种类型的上传，
			 *            1. 光图片上传
			 *            2. 课件上传 (带进度条)
			 *            3. 头像上传 (带剪切)
			 * @type {this.defaultConfiguration}
			 */
			this.uploaderInstance = WebUploader.create (this.defaultConfiguration);
			__eventBinding.call (this);
		};

		function __eventBinding () {


			var that = this,
				instance = that.uploaderInstance;
			/**
			 * 为其设定
			 * type:
			 *        image|files
			 */
			instance.on (that.events.uploadSuccess, function (file, response) {
				if (that.targetAttributes.queueContainerId) {
					var id = that.targetAttributes.queueContainerId;
					// 标示为上传图片的时候处理方式
					var imageContainer = $ ('#' + id),
						isImageTag = imageContainer[0].tagName === 'IMG' ? true : false,
						uploadedNewPath = angular.fromJson (response)['jsonBody'][0].saveFile;
					imageContainer = isImageTag ? imageContainer : imageContainer.find ('img');
					imageContainer.attr ('src', constant_.showImageUrl + '/tempfile/' + uploadedNewPath);
				}
				that.$timeout (function () {
					var fileInfo = {
						fileSize: file.size
					};

					fileInfo = _.merge ({}, fileInfo, angular.fromJson (response));
					// *************************
					that.$ngModelCtrl.$setViewValue (fileInfo);
					// *************************
				});
				// 重置上传插件
				instance.reset ();
			});

			instance.on (that.events.uploadProgress, function (file, percentage) {
				if (that.targetAttributes.progressFunc) {
					var progressFunc = that.$scope.$eval (that.targetAttributes.progressFunc);
					progressFunc (percentage);
				}
			});

			instance.on (that.events.beforeFileQueued, function (file) {
				var fileExt = file.ext.toLowerCase (),
					extensions = that.defaultConfiguration.accept.extensions;
				if (extensions.indexOf (fileExt) === -1) {

					that.$scope.globle.showTip ('请上传' + that.defaultConfiguration.accept.extensions + '格式的文件!', 'error');
					return false;
				}
			});

		}

		/**
		 * 创建模块
		 * @type {module}
		 */
		var webUploaderDirective = ['$timeout', '$compile', '$log', 'hbBasicData',
			function ($timeout, $compile, $log, hbBasicData) {
				return {
					require: 'ngModel',
					restrict: 'A',
					/**
					 * 链接函数
					 * @param scope 作用域
					 * @param element 元素
					 * @param attributes 属性
					 * @param ngModelCtrl 控制器
					 */
					link: function (scope, element, attributes, ngModelCtrl) {
						if (!ngModelCtrl) {
							throw new Error ('元素节点上面必须要有ngModel指定对象!');
						}
						$timeout (function () {
							new Hb_uploadImage (scope, element, attributes,
								$log, ngModelCtrl, $timeout, hbBasicData);
						});
					}
				};
			}];

		return webUploaderDirective;

	});

