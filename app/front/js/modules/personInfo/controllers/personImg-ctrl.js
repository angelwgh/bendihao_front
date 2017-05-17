/**
 * Created by Administrator on 2015/8/17.
 */
define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'personInfoService', function ($scope, HB_notification, personInfoService) {
        $scope.$watch('uploadValue', function (newValue, oldValue) {
            if ($scope.uploadValue) {
                if (newValue) {
                    $scope.model.personInfo.displayPhotoUrl = newValue.jsonBody[0].saveFile;
                    console.log("newValue::" + newValue.jsonBody[0].saveFile)
                } else {
                    $scope.model.personInfo.displayPhotoUrl = oldValue.jsonBody[0].saveFile;
                }
                personInfoService.updatePersonInfo($scope.model.personInfo).then(function (data) {
                    if (data.status) {
                        //console.log("update:===>" + data.info);
                        //$scope.globle.showTip('修改头像成功', 'success');
                        //alert("修改头像成功");
                        HB_notification.showTip('修改头像成功!', 'success');
                        $scope.$state.reload();
                    } else {
                        $scope.uploadValue = null;
                        //$scope.globle.showTip('修改头像失败', 'error');
                        //alert("修改头像失败");
                        HB_notification.showTip('修改头像失败!', 'error');
                    }
                });
            }

            //console.log(oldValue+"<<====>>"+newValue);
        });

    }];
});
