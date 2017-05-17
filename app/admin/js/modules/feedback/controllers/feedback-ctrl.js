define (function () {
	'use strict';
    return ['$scope', 'global', 'feedbackService', '$rootScope', function ($scope, global, feedbackService, $rootScope) {

		var $node, utils, uiTemplate;

		// define data-binding variable
		angular.extend ($scope, {
			regexps: global.regexps,    // validation regexp while validating form or define yourself
			ui: {},                     // Kendo component options config
			model: {},                  // data model
			node: {},                   // node for kendo component
			event: {}
		});

		$scope.model = {
			library: {
				parentId: ''
			},
			parentName: '',

			feedback: {
				id: null,
				type: null,
				desc: null,
				edPictures: null,
				answerReply: null,
				answerCreateTime: null,
				email: null,
				userName: null,
                isSendEmail: false,
                userId: null
			},
			//意见反馈id
			fdId: null,

			// 员工分页参数
			selectParames: {
				pageNo: 1,
				pageSize: 10,
				type: 0,
				descKeyword: undefined,
				unitId: undefined,
				startCreateTime: undefined,
				endCreateTime: undefined
			},

			// 员工新增
			create: {
				userId: null,
				unitId: null,
				organizationId: null,
				unit: null,
				organization: null,
				jobId: null,
				jobGradeId: null,
				job: null,
				jobGrade: null,
				name: null,
				identifyCode: null,
				phoneNumber: null,
				email: null,
				workDate: null,
				sex: 1,
				education: 1,
				status: 1
			},
			// 员工编辑
			edit: {},
			// 查看
			view: {}
		};
		$scope.__Biu = function (view, fdId) {
			$scope.$state.go (view, {id: fdId});
		};

        /*$scope.$watch($rootScope.change, function(newValue, oldValue){

         });*/

		//== Nodes -----------------------------
		/**
		 * $node: 辅助的节点对象, 通常为jquery对象. 如<code>popup</code>的<code>anchor</code>属性值
		 *
		 * @type {{indexUnitInput: *, indexOrganizationInput: *}}
		 */
		$node = {
			indexUnitInput: angular.element ('#index_unit_input')/*,
			 indexOrgInput: angular.element('#index_org_input'),

			 newUnitInput: angular.element('#new_unit_input'),
			 newOrgInput: angular.element('#new_org_input'),

			 editUnitInput: angular.element('#edit_unit_input'),
			 editOrgInput: angular.element('#edit_org_input')*/
		};
		/**
		 * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
		 *
		 * @type {{startCreateTime: null, endCreateTime: null}}
		 */
		$scope.node = {
			//== index node
			feedbackGrid: null,
			startCreateTime: null,
			endCreateTime: null
		};


		utils = {
			startChange: function () {
				var startDate = $scope.node.startCreateTime.value (),
					endDate = $scope.node.endCreateTime.value ();

				if (startDate) {
					startDate = new Date (startDate);
					startDate.setDate (startDate.getDate ());
					$scope.node.endCreateTime.min (startDate);
				} else if (endDate) {
					$scope.node.startCreateTime.max (new Date (endDate));
				} else {
					endDate = new Date ();
					$scope.node.startCreateTime.max (endDate);
					$scope.node.endCreateTime.min (endDate);
				}
			},
			endChange: function () {
				var endDate = $scope.node.endCreateTime.value (),
					startDate = $scope.node.startCreateTime.value ();

				if (endDate) {
					endDate = new Date (endDate);
					endDate.setDate (endDate.getDate ());
					$scope.node.startCreateTime.max (endDate);
				} else if (startDate) {
					$scope.node.endCreateTime.min (new Date (startDate));
				} else {
					endDate = new Date ();
					$scope.node.startCreateTime.max (endDate);
					$scope.node.endCreateTime.min (endDate);
				}
			},


			// 当前时间格式化为yyyy-MM-dd
			formatNow: function () {
				var current = new Date (),
					month = current.getMonth () + 1,
					date = current.getDate ();
				if (month < 10) {
					month = '0' + month;
				}
				if (date < 10) {
					date = '0' + date;
				}
				return current.getFullYear () + '-' + month + '-' + date;
			},

			// yyyy-MM-dd hh:mm:ss 格式成 yyyy-MM-dd
			timeCloseDay: function (datetime) {
				var date = datetime.split (' ');
				return date.length ? date[0] : null;
            },
            deleteFlag: function (str) {
                //var reg = "<[^>]*>";
                //var reg1 = "&nbsp;";<[^>]*>
                str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                str = str.replace(/[ | ]* /g, ' '); //去除行尾空白
                str = str.replace(/ [\s| | ]* /g, ' '); //去除多余空行
                str = str.replace(/&nbsp;/ig, '');//去掉
                return str;


                //return str.replace("/<[^>]*>/g", "").replace("<br/>", "").replace("&nbsp;", "");
            }
		};


		// 构建表格的内容模板
		var gridRowTemplate = '';
		(function () {
			var result = [];
			result.push ('<tr>');

			result.push ('<td>');
			result.push ('#: index #');
			result.push ('</td>');

            result.push('<td title="#: descAll #">');
			result.push ('#: desc #');
			result.push ('</td>');

			result.push ('<td>');
			result.push ('#: createTime #');
			result.push ('</td>');

			result.push ('<td>');
			result.push ('#: userName #');
			result.push ('</td>');

			result.push ('<td title="#: type #">');
			result.push ('#: type #');
			result.push ('</td>');

			result.push ('<td title="#: unitName #">');
			result.push ('#: unitName #');
			result.push ('</td>');


			result.push ('<td>');
			result.push ('#: solveStatus == 2 ? \'已处理\' : \'未处理\' #');
			result.push ('</td>');

			result.push ('<td class="op">');

			result.push ('<button ng-click="__Biu(\'states.feedback.feedbackReplied\', \'#: id #\');" ng-if="#: solveStatus # == 2" class="table-btn">查看</button>');
			result.push ('<button ng-click="__Biu(\'states.feedback.feedbackUnreply\', \'#: id #\');" ng-if="#: solveStatus # == 1" class="table-btn">回复</button>');
			/*result.push ('<button ui-sref=".feedbackReplied" ng-show="#: solveStatus # == 2" class="table-btn">查看</button>');
			 result.push ('<button ui-sref=".feedbackUnreply" ng-show="#: solveStatus # == 1" class="table-btn">回复</button>');*/
			/*result.push ('<button ng-click="events.view($event, dataItem)" class="table-btn">查看</button>');
			 result.push ('<button ng-click="events.edit($event, dataItem)" class="table-btn">修改</button>');
			 result.push ('<button ng-click="events.remove($event, dataItem)" ng-disabled="#: status # != 2" class="table-btn">注销</button>');
			 result.push ('<button ng-click="events.resetPassword($event, dataItem)" class="table-btn">重置密码</button>');*/
			result.push ('</td>');

			result.push ('</tr>');
			gridRowTemplate = result.join ('');
		}) ();


		var dataSource = new kendo.data.HierarchicalDataSource ({
			transport: {
				read: function (options) {
					var id = options.data.id ? options.data.id : "",
						myModel = dataSource.get (options.data.id);
					var type = myModel ? myModel.type : '';
					$.ajax ({
                        //url: "/web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType=" + type,
                        url: "/web/admin/organization/findUnitTree.action?parentId=" + id + "&nodeType=" + type + "&needOrg=true",
						dataType: "json",
						success: function (result) {
							options.success (result);
						},
						error: function (result) {
							// notify the data source that the request failed
							options.error (result);
						}
					});
				}
			},
			schema: {
				model: {
					id: "id",
					hasChildren: "hasChildren"
				},
				data: function (data) {

					return data.info;
				}
			}
		});
		/**
		 * 在UI上以angular方式使用组件的组件配置项
		 * @type
		 */
		$scope.ui = {
			popup: {
				indexUnit: {
					anchor: $node.indexUnitInput
				},
				indexOrg: {
					anchor: $node.indexOrgInput
				},
				newUnit: {
					anchor: $node.newUnitInput
				}
			},

			trees: {
				options: {
					checkboxes: false,
					// 当要去远程获取数据的时候数据源这么配置
					dataSource: dataSource
				}
			},
			datePicker: {
				begin: {
					options: {
						culture: "zh-CN",
						format: "yyyy-MM-dd",
						change: utils.startChange
					}
				},
				end: {
					options: {
						culture: "zh-CN",
						format: "yyyy-MM-dd",
						change: utils.endChange
					}
				},
				workDate: {
					options: {
						culture: "zh-CN",
						format: "yyyy-MM-dd"
					}
				}
			},

			feedbackGrid: {
				options: {
					selectable: true,
					pageable: {
						refresh: true,
						buttonCount: 10
					},
					// 每个行的模板定义,
					noRecords: {
						template: '暂无数据'
					},
					dataSource: {
						serverPaging: true,
						page: $scope.model.selectParames.pageNo,
						pageSize: $scope.model.selectParames.pageSize, // 每页显示的数据数目
						transport: {
							read: {
								url: "/web/admin/feedback/queryMongoPage",
								data: function () {
									var temp = {}, params = $scope.model.selectParames;
									for (var key in params) {
										if (params.hasOwnProperty (key)) {
											if (params[key]) {
												temp[key] = params[key];
                                                if (key === 'endCreateTime') {
                                                    temp[key] = $.trim(params[key]) + ' 23:59:59';
                                                }
											}
										}
									}
									return temp;
								},
								dataType: 'json'
							}
						},
						schema: {
							parse: function (response) {
								// 将会把这个返回的数组绑定到数据源当中
								if (response.status) {
									var dataview = response.info, index = 1;
									angular.forEach (dataview, function (item) {

                                        var str = utils.deleteFlag(item.desc);
                                        item.descAll = str;
                                        item.desc = str.length >= 35 ? str.substring(0, 35) + "..." : str;
										item.index = index++;
									});
								}
								return response;
							},
							total: function (response) {
								return response.totalSize;
							},
							data: function (response) {
								return response.info;
							}
						}
					},
                    rowTemplate: kendo.template(gridRowTemplate),
					// 选中切换的时候改变选中行的时候触发的事件
					columns: [
						{
                            title: "序号",
                            width: 50
						},
						{field: "desc", title: "反馈内容"},
						{field: "createTime", title: "反馈时间", width: 140},
						{field: "userName", title: "反馈人", width: 100},
						{field: "email", title: "问题类型", width: 80},
						{field: "unitName", title: "反馈人所属单位", width: 200},
						//{field: "organization", title: "所属部门", width: 100},
						//{field: "job", title: "岗位", width: 100},
						{field: "solveStatus", title: "是否已处理", width: 100},
						{title: "操作", width: 80}
					]
				}
			}
		};

		$scope.events = {
            selectPage: function (e) {
                //var data = $scope.model.selectParam;
                e.preventDefault();
                $scope.model.selectParames.pageNo = 1;
                var data = $scope.model.selectParam;
                $scope.node.feedbackGrid.pager.page(1);
                $scope.node.feedbackGrid.dataSource.read();
                //$scope.node.gridInstance.dataSource.fetch();

            },
			openTree: function (e) {
				$scope.showUnitTree = !$scope.showUnitTree;
			},
			getUnitInfo: function (dataItem) {
				if (dataItem.enabled == false) {
					return;
				}
				$scope.model.selectParames.unitId = dataItem.unitId;
				$scope.model.parentName = dataItem.name;
				$scope.model.library.parentId = dataItem.id;
				$scope.showUnitTree = !$scope.showUnitTree;
			},

			// 获取员工的分页
			getFeedbackPage: function (e) {
				e.preventDefault ();

				var data = $scope.model.selectParames;
				// 页码重置为1、状态赋值
				data.pageNo = 1;

				if (data.startCreateTime) {
					data.startCreateTime = data.startCreateTime.replace (/-/g, '/');
				}
				if (data.endCreateTime) {
					data.endCreateTime = data.endCreateTime.replace (/-/g, '/');
				}
				if (!$scope.model.parentName) {
					data.unitId = null;
				}

				// 设置grid pager的页码时, 会默认向远端请求一次数据, 如果你设置了servePaging为true
				$scope.node.feedbackGrid.pager.page (1);
				// $scope.node.feedbackGrid.dataSource.read();

				if (data.startCreateTime) {
					data.startCreateTime = data.startCreateTime.replace (/\//g, '-');
				}
				if (data.endCreateTime) {
					data.endCreateTime = data.endCreateTime.replace (/\//g, '-');
				}
			},

			create: function (e) {
				e.preventDefault (e);
				var editNew = $scope.model.editNew;
				if ($scope.addEmployeeForm.$valid) {
					feedbackService.save (editNew)
						.then (function (response) {
						if (response.status) {
							var temp = angular.copy (editNew);
							if (!temp.job) {
								temp.job = '暂无岗位';
							}
							if (!temp.jobGrade) {
								temp.jobGrade = '暂无岗位等级';
							}
							temp.userId = response.info;

							$scope.node.feedbackGrid.dataSource.insert (0, temp);
							$scope.node.feedbackGrid.refresh ();
							$scope.globle.showTip ('添加成功', 'success');
						} else {
							$scope.globle.showTip (response.info, 'error');
						}
					});
				}
			}
		};

	}];
});
