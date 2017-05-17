define(function () {
    'use strict';
    return ['$timeout', '$http', function ($timeout, $http) {
        return {
            require: "ngModel",
            link: function (scope, element, attributes, ngModel) {
                if (!ngModel) {
                    return
                }

                if (!attributes['ajaxUrl']) {
                    throw new Error('url must offer!');
                }
                var url = attributes['ajaxUrl'];

                element.on('keyup', function () {
                    $timeout.cancel(ngModel.timer);
                    ngModel.timer = $timeout(function () {
                        ngModel.$setValidity('ajaxValidate', false);
                        if (url) {
                            // 设置默认有url的时候标示我要去请求， 并且默认设置这个校验的值是false的
                            var value = element.val();
                            // 如果其他的校验都没有校验完成， 就不执行ajax的校验
                            for (var pro in ngModel.$error) {
                                if (pro !== 'ajaxValidate') {
                                    if (ngModel.$error[pro]) return false;
                                }
                            }
                            var postData = scope[attributes['ajaxData']] ? scope[attributes['ajaxData']] : {};

                            // 判断这个上面的ajax校验是否通过， 如果通过了 就再校验
                            if (ngModel.$error['ajaxValidate']) {
                                // 如果
                                postData.field = value;
                                $http({
                                    method: 'GET', url: url, params: postData
                                }).success(function (data) {
                                    // 如果返回的结果的data里面带的info为true说明存在， 则valid 为false, $error.ajaxValidate = true
                                    ngModel.$setValidity('ajaxValidate', !data.info);
                                })
                            }
                        }
                    }, 500);
                });
            }
        };
    }]
});
