define(['angularUiRouter'], function (router) {
    'use strict';
    return angular.module('app.states.home', [
        'ui.router'
    ])
        .config(function ($stateProvider,
                          $urlRouterProvider) {
            $urlRouterProvider
                .otherwise('home');
            $stateProvider
                .state("states", {
                    abstract: true, url: "",
                    views: {
                        "topView": {
                            templateUrl: 'views/home/top.html',
                            controller: ['$scope', '$rootScope', '$http', '$cookieStore',
                                function ($scope, $rootScope, $http, $cookieStore) {
                                    var imagePic = $cookieStore.get('currentBGImage'),
                                        bgOpacity = $cookieStore.get('bgOpacity');
                                    $rootScope.currentBGImage = imagePic = imagePic || 'bg-001-big.jpg';
                                    $rootScope.bgOpacity = bgOpacity || 100;
                                    $rootScope.bgStyle = {
                                        backgroundImage: 'url("images/' + imagePic + '")'
                                    };
                                }]
                        },
                        sliderView: {
                            templateUrl: 'views/home/slider.html',
                            controller: ['$scope', '$rootScope',
                                '$cookieStore', '$http', '$timeout',
                                function ($scope, $rootScope, $cookieStore, $http, $timeout) {
                                    $scope.showSkinContainer = false;
                                    $scope.changeBgOpacity = function (value) {
                                        $scope.$apply(function () {
                                            $rootScope.bgOpacity = value;
                                            $cookieStore.put('bgOpacity', value);
                                        });
                                    };
                                    $scope.changeBGStyle = function (bgName) {
                                        $cookieStore.put('currentBGImage', bgName);
                                        $rootScope.currentBGImage = bgName;
                                        $rootScope.bgStyle.backgroundImage = 'url("images/' + bgName + '")';
                                    };
                                    $scope.bgSkins = [];
                                    $scope.historyRecently = {};
                                    $scope.showHistoryRecently = false;

                                    $scope.loadHistory = function () {
                                        $timeout.cancel($scope.currentTimer);
                                        $scope.currentTimer = $timeout(function () {
                                            $http.get('/web/front/play/getLastPlayCourse').success(function (data) {
                                                $scope.historyRecently = data.info;
                                                if (!$scope.historyRecently) {
                                                    $scope.showHistoryRecently = false;
                                                } else {
                                                    if (!$scope.historyRecently.courseId
                                                        || $scope.historyRecently.courseId === ''
                                                        || $scope.historyRecently.courseId === null) {
                                                        $scope.showHistoryRecently = false;
                                                    } else {
                                                        $scope.showHistoryRecently = true;
                                                    }
                                                }
                                            });
                                        }, 500);
                                    };
                                    for (var i = 1; i <= 10; i++) {
                                        var small = 'bg-00' + i + '-small.jpg',
                                            big = 'bg-00' + i + '-big.jpg';
                                        $scope.bgSkins.push({big: big, small: small});
                                    }
                                }]
                        },
                        settingView: {
                            templateUrl: 'views/home/setting.html'
                        }
                    }
                })
                .state('states.home', {
                    url: '/home',
                    views: {
                        '@': {
                            templateUrl: 'views/home/menu.html'
                        }
                    }
                })

                .state('states.about', {
                    url: '/about',
                    views: {
                        '@': {
                            templateUrl: 'views/home/about.html'
                        }
                    }
                })
        }
    );
});
