define([
    'angular',
    'const/global-constants',
    'modules/mySelectCourse/controllers/mySelectCourse-ctrl',
    'modules/mySelectCourse/controllers/chooseCourseCenter-ctrl',
    'modules/mySelectCourse/services/mySelectCourse-service',
    'modules/mySelectCourse/services/chooseCourseCenter-service',
    'restangular'

], function (angular,global, mySelectCourseCtrl,chooseCourseCenterCtrl,mySelectCourseService,chooseCourseCenterService) {
    'use strict';
    return angular.module('app.mySelectCourse', ['ngSanitize'])
        .controller('app.mySelectCourse.mySelectCourseCtrl', mySelectCourseCtrl)
        .controller('app.mySelectCourse.chooseCourseCenterCtrl', chooseCourseCenterCtrl)
        .constant('global', global)
        .factory('mySelectCourseService', mySelectCourseService)
        .factory('chooseCourseCenterService', chooseCourseCenterService);//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
});
