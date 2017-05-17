/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/15
 * 时间: 15:36
 *

 */
define (['angular'], function (angular) {
	'use strict';
	// 用angular的常量方式保存关于kendo的一些默认的配置
	angular.module ('kendo.ui.constants', [])
	/** 按钮*/
		.constant ('KENDO_UI_WINDOW'
		, {
			title: false,
			modal: true,
			resizable: false,
			draggable: false,
			visible: false,
			open: function () {
				this.center ();
			}

		})
});
