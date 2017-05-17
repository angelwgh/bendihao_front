/**
 * @author 亡灵走秀
 * 用来校验密码是否与compare对应的模型值一致，如果不一致，则设置为不通过，
 *                    反之。。。。
 */
define (function () {
	'use strict';
	return ['$timeout', function ($timeout) {
		return {
			require: "ngModel",
			link: function (scope, element, attributes, ngModel) {
				if (!ngModel) return;

				function setValidity (myValue, compareValue) {
					var result = myValue === compareValue;
					$timeout (function () {
						ngModel.$setValidity ('compare', result);
					});
				}

				element.on ('keyup change', function () {
					setValidity (scope.$eval (attributes.compare), element.val ());
				});

				scope.$watch (attributes['compare'], function (value) {
					setValidity (element.val (), value);
				});
			}
		};
	}]
});
