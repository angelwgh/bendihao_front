/**
 * Created by liuhao on 2015/5/15.
 */

define (['app'], function (module) {
	'use strict';

	//todo (wengpengfei)
	return [function () {

		var defaultConfig = {
			defaultMaxPages: 10,
			offset: 0,
			areJumpControlsEnabled: false
		};


		var definition = {
			restrict: 'A',
			scope: {
				currentPage: '@',
				totalPages: '@',
				maxPagesToDisplay: '@',
				pageChanged: '&',
				enableJumpControls: '@'
			},
			replace: true,
			templateUrl: 'ngpager.tpl.html',

			link: function (scope, iElement, iAttrs) {

				scope.changed = function (newPage) {
					if (!newPage && newPage !== 0)
						return;

					if (newPage < 0 || newPage >= scope.totalPages)
						return;

					scope.pageChanged ({pageNum: newPage - defaultConfig.offset});
				};

				var enableJumpControls = scope.enableJumpControls || defaultConfig.areJumpControlsEnabled;

				scope.$watch ('currentPage', updateCurrentPage);
				scope.$watch ('totalPages', updateTotalPages);
				scope.$watch ('maxPagesToDisplay', updateMaxPages);

				function updateTotalPages (totalPages) {
					updatePages (scope.currentPage, totalPages, scope.maxPagesToDisplay || defaultConfig.defaultMaxPages);
				}

				function updateCurrentPage (currentPage) {
					updatePages (currentPage, scope.totalPages, scope.maxPagesToDisplay || defaultConfig.defaultMaxPages);
				}

				function updateMaxPages (maxPages) {
					updatePages (scope.currentPage, scope.totalPages, maxPages || defaultConfig.defaultMaxPages);
				}

				function updatePages (currentPage, totalPages, maxPages) {
					var pages = [];
					currentPage = parseInt (currentPage);
					var selectedPage = currentPage + defaultConfig.offset;
					var firstPage = -defaultConfig.offset;
					var lastPage = totalPages - defaultConfig.offset;

					scope.selectedPage = selectedPage;
					var prelimStart = selectedPage - Math.floor (maxPages / 2);
					var adjustedStart = Math.max (prelimStart, firstPage);
					var prelimEnd = selectedPage + Math.ceil (maxPages / 2) + (adjustedStart - prelimStart);
					var adjustedEnd = Math.min (prelimEnd, lastPage);
					var finalStart = Math.max (firstPage, adjustedStart - (prelimEnd - adjustedEnd));

					for (var i = finalStart; i < adjustedEnd; i++) {
						var pageNumber = i + defaultConfig.offset;
						pages.push ({pageNumber: pageNumber, isCurrent: pageNumber == selectedPage});
					}
					scope.pages = pages;

					if (enableJumpControls) {
						scope.displayFirstPage = finalStart > firstPage;
						scope.hasPreBuffer = finalStart > (firstPage + 1);
						scope.hasPostBuffer = adjustedEnd < (lastPage - 1);
						scope.displayLastPage = adjustedEnd < lastPage;
					}
					else {
						scope.displayFirstPage = false;
						scope.hasPreBuffer = finalStart > firstPage;
						scope.hasPostBuffer = adjustedEnd < lastPage;
						scope.displayLastPage = false;
					}
					scope.hasPreviousPage = selectedPage > 0;
					scope.hasNextPage = selectedPage < totalPages - 1;
					scope.totalPages = totalPages;
				}
			}
		};
		return definition;
	}]
});
