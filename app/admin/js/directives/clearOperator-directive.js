/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/7/27
 * 时间: 9:58
 *
 */

define (function () {
	'use strict';
	return ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attr, ngModelCtrl) {
				var isIe8 = (function (ua) {
					var ie = ua.match (/MSIE\s([\d\.]+)/) ||
						ua.match (/(?:trident)(?:.*rv:([\w.]+))?/i);
					return ie && parseFloat (ie[1]);
				}) (navigator.userAgent);
				isIe8 ? 1 : (function () {
					var $ele = $ (element),

						clearOp = $ ('<span class="k-icon k-i-close"></span>')
							.css ({position: 'relative', left: '-20px', cursor: 'pointer', display: 'none'}),
						reEle = $ele.after (clearOp);
					reEle.css ({paddingRight: '20px'});

					$timeout (function () {
						if (reEle.val () !== '') {
							toggle ('inline-block');
						}
					});

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
				}) ();
			}
		}
	}];
})