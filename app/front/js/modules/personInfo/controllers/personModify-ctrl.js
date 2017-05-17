/**
 * Created by Administrator on 2015/8/17.
 */
define (function () {
	'use strict';
	return ['$scope', 'HB_notification', 'personInfoService', '$state', '$rootScope',
		function ($scope, HB_notification, personInfoService, $state, $rootScope) {

            $scope.emailAllow = true;
            $scope.mobileAllow = true;

            $scope.$watch('dataInfo.code', function (newValue, oldValue) {
                if (newValue) {
                    if ($scope.dataInfo.code) {
                        $scope.pleaseMobileCode = false;
                        personInfoService.findRandomNumberValidate($scope.dataInfo).then(function (data) {
                            if (data.status) {
                                if (data.info) {
                                    $scope.errorMobileCode1 = true;
                                    $scope.isFormAllow = true;
                                    $scope.errorMobileCode2 = false;
                                } else {
                                    $scope.errorMobileCode2 = true;
                                    $scope.isFormAllow = false;
                                    $scope.errorMobileCode1 = false;
                                }
                            }
                        });
                    } else {
                        $scope.pleaseMobileCode = true;
                    }
                }
            });

            $scope.$watch('emailInfo.code', function (newValue, oldValue) {
                if (newValue) {
                    if ($scope.emailInfo.code) {
                        $scope.pleaseEmailCode = false;
                        personInfoService.findEmailRandomNumber($scope.emailInfo).then(function (data) {
                            if (data.status) {
                                if (data.info) {
                                    $scope.errorEmailCode1 = true;
                                    $scope.isFormAllow = true;
                                    $scope.errorEmailCode2 = false;
                                } else {
                                    $scope.errorEmailCode2 = true;
                                    $scope.isFormAllow = false;
                                    $scope.errorEmailCode1 = false;
                                }
                            }
                        });
                    } else {
                        $scope.pleaseMobileCode = true;
                    }
                }
            });

            $scope.isFormAllow = true;
			$scope.modify = {
                mobileCode: function (e) {
                    e.preventDefault();
                    if (!$scope.dataInfo.code) {
                        $scope.errorMobileCode1 = false;
                        $scope.errorMobileCode2 = false;
                        $scope.pleaseMobileCode = true;
                    } else {
                        $scope.pleaseMobileCode = false;
                        personInfoService.findRandomNumberValidate($scope.dataInfo).then(function (data) {
                            if (data.status) {
                                if (data.info) {
                                    $scope.errorMobileCode1 = true;
                                    $scope.isFormAllow = true;
                                    $scope.errorMobileCode2 = false;
                                } else {
                                    $scope.errorMobileCode2 = true;
                                    $scope.isFormAllow = false;
                                    $scope.errorMobileCode1 = false;
                                }
                            }
                        });
                    }
                },
                emailCode: function (e) {
                    e.preventDefault();
                    if (!$scope.emailInfo.code) {
                        $scope.errorEmailCode1 = false;
                        $scope.errorEmailCode2 = false;
                        $scope.pleaseEmailCode = true;
                    } else {
                        $scope.pleaseEmailCode = false;
                        personInfoService.findEmailRandomNumber($scope.emailInfo).then(function (data) {
                            if (data.status) {
                                if (data.info) {
                                    $scope.errorEmailCode1 = true;
                                    $scope.isFormAllow = true;
                                    $scope.errorEmailCode2 = false;
                                } else {
                                    $scope.errorEmailCode2 = true;
                                    $scope.isFormAllow = false;
                                    $scope.errorEmailCode1 = false;
                                }
                            }
                        });
                    }
                },
				updatePersonInfo: function () {
					$scope.model.personInfos.code = $scope.dataInfo.code;
					$scope.model.personInfos.emailCode = $scope.emailInfo.code;
					$scope.model.personInfos.id = $scope.model.personEditInfo.ids;
					$scope.model.personInfos.name = $scope.model.personEditInfo.names;
					$scope.model.personInfos.phoneNumber = $scope.model.personEditInfo.phoneNumbers;
					$scope.model.personInfos.email = $scope.model.personEditInfo.emails;
					$scope.model.personInfos.uniqueData = $scope.model.personEditInfo.uniqueDatas;
					$scope.model.personInfos.education = $scope.model.personEditInfo.educations;
					$scope.model.personInfos.sex = $scope.model.personEditInfo.sexs;
					//$scope.model.personInfos = $scope.model.personInfo;
					$scope.model.personInfos.oldPassword = null;
					$scope.model.personInfos.newPassword = null;
					$scope.model.personInfos.confirmPassword = null;
					$scope.model.personInfos.displayPhotoUrl = null;
                    personInfoService.updatePersonInfo($scope.model.personInfos).then(function (data) {
						if (data.status) {
							//$scope.global.showTip('更新成功', 'success');
							$scope.model.personInfos = $scope.model.personEditInfo;

							var sexs = $scope.model.personEditInfo.sexs;
							if (sexs) {
								if (sexs == 1) {
									$scope.model.personInfo.sexstr = "男";
								} else if (sexs == 2) {
									$scope.model.personInfo.sexstr = "女";
								} else {
									$scope.model.personInfo.sexstr = "未知";
								}
							}

							var educations = $scope.model.personEditInfo.educations;
							if (educations) {
								if (educations == 1) {
									$scope.model.personInfo.educationstr = "大专及以下";
								} else if (educations == 2) {
									$scope.model.personInfo.educationstr = "本科";
								} else if (educations == 3) {
									$scope.model.personInfo.educationstr = "硕士";
								} else if (educations == 4) {
									$scope.model.personInfo.educationstr = "博士";
								} else {
									$scope.model.personInfo.educationstr = "其他";
								}
							}
							HB_notification.showTip ("修改信息成功！", "success");
							$rootScope.isReload = true;
							$state.go ('states.personInfo.basicInfo');
						} else {
							HB_notification.showTip ("修改信息失败！", "error");
						}
					});
				}
			};
		}];
});
