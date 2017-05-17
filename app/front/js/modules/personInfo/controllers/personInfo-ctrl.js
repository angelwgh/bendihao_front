define (function () {
	'use strict';
	return ['$scope', 'HB_notification', 'global', 'personInfoService', '$rootScope', function ($scope, HB_notification, global, personInfoService, $rootScope) {

		$scope.title = '个人中心';
        $scope.valueInfoEmail = "获取邮件验证码";
        $scope.valueInfo = "获取验证码";
		$scope.navs = [
			{name: '个人基础信息', url: 'states.personInfo.basicInfo'},
			{name: '修改头像', url: 'states.personInfo.personImgModify'},
			{name: '修改密码', url: 'states.personInfo.personPasswordModify'}
		];

		$scope.mobileCode = false;
		$scope.emailCode = false;
        $scope.emailAllow = true;
        $scope.mobileAllow = true;

		$scope.model = {
			countdown: 59,
            countdownEmail: 59,
			showCountDown1: false,
			showCountDown2: false,
			mobileCodes: null,
			emailCodes: null,
			isDisabled: true,
			isEmailDisabled: true,
			personInfo: {
				id: null,
				name: null,
				unit: null,
				organization: null,
				phoneNumber: null,
				email: null,
				uniqueData: null,
				job: null,
				education: 1,
				workDate: null,
				sex: 1,
				displayPhotoUrl: null,
				sexstr: null,
				educationstr: null
			},
			personInfos: {
				id: null,
				name: null,
				unit: null,
				organization: null,
				phoneNumber: null,
				email: null,
				uniqueData: null,
				job: null,
				education: 1,
				workDate: null,
				sex: 1,
				displayPhotoUrl: null
			},
			personEditInfo: {
				ids: null,
				names: null,
				phoneNumbers: null,
				emails: null,
				uniqueDatas: null,
				educations: 1,
				sexs: 1
			}
		};

		angular.extend ($scope, {
			dataInfo: {
				type: 'mobile',
				code: null
			},
			emailInfo: {
				type: 'email',
				code: null
			}
		});

		$scope.$watch ($rootScope.isReload, function (newValue, oldValue) {
			if ($rootScope.isReload) {
				$rootScope.isReload = false;
				$scope.$state.reload ();
			}
		});

		$scope.$watch ('model.personEditInfo.phoneNumbers', function (newValue, oldValue) {
			if ($scope.model.personEditInfo.phoneNumbers) {
				var phoneNumber = $scope.model.personEditInfo.phoneNumbers;
//				if (!global.regexps.phoneNumber.test (phoneNumber) || $scope.model.personInfos.phoneNumber == $scope.model.personEditInfo.phoneNumbers || newValue == oldValue || oldValue == null) {
                if (!global.regexps.phoneNumber.test(phoneNumber) || $scope.model.personInfos.phoneNumber == $scope.model.personEditInfo.phoneNumbers || newValue == oldValue) {
					$scope.model.isDisabled = true;
                    $scope.mobileAllow = false;
				} else {
                    $scope.mobileAllow = true;
					$scope.model.isDisabled = false;
				}
			} else {
				$scope.model.isDisabled = true;
			}
		});

		$scope.$watch ('model.personEditInfo.emails', function (newValue, oldValue) {
			if ($scope.model.personEditInfo.emails) {
				var emails = $scope.model.personEditInfo.emails;
                //if (!global.regexps.email.test (emails) || $scope.model.personInfos.email == $scope.model.personEditInfo.emails || newValue == oldValue || oldValue == null) {
                if (!global.regexps.email.test(emails) || $scope.model.personInfos.email == $scope.model.personEditInfo.emails || newValue == oldValue) {
					$scope.model.isEmailDisabled = true;
                    $scope.emailAllow = false;

				} else {
                    $scope.emailAllow = true;
					$scope.model.isEmailDisabled = false;
				}
			} else {
				$scope.model.isEmailDisabled = true;
			}
		});

		$scope.events = {
			clear: function () {
				$scope.dataInfo.code = null;
			},
			personInfo: function () {
				personInfoService.personInfo ().then (function (data) {
					var datas = data.info;
					$scope.model.personEditInfo.ids = datas.id;
					$scope.model.personEditInfo.names = datas.name;
					$scope.model.personEditInfo.phoneNumbers = datas.phoneNumber;
					$scope.model.personEditInfo.emails = datas.email;
					$scope.model.personEditInfo.uniqueDatas = datas.uniqueData;
					$scope.model.personEditInfo.educations = datas.education;
					$scope.model.personEditInfo.sexs = datas.sex;

					$scope.model.personInfos = $scope.model.personInfo = datas;

					if (datas.sex == 1) {
						$scope.model.personInfo.sexstr = "男";
					} else if (datas.sex == 2) {
						$scope.model.personInfo.sexstr = "女";
					} else {
						$scope.model.personInfo.sexstr = "未知";
					}

					if (datas.education == 1) {
						$scope.model.personInfo.educationstr = "大专及以下";
					} else if (datas.education == 2) {
						$scope.model.personInfo.educationstr = "本科";
					} else if (datas.education == 3) {
						$scope.model.personInfo.educationstr = "硕士";
					} else if (datas.education == 4) {
						$scope.model.personInfo.educationstr = "博士";
					} else {
						$scope.model.personInfo.educationstr = "其他";
					}
				});
			},

			countDown: function () {
				// 倒计时10-0秒，但算上0的话就是11s
				$scope.showCountDown1 = true;
				setTimeout (function () {
					// Do SomeThing
					clearInterval ($scope.events.time);
					$scope.model.countdown.$destroy ();
				}, 61000);
			},

			time: setInterval (function () {
				$scope.model.countdown--;
				$scope.$digest (); // 通知视图模型的变化
			}, 1000),

			sendEmail: function () {

			},

			updatePwd: function () {
				$scope.model.personInfos = $scope.model.personInfo;
				$scope.model.personInfos.displayPhotoUrl = null;
                personInfoService.updatePersonInfo($scope.model.personInfos).then(function (data) {
					if (data.status) {
						console.log ("update:===>" + data.info);
						HB_notification.showTip ('修改密码成功!', 'success');
						//alert('修改密码成功');
						$scope.model.personInfo.oldPassword = null;
						$scope.model.personInfo.newPassword = null;
						$scope.model.personInfo.confirmPassword = null;
					} else {
                        HB_notification.showTip (data.info, 'error');
					}
				});
			},

			cannel: function () {
				$scope.model.personInfo.oldPassword = null;
				$scope.model.personInfo.newPassword = null;
				$scope.model.personInfo.confirmPassword = null;
			},
			viewUploadImg: function () {
				$scope.node.windows.uploadImageWindow.center ().open ();
			},
			saveIdentifyingCode: function (type) {
                $scope.isFormAllow = false;
                $scope.valueInfo = "重新发送";
                $scope.$apply();
				personInfoService.random6Number (type, $scope.model.personEditInfo.phoneNumbers).then (function (data) {
					if (data.status) {
						$scope.mobileCode = true;
						utils.countDown ();
					} else {
						HB_notification.showTip ("发送失败！", "error");
					}
				});
			},
			saveEmailIdentifyingCode: function (type) {
                $scope.isFormAllow = false;
                $scope.valueInfoEmail = "重新发送";
				personInfoService.random6Number (type, $scope.model.personEditInfo.emails).then (function (data) {
					if (data.status) {
						$scope.emailCode = true;
                        utils.countDownEmail();
						HB_notification.showTip ("发送成功，请查收您的邮件！", "success");
					} else {
						HB_notification.showTip ("发送失败！", "error");
					}
				});
			},
			getIdentifyingCode: function (type) {
				personInfoService.findRandomNumber (type).then (function (data) {

					console.log ("data.info+send: ++" + data.info);
				});
			}
		}

		var wait = 60;
        var wait2 = 60;
		var utils = {
			countDown: function () {
				if (wait == 0) {
					$scope.model.isDisabled = false;
					$scope.showCountDown1 = false;
					wait = 60;
				} else {
					$scope.showCountDown1 = true;
					$scope.model.isDisabled = true;
					$scope.model.countdown = wait--;
					setTimeout (function () {
						utils.countDown ();
					}, 1000);
				}
            },
            countDownEmail: function () {
                if (wait2 == 0) {
                    $scope.model.isEmailDisabled = false;
                    $scope.showCountDown2 = false;
                    wait2 = 60;
                } else {
                    $scope.showCountDown2 = true;
                    $scope.model.isEmailDisabled = true;
                    $scope.model.countdownEmail = wait2--;
                    setTimeout(function () {
                        utils.countDownEmail();
                    }, 1000);
                }
            }
		};

		$scope.events.personInfo ();
	}];
});
