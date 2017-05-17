/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */

define(['const/global-constants', 'webuploader.flashonly', 'angular', 'lodash'], function (constant_, WebUploader, angular, _) {
    'use strict';
    /**
     * 实例化的对象
     * @param $scope
     * @param $targetElement
     * @param targetAttributes
     * @constructor
     */
    function Hb_uploader($scope, $targetElement, targetAttributes,
                         $log, ngModelCtrl, $timeout, $compile, lessonResourceManageService, hbBasicData) {
        this.version = '0.0.0.1';
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.$log = $log;
        this.$ngModelCtrl = ngModelCtrl;
        this.name = 'Hb_uploader';
        this.$targetElement = $targetElement;
        this.targetAttributes = targetAttributes;
        this.lessonResourceManageService = lessonResourceManageService;
        this.hbBasicData = hbBasicData;
        this.dependOn = 'webuploader';
        this.events = {
            /*
             * param -- file {File}File对象
             *
             * 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
             */
            beforeFileQueued: 'beforeFileQueued',
            /*
             * param --file {File}File对象
             *
             * 当文件被加入队列以后触发。
             */
            fileQueued: 'fileQueued',
            /*
             * param --file {File}File对象
             * 当文件被移除队列后触发。
             */
            fileDequeued: 'fileDequeued',
            /*
             * param --file {File}File对象
             * 某个文件开始上传前触发，一个文件只会触发一次
             */
            uploadStart: 'uploadStart',
            /*
             * param --file {File}File对象
             *			percentage {Number}上传进度
             * 上传过程中触发，携带上传进度。
             */
            uploadProgress: 'uploadProgress',
            /*
             * param --file {File}File对象
             *			reason {String}出错的code
             *	当文件上传出错时触发。
             */
            uploadError: 'uploadError',
            /*
             * param --file {File}File对象
             *			response {Object}服务端返回的数据
             *	当文件上传成功时触发。
             */
            uploadSuccess: 'uploadSuccess',
            /*
             * param --file {File} [可选]File对象
             * 	不管成功或者失败，文件上传完成时触发。
             */
            uploadComplete: 'uploadComplete',
            /*
             * param --type {String}错误类型。
             * 	当validate不通过时，会以派送错误事件的形式通知调用者。
             * 	通过upload.on('error', handler)可以捕获到此类错误，目前有以下错误会在特定的情况下派送错来。
             *
             *	Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
             *	Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
             *	Q_TYPE_DENIED 当文件类型不满足时触发。。
             */
            error: 'error'
        };

        this.defaultConfiguration = $.extend({}, {
            // {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
            // {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
            disableGlobalDnd: false, dnd: undefined,
            pick: {
                id: $targetElement || undefined,
                innerHTML: targetAttributes.buttonText || '选择文件',
                //{Boolean} 是否开起同时选择多个文件能力。
                multiple: false
            },
            accept: {
                title: 'files',
                extensions: 'doc,docx,xls,xlsx,ppt,pdf,txt,flv,mp4,avi,mpeg,mpg,wmv,zip' || undefined
            },
            formData: {a: 1},
            auto: false,
            //chunked: true, //{Boolean} [可选] [默认值：false] 是否要分片处理大文件上传。
            //chunkSize: 5242880,//{Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
            //chunkRetry: 3, //{Boolean} [可选] [默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
            swf: constant_.webUploaderSwfDir,
            server: this.hbBasicData.imageSourceConfig.uploadImageUrl,
            // 上传最大并发数: 默认---3
            threads: 3
        }, targetAttributes);


        this.__init();
    }

    Hb_uploader.prototype.__init = function () {
        /**
         * 适应三种类型的上传，
         *            1. 光图片上传
         *            2. 课件上传 (带进度条)
         *            3. 头像上传 (带剪切)
         * @type {this.defaultConfiguration}
         */
        this.uploaderInstance = WebUploader.create(this.defaultConfiguration);
        this.$targetElement.data('webuploader', this.uploaderInstance);
        this.$scope.uploadFileInstances = this.$scope.uploadFileInstances || [];
        var that = this;
        if (that.targetAttributes.id) {
            this.$scope.uploadFileInstances.push({
                fileInstanceId: that.targetAttributes.id,
                instance: this.uploaderInstance
            })
        }
        __eventBinding.call(this);
    };

    function __eventBinding() {
        var that = this,
            instance = that.uploaderInstance;
        if (that.targetAttributes.fileAcceptType) {
            that.$scope.$watch(that.targetAttributes.fileAcceptType, function (oldValue, newValue) {
                if (typeof that.targetAttributes.fileAcceptType !== 'undefined'
                    && that.targetAttributes.fileAcceptType !== '') {
                    that.$timeout(function () {
                        instance.option('accept', {extensions: that.$scope.$eval(that.targetAttributes.fileAcceptType)});
                    })
                }
            });
        }

        that.$scope.Hb_uploadFile = function () {
            var file = instance.getFiles(),
                todo = true;

            if (file.length <= 0) {
                that.$scope.globle.showTip('请选择要上传的文件!', 'error');
            } else {
                angular.forEach(file, function (data) {
                    if (!data.nameNull) {
                        that.$scope.globle.showTip('课件名称不能为空!', 'error');
                        todo = false;
                        return false;
                    }
                    if (!data.nameRepeat) {
                        that.$scope.globle.showTip('课件名称不能重复!', 'error');
                        todo = false;
                        return false;
                    }
                    if (!data.nameToo) {
                        that.$scope.globle.showTip('课件名称不能太长!', 'error');
                        todo = false;
                        return false;
                    }

                });
                if (todo) {
                    instance.upload();
                }
            }
        };

        that.$scope.Hb_deleteFile = function (file) {
            that.$scope.globle.confirm('提示', '是否需要删除课件', function () {
                if (file.courseOutlineId) {
                    that.lessonResourceManageService.deleteCourseOutline(file.courseOutlineId).then(function (data) {
                        if (data.status) {
                            _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                                return item.id === file.id;
                            });
                            return false;
                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }
                    });
                } else {
                    if (file.record) {
                        _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                            return item.id === file.id;
                        });
                        angular.forEach(that.$scope.model.coursewareList, function (data) {
                            if (data.id == file.id) {
                                data.select = false;
                                return false;
                            }
                        });
                        return false;
                    }
                    /**
                     * 移除文件， 后面的参数表示从queue中一并移除
                     */
                    instance.removeFile(file, true);
                }

            });

        };

        that.$scope.Hb_upMoveFile = function (id) {
            // todo 翁鹏飞
        };

        that.$scope.Hb_downMoveFile = function (id) {
            // todo 翁鹏飞
        };

        /**
         * 当文件加入队列后触发的事件
         */
        instance.on(that.events.fileQueued, function (file) {
            that.$timeout(function () {
                var courseOutline = that.$scope.model.courseOutlines[that.$scope.model.selectIndex],
                    currentSort = 0;
                if (courseOutline.subCourseOutlines.length > 0) {
                    currentSort = courseOutline.subCourseOutlines[courseOutline.subCourseOutlines.length - 1].sort;
                }
                file.progress = 0;
                file.renameName = file.name.substring(0, file.name.lastIndexOf('.'));
                file.type = getType(file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length));
                file.formatSize = WebUploader.formatSize(file.size);
                file.uploadSuccess = false;
                if (file.name.length == 0) {
                    //that.$scope.globle.showTip('文件的名称不能太长!', 'error');
                    file.nameNull = false;
                } else {
                    file.nameNull = true;
                }
                if (file.name.length > 32) {
                    //that.$scope.globle.showTip('文件的名称不能太长!', 'error');
                    file.nameToo = false;
                } else {
                    file.nameToo = true;

                }
                file.nameRepeat = true;

                file.sort = ++currentSort;
                that.$ngModelCtrl.$viewValue.push(file);
            });
        });

        instance.on(that.events.uploadProgress, function (file, percentage) {
            that.$timeout(function () {
                file.progress = parseInt(percentage * 100);
                //var myFile = _.find (that.$ngModelCtrl.$viewValue, function (item) {
                //	return item.hash === file.__hash;
                //});
                //myFile.fileProgress = parseInt (percentage * 100);
            })

        });

        /**
         * 为其设定
         * type:
         *        image|files
         */
        instance.on(that.events.uploadSuccess, function (file, response) {
            that.$timeout(function () {
                var obj = angular.fromJson(response);
                if (angular.isObject(obj)) {
                    var courseware = {
                        videoClarityList: file.videoClarityList,
                        supplierId: that.$scope.model.supplierId,
                        coursewareResourcePath: obj.newPath,
                        expandData: file.formatSize,
                        name: file.name
                    };
                    that.lessonResourceManageService.createCourseware(courseware).then(function (data) {
                        if (data.status) {
                            file.uploadSuccess = true;
                            file.cweId = data.info;
                        } else {
                            /**
                             * 移除文件， 后面的参数表示从queue中一并移除
                             */
                            instance.removeFile(file, true);
                        }

                    });
                }
            });
            // 重置上传插件
            //instance.reset ();
        });

        instance.on(that.events.uploadStart, function (file) {
            file.name = file.renameName;
        });

        instance.on(that.events.beforeFileQueued, function (file) {
            var selectExist = __checkExist(instance, file);
            var fileExt = file.ext,
                mediaFormatSuffix = 'avi rmvb rm asf divx mpg mpeg mpe wmv mp4 mkv vob',
                repeat = false,
                name = file.name.substring(0, file.name.lastIndexOf('.')),
                exist = mediaFormatSuffix.indexOf(fileExt);
            if (selectExist) {
                that.$scope.globle.showTip('已经有选中的文件在队列中!', 'error');
                return false;
            }
            angular.forEach(that.$scope.model.courseOutlines[that.$scope.model.selectIndex].subCourseOutlines, function (data) {
                if (data.renameName == name) {
                    repeat = true;
                    that.$scope.globle.showTip('文件的名称不能重复!', 'error');
                    return false;
                }
            });
            if (repeat) {
                return false;
            }
            if (exist !== -1) {
                file.formatSize = WebUploader.formatSize(file.size);
                that.$scope.$$file = file;
                that.$scope.$$file.videoClarityList = [];
                that.$scope.__choose_media_options = {
                    title: false, resizable: false, draggable: false, modal: true, width: 400, height: 410,
                    open: function (e) {
                        var $this = this.element,
                            $parent = $this.parent();
                        $parent.css({
                            top: '50%', left: '50%',
                            marginTop: '-' + (410 / 2) + 'px',
                            marginLeft: '-' + (400 / 2) + 'px', position: 'fixed!important'
                        });
                    },
                    content: 'templates/common/choose-media.html'
                };
                that.$scope.checkBoxCheck = function (e) {
                    if (e.currentTarget.checked) {
                        that.$scope.$$file.videoClarityList.push(e.currentTarget.value);
                    } else {
                        var index = that.$scope.$$file.videoClarityList.indexOf(e.currentTarget.value);
                        that.$scope.$$file.videoClarityList.splice(index, 1);
                    }
                };
                that.$scope.checkSpan = function (e) {
                    var s = $(e.target).prev();
                    var val = s.val()
                    if (s.is(':checked')) {
                        var index = that.$scope.$$file.videoClarityList.indexOf(s.val());
                        that.$scope.$$file.videoClarityList.splice(index, 1);
                        s.prop('checked', false);
                    } else {
                        that.$scope.$$file.videoClarityList.push(s.val());
                        s.prop('checked', true);
                    }
                };

                that.$scope.closeWindow = function () {
                    instance.removeFile(that.$scope.$$file, true);
                    that.$scope.__choose_media_window.close();
                };

                that.$scope.saveAddToQueue = function () {
                    if (that.$scope.$$file.videoClarityList == null || that.$scope.$$file.videoClarityList.length == 0) {
                        that.$scope.globle.showTip('请选择转码参数!', 'error');
                        return false;
                    }
                    that.$scope.__choose_media_window.close();
                };
                $('html').append(that.$compile('<div kendo-window="__choose_media_window" k-options="__choose_media_options"></div>')(that.$scope));
            }

        });

        /**
         * 文件从队列中被删除
         */
        instance.on(that.events.fileDequeued, function (file) {
            that.$timeout(function () {
                var hash = file.__hash;
                _.remove(that.$ngModelCtrl.$viewValue, function (item) {
                    return item.__hash === hash;
                });
            })
        });
    }

    function __checkExist(instance, file) {
        var files = instance.getFiles();
        // 如果选中的文件当中的数组的索引小于等于0的话，返回false --- 选中的文件没有在队列中
        if (files.length <= 0) return false;


        var result = _.find(files, function (__file__) {
            return __file__.name === file.name;
        });
        // 如果查询到的对象不为undefined就是存在
        return typeof result !== 'undefined';
    }

    /**
     * 获取上传课件的类型 1为文档、2为视频、3压缩类型
     * @param data
     */
    function getType(data) {
        // doc,docx,xls,xlsx,ppt,pdf,txt,flv,mp4,avi,mpeg,mpg,wmv,zip
        if (data == 'zip') {
            return 3;
        } else if (data == 'doc' || data == 'docx' || data == 'xls' || data == 'xlsx' || data == 'ppt' || data == 'txt') {
            return 1;
        } else {
            return 2;
        }
    }

    /**
     * 创建模块
     * @type {module}
     */
    var webUploaderDirective = ['$timeout', '$compile', '$log', 'lessonResourceManageService', 'hbBasicData',
        function ($timeout, $compile, $log, lessonResourceManageService, hbBasicData) {
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
                        throw new Error('元素节点上面必须要有ngModel指定对象!');
                    }

                    $timeout(function () {
                        new Hb_uploader(scope, element, attributes, $log,
                            ngModelCtrl, $timeout, $compile, lessonResourceManageService, hbBasicData);
                    });
                }
            };
        }];

    return webUploaderDirective;
});

