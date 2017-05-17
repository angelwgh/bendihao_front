define(function () {
    'use strict';
    return ['$scope', 'HB_notification', 'examService', '$state', function ($scope, $notify, examService, $state) {

         $scope.$watch ('model.uploadValue', function (newValue, oldValue) {
            if ($scope.model.uploadValue) {
              if (newValue) {
                $scope.model.advert.imagePath = newValue.jsonBody[0].saveFile;
              } else {
                $scope.model.advert.imagePath = oldValue.jsonBody[0].saveFile;
              }
              $notify.showTip('上传成功！', 'info');
            }
      });       

        $scope.model = {
            advert: {
                imagePath: null,   // 所有课程
                url: null,
                title: null
            },

            paperList: []

        };

        $scope.events = {
            saveAdvert: function() {
                if (!$scope.model.advert.title) {
                    $notify.showTip('请输入输入宣传语！', 'info');
                    return;
                }
                if (!$scope.model.advert.url) {
                    $notify.showTip('请输入宣传的网址！', 'info');
                    return;
                }
                if (!$scope.model.advert.imagePath) {
                    $notify.showTip('请选择一张宣传图片！', 'info');
                    return;
                }
                examService.saveAdvert($scope.model.advert).then(function(response) {
                    if (response.state == 1) {
                        $scope.model.advert.title = '';
                        $scope.model.advert.url = '';
                        $scope.model.advert.imagePath = '';
                        $scope.model.uploadValue = '';
                        $notify.showTip('添加广告成功！', 'info');
                    } else {
                        $notify.alert('添加失败. ' + response.msg);
                    }
                });
            }
        };

    }];
});
