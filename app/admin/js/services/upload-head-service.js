/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/3
 * 时间: 19:36
 *
 */

define (function () {
	var factory = function ($rootScope) {
		console.log ($rootScope);
		this.name = 1;
		return this;
	};
	return ['$rootScope', factory];
});