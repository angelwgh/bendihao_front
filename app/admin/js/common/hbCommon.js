/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/18
 * 时间: 11:54
 *
 */

define (['angular'], function (angular) {

	var hbCommon = angular.module ('hbCommon', []);

	hbCommon.directive ('hbReadonly', hbReadonly);
	hbCommon.directive ('hbClearInput', hbClearInput);

	hbReadonly.$inject = [];
	function hbReadonly () {
		return {
			link: function ($scope, $element, $attributes) {
				$element.on ('keyup keydown', function () {
					return false;
				})
			}
		}
	}

	hbClearInput.$inject = ['$timeout', '$parse'];
	function hbClearInput ($timeout, $parse) {
		return {
			restrict: 'A',
			require: 'ngModel',
			transclude: true,
			link: function (scope, element, attr, ngModelCtrl) {

				// 获取判断是否是ie8
				var isIe8 = (function (ua) {
					var ie = ua.match (/MSIE\s([\d\.]+)/) ||
						ua.match (/(?:trident)(?:.*rv:([\w.]+))?/i);
					return ie && parseFloat (ie[1]);
				}) (navigator.userAgent);

				function setInfo (width) {
					var $clear = $ ('<span unselectable="on" class="k-icon k-i-close" role="button">select</span>');
					element
						.next ()
						.append ($clear)
						.css ({width: width + 'em'})
						.parent ().css ({paddingRight: width + 'em'});

					$clear.on ('click', function (e) {
						scope.$apply (function () {
							$parse (attr.ngModel).assign (scope, '');
						});
						e.stopPropagation ();
					})
				}

				if (!isIe8) {
					$timeout (function () {
						if (attr['kendoDatetimepicker'] !== undefined) {
							setInfo ('4.8');
						} else if (attr['kendoDatePicker'] !== undefined) {
							setInfo ('2.8');
						} else {
							var $ele = $ (element),
								clearOp = $ ('<span class="k-icon k-i-close"></span>')
									.css ({
									position: 'absolute',
									right: '9px',
									top: '9px',
									cursor: 'pointer',
									display: 'none'
								}),
								reEle = $ele.after (clearOp);

							if (reEle.val () !== '') {
								toggle ('inline-block');
							}
							/**
							 *
							 */
							reEle.on ('keyup', function () {
								var value = reEle.val ();
								if (value !== '') {
									if (!clearOp.is (':hidden')) return;
									toggle ('inline-block');
								} else {
									toggle ('none');
								}
							});
							/**
							 *  切换显示隐藏
							 * @param op
							 */
							function toggle (op) {
								clearOp.css ({display: op});
							}

							clearOp.on ('click', function (e) {
								var nullValue = '';
								reEle.val (nullValue);
								toggle ('none');
								$timeout (function () {
									ngModelCtrl.$setViewValue (nullValue);
								});
							});
						}
					});
				}

			}
		}
	}
});