/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/29
 * 时间: 14:34
 *
 */

define(['angular', 'jqueryNiceScroll'], function (angular) {
    'use strict';
    var hbNiceScrollModule = angular.module('hbNiceScroll', []);

    hbNiceScrollModule.directive('hbNiceScroll', hbNiceScroll);
    hbNiceScroll.$inject = ['$timeout', '$parse', '$q'];
    function hbNiceScroll($timeout, $parse, $q) {
        return {
            restrict: 'A',
            scope: {
                niceScrollEnd: '&'
            },
            link: function ($scope, $element, $attr) {
                $element.css({overflow: 'hidden'});
                $element.toTopDom = null;
                $element.loadingElement = null;
                function doFunction() {
                    var defer = $q.defer(),
                        promise = defer.promise;

                    $scope.$apply(function () {
                        $element.loadingElement.show();
                        $scope.niceScrollEnd().then(function () {
                            defer.resolve();
                        })
                    });
                    return promise;
                }

                function setToTopPosition(toTopElement, isLoading) {
                    if (!toTopElement) return;
                    if (isLoading) {
                        var ofs = $element.offset(),
                            width = $element.width(),
                            height = $element.height();
                        toTopElement.css({
                            width: '16px',
                            height: '17px',
                            position: 'fixed',
                            top: (ofs.top) + 'px',
                            left: (width + ofs.left - 30) + 'px'
                        });
                    } else {
                        var ofs = $element.offset(),
                            width = $element.width(),
                            height = $element.height();

                        toTopElement.css({
                            position: 'fixed',
                            top: (height + ofs.top - 50) + 'px',
                            left: (width + ofs.left - 50) + 'px'
                        });
                    }
                }

                $timeout(function () {
                    $element.loadingElement = $('<div class="loading-ico"><img src="images/loading.gif"/></div>').hide();
                    $element.after($element.loadingElement);
                    var niceOption = $scope.$eval($attr['niceOption']),
                        niceScroll = $element.niceScroll(niceOption),
                        nice = $element.getNiceScroll();
                    niceScroll.onscrollend = function (data) {
                        if (data.end.y > 250) {
                            if (!$element.toTopDom) {
                                $element.toTopDom = $('<div class="to-top"></div>');
                                $element.after($element.toTopDom);
                                setToTopPosition($element.toTopDom, false);
                                $element.toTopDom.bind('click', function ($e) {
                                    $element.stop().animate({
                                        scrollTop: 0
                                    }, function () {
                                        $element.toTopDom.hide();
                                    })
                                })
                            } else {
                                $element.toTopDom.show();
                            }
                        } else {
                            if ($element.toTopDom) {
                                $element.toTopDom.hide();
                            }
                        }

                        if ($attr['niceScrollEnd']) {
                            setToTopPosition($element.loadingElement, true);
                            if (data.end.y + 5 > this.page.maxh) {
                                $scope.$evalAsync($attr['niceScrollEnd']);
                                doFunction().then(function () {
                                    $element.loadingElement.hide();
                                })
                            }
                        }

                        if ($attr['niceScrollTopEnd']) {
                            if (data.end.y <= 0) {
                                $scope.$evalAsync($attr['niceScrollTopEnd']);
                            }
                        }
                    };

                    if ($attr['niceScrollObject']) {
                        $parse($attr['niceScrollObject']).assign($scope, nice);
                    }

                    $scope.$on('$destroy', function () {
                        if ($element.toTopDom) {
                            $element.toTopDom.unbind('click');
                            $element.toTopDom.remove();
                        }
                        if (angular.isDefined(niceScroll)) {
                            niceScroll.remove();
                        }
                    });
                    $(window).resize(function () {
                        setToTopPosition($element.toTopDom, false);
                        setToTopPosition($element.loadingElement, true);
                    })
                }, 1000);
            }
        }
    }
});
