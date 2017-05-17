/**
 * Created by Administrator on 2015/8/20.
 */
define([
        'angular',
        'modules/courseDetail/controller/courseDetail-ctrl',
        'modules/courseDetail/services/courseDetail-service'
    ],
    function (angular, courseDetailCtrl, courseDetailService) {
        'use strict'
        return angular.module('app.courseDetail', [])
            .controller('app.courseDetail.courseDetailCtrl', courseDetailCtrl)
            .factory('courseDetailService', courseDetailService)
    });
