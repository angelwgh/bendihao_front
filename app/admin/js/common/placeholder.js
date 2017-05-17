define (['angular'], function (angular, undef) {
	"use strict";
	angular.module ("Placeholder", [])
		.directive ("placeholder", [function () {
		return {
			restrict: "A",
			compile: function ($element, $attributes) {
				placeHolder ($element, true);
				function placeHolder (obj, span) {
					if (!obj.attr ('placeholder')) return;
					var supportPlaceholder = 'placeholder' in document.createElement ('input');
					if (!supportPlaceholder) {
						var defaultValue = obj.attr ('placeholder');
						var type = obj.attr ('type');
						var $placeSpan = $ ('<span></span>').html (defaultValue).css ({
							color: 'gray',
							position: 'absolute',
							width: $element.width (),
							left: $element.position ().left,
							height: $element.height (),
							zIndex: 1,
							top: 0,
							lineHeight: $element.height () + 'px',
							padding: $element.css ('padding')
						});

						$element.before ($placeSpan);

						$placeSpan.on ('click', function () {
							$element.focus ();
							$ (this).hide ();
						}).on ('mouseenter', function () {
							$ (this).css ({
								cursor: 'text'
							})
						});

						$element.keyup (function () {
							var $this = $ (this);
							if ($.trim ($this.val ()) !== '') {
								$placeSpan.hide ();
							} else {
								$placeSpan.show ();
							}
						});
					}
				}
			}
		}
	}]);
});