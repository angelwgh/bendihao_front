
define (['angular'], function (angular) {

	'use strict';
	var validateRuleModule = angular.module ('validate.rules.extend', []);

	validateRuleModule.directive ('compare', ['$timeout', function ($timeout) {
		return {
			require: "ngModel",
			scope: {
				otherModelValue: "=compare"
			},
			link: function (scope, element, attributes, ngModel) {
				if (!ngModel) return;

				function setValidity (myValue, compareValue) {
					var result = myValue === compareValue;
					$timeout (function () {
						ngModel.$setValidity ('compare', result);
					});
				}

				element.on ('keyup change', function () {
					setValidity (scope.otherModelValue, element.val ());
				});

				scope.$watch ("otherModelValue", function (value) {
					setValidity (element.val (), value);
				});
			}
		};
	}]);

	validateRuleModule.directive ('ajaxValidate', ['$timeout', '$http', function ($timeout, $http) {
		return {
			require: "ngModel",
			link: function (scope, element, attributes, ngModel) {
				if (!ngModel) {
					return
				}

				if (!attributes['ajaxUrl']) {
					throw new Error ('url must offer!');
				}
				var url = attributes['ajaxUrl'];

				element.on ('change', function () {
					ngModel.$setValidity ('ajaxValidate', false);
					if (url) {
						// ����Ĭ����url��ʱ���ʾ��Ҫȥ���� ����Ĭ���������У���ֵ��false��
						var value = element.val (),
							requestUrl = '';
						for (var pro in ngModel.$error) {
							if (pro !== 'ajaxValidate') {
								if (ngModel.$error[pro]) return false;
							}
						}
						if (value) {
							var sign = '?';
							if (url.lastIndexOf (sign) !== -1) {
								sign = '&';
							}
							requestUrl = url + sign + 'field=' + value;
						}
						if (ngModel.$error['ajaxValidate']) {
							$http ({method: 'GET', url: requestUrl}).success (function (data) {
								ngModel.$setValidity ('ajaxValidate', data.info);
							})
						}
					}
				});
			}
		};
	}]);

});