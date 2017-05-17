define(function () {
    'use strict';
    return ['$scope', 'examService', function ($scope, examService) {

        /*$scope.navs = [
            {name: '我的广告', url: 'states.exam.all'},
            {name: '在用广告', url: 'states.exam.wait'},
            {name: '以往广告', url: 'states.exam.finish'},
            {name: '漏考考试', url: 'states.exam.lost'},
            {name: '我的错误库', url: 'states.exam.wrong'}
        ];*/
		$scope.navs = [
            {name: '在用广告', url: 'states.exam.all'},
            {name: '以往广告', url: 'states.exam.finish'},
            {name: '发布广告', url: 'states.exam.wait'}
        ];
        //
        //$scope.model={
        //    queryParam:{
        //        pageNo:1,
        //        pageSize:4
        //    }
        //};
        //
        //$scope.events={
        //    //滚动条加载更多事件
        //    findMore: function () {
        //        //e.stopPropagation();
        //        $scope.model.queryParam.pageNo = $scope.model.queryParam.pageNo + 1;//重置页码
        //        //获取选课中心课程列表数据
        //        return examService.findByQuery($scope.model.queryParam).then(function (data) {
        //            console.log("条件查询选课中心课程数据");
        //            if (data.status) {
        //                Array.prototype.push.apply($scope.model.courseInfoList, data.info);
        //                //$scope.model.courseInfoList=data.info;
        //            } else {
        //                //$scope.model.courseInfoList=[];
        //            }
        //        });
        //    }
        //}
    }];
});
