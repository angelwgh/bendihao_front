define (function () {
	'use strict';
	return ['$scope', 'questionLibraryService', function ($scope, questionLibraryService) {
		$scope.model = {

			page: {
				pageNo: 1,
				pageSize: 5
			},
			search: {
				enable: -1,
				name: null
			}
			,
			library: {
				enabled: 'true',
				share: 'true'
			},
			parentName: '',
			parentId: ''
		};


		$scope.data = {
			dataItem: null,
			updatePaperId: ''
		}


		$scope.init = function () {

		}

		var utils = {
			dateTime: function (x, y) {
				var z = {
					y: x.getFullYear (),
					M: x.getMonth () + 1,
					d: x.getDate (),
					h: x.getHours (),
					m: x.getMinutes (),
					s: x.getSeconds ()
				};
				return y.replace (/(y+|M+|d+|h+|m+|s+)/g, function (v) {
					return ((v.length > 1 ? "0" : "") + eval ('z.' + v.slice (-1))).slice (-(v.length > 2 ? v.length : 2))
				});
			}
		}


		$scope.$watch ('model.library.enabled', function () {
			if ($scope.model.library.enabled === 'false') {
				$scope.model.library.share = 'false';
				$ ('#radioShare').children ('input').attr ("disabled", true);
			} else if ($scope.model.library.enabled === 'true') {
				$ ('#radioShare').children ('input').removeAttr ("disabled");
			}
		})
		$scope.events = {
            libraryTreeHide:function(e){
                e.stopPropagation();
                $scope.libraryTreeShow=false;
            },
			add: function () {
				$scope.addLibraryForm.$setPristine ();
				$scope.data.updatePaperId = '';
				$scope.addOrUpdate = 'add';
				$scope.model.library = null;
				$scope.model.parentName = ''
				$scope.model.library = {enabled: 'true', share: 'true', name: null};
				$scope.node.windows.addWindow.open ();
			},
			cancel: function () {
				$scope.node.windows.addWindow.close ();
			},
			getOrgInfo: function (dataItem) {
				if (dataItem.enabled == false) {
					return;
				}
				$scope.model.parentName = dataItem.name;
				$scope.model.library.parentId = dataItem.id;
				$scope.libraryTreeShow = false;
			},
			openTree: function (e) {
                e.stopPropagation();
				$scope.libraryTreeShow = !$scope.libraryTreeShow;
			},
			save: function () {
                if($scope.model.library.parentId==null){
                    $scope.globle.showTip('必须选择一个题库', 'error');
                    return;
                }
                if($scope.model.library.name==null||$scope.model.library.name===''){
                    $scope.globle.showTip('题库名称不能为空', 'error');
                    return;
                }
                if ($scope.addLibraryForm.$valid) {
					if ($scope.addOrUpdate === 'add') {
						questionLibraryService.save ($scope.model.library).then (function (data) {
							if (!data.status) {
                                $scope.globle.showTip(data.info, 'error');
							} else {
								var newLibrary = {
									id: data.info,
									parentId: $scope.model.library.parentId === '-1' ? null : $scope.model.library.parentId,
									name: $scope.model.library.name,
									count: 0,
									enabled: $scope.model.library.enabled === 'true' ? '是' : '否',
									share: $scope.model.library.share === 'true' ? '是' : '否',
									createTime: utils.dateTime (new Date (), "yyyy-MM-dd hh:mm:ss")
								}
								$scope.node.libraryTree.dataSource.insert (0, newLibrary);
								$scope.node.libraryTree.refresh ();
								$scope.node.tree.dataSource.read ();
                                $scope.node.windows.addWindow.close ();
                            }
						});
					} else if ($scope.addOrUpdate === 'update') {
						questionLibraryService.update ($scope.model.library).then (function (data) {
							if (!data.status) {
                                $scope.globle.showTip(data.info, 'error');
                            } else {
								$scope.node.libraryTree.dataSource.remove ($scope.data.dataItem);
								var newLibrary = {
									id: $scope.model.library.id,
									parentId: $scope.model.library.parentId === '-1' ? null : $scope.model.library.parentId,
									name: $scope.model.library.name,
									count: $scope.data.dataItem.count,
									enabled: $scope.model.library.enabled === 'true' ? '是' : '否',
									share: $scope.model.library.share === 'true' ? '是' : '否',
									createTime: $scope.data.dataItem.createTime,
									hasChildren: true
								}
								$scope.node.libraryTree.dataSource.insert (0, newLibrary);
								$scope.node.libraryTree.refresh ();
								//$scope.node.libraryTree.dataSource.read ();
								$scope.node.tree.dataSource.read ();
                                $scope.node.windows.addWindow.close ();
                            }
						});
					}
				}
			},
			remove: function (e) {
				var row = $ (e.target).closest ("tr");
				var dataItem = $scope.node.libraryTree.dataItem (row);
				$scope.globle.confirm ('删除试题', '确定要删除吗？', function () {
					questionLibraryService.remove (dataItem.id).then (function (data) {
						if (!data.status) {
							$scope.globle.alert ('删除失败!', data.info);
						} else {
							$scope.node.libraryTree.dataSource.remove (dataItem);
							$scope.node.libraryTree.refresh ();
							$scope.node.tree.dataSource.read ();
						}
					});
				});
			},
			questionManage: function (e) {
				var row = $ (e.target).closest ("tr");
				var dataItem = $scope.node.libraryTree.dataItem (row);
				$scope.globle.stateGo ('states.question', '试题管理', {id: dataItem.id, name: dataItem.name});
			},
			toUpdate: function (e) {
				$scope.node.tree.dataSource.read ();
				$scope.addOrUpdate = 'update';
				var row = $ (e.target).closest ("tr");
				var dataItem = $scope.node.libraryTree.dataItem (row);
				$scope.data.dataItem = dataItem;
				$scope.data.updatePaperId = dataItem.id;
				questionLibraryService.findLibraryById (dataItem.id).then (function (data) {
					$scope.model.parentName = data.info.parentName;
					$scope.model.library = data.info;
					$scope.node.windows.addWindow.open ();
				});
			},
			details: function (e) {
				var row = $ (e.target).closest ("tr");
				var dataItem = $scope.node.libraryTree.dataItem (row);
				$scope.node.windows.detailsWindow.open ();
				questionLibraryService.findLibraryById (dataItem.id).then (function (data) {
					$scope.model.detailsLibrary = data.info;
				})
			}
		}
		//题库树
		var dataSource = new kendo.data.HierarchicalDataSource ({
			transport: {
				read: function (options) {
					var id = options.data.id ? options.data.id : "-2",
						myModel = dataSource.get (options.data.id);
					var type = myModel ? myModel.type : '';
					$.ajax ({
						url: "/web/admin/questionLibrary/findLibraryListByParentId?libraryId=" + id + '&enabled=0',
						dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain
										  // requests
						success: function (result) {
							// notify the data source that the request succeeded
							if ($scope.data.updatePaperId !== '') {
								angular.forEach (result.info, function (item, index) {
									if (item.id === $scope.data.updatePaperId) {
										result.info.splice (index, 1);
									}
								})
							}
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
		$scope.ui = {
			tree: {
				options: {
					checkboxes: false,
					// 当要去远程获取数据的时候数据源这么配置
					dataSource: dataSource
				}
			}
		};
		//题库树列表
		$scope.treelistOptions = {
			dataSource: {
				transport: {
					read: function (e) {
						var parentId = e.data.id == undefined ? '-1' : e.data.id;
						questionLibraryService.getMenuList (parentId).then (function (result) {
							$.each (result.info, function (i, data) {
								if (data.parentId == '-1')
									data.parentId = null;
								if (data.enabled == true) {
									data.enabled = '是'
								} else {
									data.enabled = '否'
								}

								if (data.share) {
									data.share = '是'
								} else {
									data.share = '否'
								}
							});
							e.success (result.info);
						});
					}
				},
				schema: {
					model: {
						id: "id"
					}
				}
			},
			sortable: true,
			editable: true,
			columns: [
				{field: "name", title: "题库名称", attributes: {style: "text-align: left"}},
				{field: "id", title: "题库id", width: "230px"},
				{field: "count", title: "试题数量", width: "80px"},
				{field: "enabled", title: "是否可用", width: "80px"},
				{field: "createTime", title: "创建时间", width: "150px"},
				{field: "share", title: "是否共享", width: "80px"},
				{
					title: '操作', width: '170px',
					template: kendo.template ('<button class="table-btn" ng-click="events.details($event);">查看</button>' +
						'<button class="table-btn" ng-click="events.toUpdate($event);">修改</button>' +
						'<button class="table-btn" ng-click="events.questionManage($event);">试题管理</button>' +
						'<button class="table-btn" ng-click="events.remove($event);">删除</button>')
				}
			]
		};

		$scope.windowOptions = {
			modal: true,
			visible: false,
			resizable: false,
			draggable: false,
			title: false,
			open: function () {
				this.center ();
			}
		};
		setTimeout (function () {
			if ($scope.$stateParams.newlibray) {
				$scope.addOrUpdate = 'add';
				$scope.node.windows.addWindow.open ();
			}
		}, 1000)
	}];
});
