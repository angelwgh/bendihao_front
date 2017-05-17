define(function () {
  'use strict';
  return ['$scope', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'KENDO_UI_EDITOR', 'kendo.grid', 'global', 'shopManagerService', function ($scope, KENDO_UI_GRID, KENDO_UI_TREE, KENDO_UI_EDITOR, kendoGrid, global, shopManagerService) {

    var localDB, $node, utils, uiTemplate;
    localDB = {
      // 已选的管理员ID, 批量操作提交服务端使用
      selectedIdArray: [],
      // 已选的管理员状态, 刷新批量按钮使用
      selectedStatusArray: {}
    };

      angular.extend($scope, {
          emailValidate: {
              type: 2,
              userId: null
          }
      });

    $scope.model = {
      shopInfo: {},
      selectParam : {
          keyword: null,
          startCreateTime: null,
          endCreateTime: null,
          pageSize: 10,
          pageNo: 1
      }
    };

    //存储公司相册图片
    $scope.imageArr = [];

    $scope.regexps = global.regexps;

    $scope.node = {
        gridInstance: null,
        startCreateTime: null,
        endCreateTime: null
      //selectUnitOrDept: null
    };


    utils = {
      guid: function() {
          function S4() {
             return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
          }
          return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
      close: function(isSave){
        //还原表单状态
        if (isSave) {
          $scope.node.windows.addWindow.close();
        } else {
            //$scope.updateAdminAccountForm.$setPristine();
          $scope.node.windows.updateWindow.close();
        }
      },

      refreshBatchButton: function() {
        var selectedIdArray = localDB.selectedIdArray,
          selectedStatusArray = localDB.selectedStatusArray,
          size = selectedIdArray.length;

        var i=0, j=0, k=0;
        angular.forEach(selectedStatusArray, function(status, key) {
          if (status == '1'){
            i ++;
          }
          if (status == '2'){
            j ++;
          }
          if (status == '3'){
            k ++;
          }
        });
        if (i>0 && j>0 && k>0){
          $scope.model.batchFire = false;
        } else if (i>0 && j>0){
          $scope.model.batchFire = false;
        } else if (i>0 && k>0){
          $scope.model.batchFire = false;
        } else if (j>0 && k>0){
          $scope.model.batchFire = false;
        } else if (i>0){
          $scope.model.batchFire = false;
        } else if (j>0) {
          $scope.model.batchFire = true;
        } else if (k>0) {
          $scope.model.batchFire = false;
        }

        // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
        if (size === 0) {
          $scope.selected = false;
          $scope.model.batchFire = true;
        } else if (size === $scope.node.gridInstance.dataSource.view().length) {
          $scope.selected = true;

        }
      }
    };

    var viewModel = kendo.observable({
      userIdList: []
    });
    kendo.bind($("input"), viewModel);


    //监听区域点击事件
    var monitorClick = '';
  $scope.events = {
      delete: function (e, item) {
          var id = item.id;
          angular.forEach($scope.imageArr, function(data, index) {
            if (id == data.id) {
              $scope.imageArr.splice(index, 1);
            }
          });
      },
      query: function (shopId) {
        shopManagerService.query(shopId).then(function (data) {
          console.log(JSON.stringify(data));
          if (data){
            $scope.model.shopInfo = data;
            $scope.model.shopInfo.beforeGcid = data.gcId;
            if (data.businessLicenceImage){
              data.businessLicenceImage = data.businessLicenceImage.substring(7);
            } else {
              $scope.model.shopInfo.businessLicenceImage = null;
              $scope.model.uploadShopValue1 = null;
            }
            if (data.identityFrontImage) {
              data.identityFrontImage = data.identityFrontImage.substring(7);
            } else {
              $scope.model.shopInfo.identityFrontImage = null;
              $scope.model.uploadShopValue2 = null;
            }
            if (data.identityBackImage) {
              data.identityBackImage = data.identityBackImage.substring(7);
            } else {
              $scope.model.shopInfo.identityBackImage = null;
              $scope.model.uploadShopValue3 = null;
            }
            if (data.fxbPictureVideo && data.fxbPictureVideo.length > 0) {
              
              angular.forEach(data.fxbPictureVideo, function(item) {
                var objPic = {};
                objPic.id = item.pvId;
                if (item.pvUrl) {
                  objPic.saveFile = item.pvUrl.substring(7);
                }
                
                $scope.imageArr.push(objPic);
              });
            }
            if (data.categoryName) {
              $scope.categoryValue = data.categoryName.substring(data.categoryName.lastIndexOf(">")+2);
            }
            
          }

          $scope.node.windows.updateWindow.center().open();
        });
      },
      cancelUpdate: function (e) {
        $scope.imageArr = [];
        $scope.categoryValue = null;
        $scope.model.shopInfo = {};
        e.preventDefault();
        utils.close(false);
      },
      cancel: function (e) {
        e.preventDefault();
        utils.close(true);
      },
      openEnableOrSuspend: function(ids, value) {
          $scope.globle.confirm (value, '确定要'+value+'该商铺？', function () {
          var isOpen;
          if ($('#button_'+ids).html()=='停用'){
            isOpen = '0';
            shopManagerService.suspend(ids, isOpen).then(function(data) {

              $scope.node.gridInstance.dataSource.read();
            });
          } else {
            isOpen = '1';
            shopManagerService.suspend(ids, isOpen).then(function(data) {
              console.log("enable"+data);

              $scope.node.gridInstance.dataSource.read();
            });
          }
        });
      },
      openFire: function(ids) {
        $scope.globle.confirm ('删除', '确定要删除该商铺吗？', function () {
          console.log (ids);
          $scope.model.userId = ids;
          shopManagerService.fire(ids).then(function (data) {
            console.log(data);
            if (data.status){
              $scope.node.gridInstance.dataSource.read();
            } else {
                $scope.globle.showTip('删除失败！', 'error')
            }
          });
        })
      },
      deletes: function() {
        if (localDB.selectedIdArray.length<=0){
            $scope.globle.showTip('请选择要删除的商铺！', 'info');
          return;
        }
        $scope.globle.confirm ('删除', '确定要删除商铺吗？', function () {
          shopManagerService.deletes(localDB.selectedIdArray).then(function (data) {
            if (data.state == 1){
              $scope.node.gridInstance.dataSource.read();
            } else {
                $scope.globle.showTip('批量删除失败！', 'error')
            }
          });
        })
      },
      openDelete: function(ids) {
          $scope.globle.confirm ('删除', '确定要删除该商铺吗？', function () {
              shopManagerService.delete(ids).then(function (data) {
                  if (data.state == 1){
                      var size = $scope.node.gridInstance.dataSource.view().length;
                      if (size == 1 && $scope.model.selectParam.pageNo != 1) {
                          $scope.model.selectParam.pageNo = $scope.model.selectParam.pageNo - 1;
                          $scope.node.gridInstance.pager.page($scope.model.selectParam.pageNo);
                      } else {
                          $scope.node.gridInstance.dataSource.read();
                      }
                  } else {
                      $scope.globle.showTip('删除失败！', 'error')
                  }
              });
          })
      },
      update: function(e) {
        e.preventDefault(e);
        if (!$scope.model.shopInfo.businessLicenceImage) {
          $scope.globle.showTip('请上传营业执照！', 'warning');
          return;
        }
        if (!$scope.model.shopInfo.identityFrontImage) {
          $scope.globle.showTip('请上传身份证正面！', 'warning');
          return;
        }
        if (!$scope.model.shopInfo.identityBackImage) {
          $scope.globle.showTip('请上传身份证背面！', 'warning');
          return;
        }
        if ($scope.imageArr.length <= 0) {
          $scope.globle.showTip('至少上传一张公司相册！', 'warning');
          return;
        }
        angular.forEach($scope.imageArr, function(item) {
          if (isNaN(item.id) && item.id.indexOf("b") != -1) {
            item.id = null;
          }
        });
        var shopInfo = {};
        shopInfo.id=$scope.model.shopInfo.id;
        shopInfo.beforeGcid=$scope.model.shopInfo.beforeGcid;
        shopInfo.address=$scope.model.shopInfo.address;
        shopInfo.name=$scope.model.shopInfo.name;
        shopInfo.categoryName=$scope.model.shopInfo.categoryName;
        shopInfo.uid=$scope.model.shopInfo.uid;
        shopInfo.businessLicenceImage=$scope.model.shopInfo.businessLicenceImage;
        shopInfo.identityFrontImage=$scope.model.shopInfo.identityFrontImage;
        shopInfo.identityBackImage=$scope.model.shopInfo.identityBackImage;
        shopInfo.gcId=$scope.model.shopInfo.gcId;
        shopInfo.fcId=$scope.model.shopInfo.fcId;
        shopInfo.about=$scope.model.shopInfo.about;
        shopInfo.mobile=$scope.model.shopInfo.mobile;
        shopInfo.tel=$scope.model.shopInfo.tel;
        shopInfo.createtime=$scope.model.shopInfo.createtime;
        shopInfo.imageArrs=$scope.imageArr;

        shopManagerService.update(shopInfo).then(function (data) {
          if (data.state == 1) {
            $scope.globle.showTip('修改商铺成功！', 'success');
            $scope.imageArr = [];
            $scope.categoryValue = null;
            $scope.model.shopInfo = {};
            $scope.node.gridInstance.dataSource.read();
            utils.close(false);
          } else {
            $scope.globle.showTip(data.msg, 'error');
          }

        });
      },

      openTree: function (e) {
        e.stopPropagation();
        $scope.libraryTreeShow = true;
      },
      closeTree: function (e) {
        //e.preventDefault();
        e.stopPropagation();
        $scope.libraryTreeShow = false;
      },
      getOrgInfo: function (e, dataItem) {
        e.stopPropagation();
        $scope.categoryValue = dataItem.name;
        //$scope.model.library.parentId = dataItem.id;
        //$scope.libraryTreeShow = false;
        $scope.libraryTreeShow = false;
        $scope.model.shopInfo.gcId=dataItem.id;//节点的id
        //$scope.model.adminAccount.managerObjectId=dataItem.id;//节点的id
      },
      selectAll: function (e) {

        // 重置表格已选的ID, 已选的状态
        localDB.selectedIdArray = [];
        localDB.selectedStatusArray = {};
        localDB.arrstatus = [];

        // 全选
        if (e.currentTarget.checked) {
          var viewData = $scope.node.gridInstance.dataSource.view(),
            size = viewData.length, row;
          for (var i = 0; i < size; i++) {
            row = viewData[i];
            // 缓存本地
            localDB.selectedIdArray.push(row.id);
            //localDB.selectedStatusArray[row.id] = row.status;
            //localDB.arrstatus.push(row.status);
            console.log('状态：'+row.id);
          }
        }
       // console.log('状态1：'+localDB.selectedStatusArray);
        utils.refreshBatchButton();
        console.log('-----已选ID是: ', localDB.selectedIdArray);

      },
      checkBoxCheck: function (e, dataItem) {

        var id = dataItem.id;
        if (e.currentTarget.checked) {
          localDB.selectedIdArray.push(id);
          //localDB.selectedStatusArray[id] = dataItem.status;
        } else {
          var index = _.indexOf(localDB.selectedIdArray, id);
          if (index !== -1) {
            localDB.selectedIdArray.splice(index, 1);
          }
          //delete localDB.selectedStatusArray[id];
        }

        utils.refreshBatchButton();
        console.log('-----已选ID是: ', localDB.selectedIdArray);
        /*console.log(dataItem);
        kendoGrid.checkBoxCheck($scope, e, dataItem);*/
      },
      search: function () {
        var name = $("#name").val();
        grid.data($scope.ui.grid.options).dataSource.filter([
          {field: "name", value: name}
        ]);
      },

      // 跳转到指定的页数
      toPageIndex: function () {
        console.log($scope.node.gridInstance);
        if ($scope.model.toPage) {
          $scope.node.gridInstance.dataSource.page($scope.model.toPage);
        }
      },
      selectPage: function(e) {
        e.preventDefault();
        $scope.model.selectParam.pageNo = 1;
        $scope.node.gridInstance.pager.page(1);
        $scope.node.gridInstance.dataSource.read();
      }
    };

    $scope.model.selectItems = [];

    //单位和部门树
    //=================单位和部门树开始=============================
    var dataSource = new kendo.data.HierarchicalDataSource({
      transport: {
        read: function (options) {
          var id = options.data.id ? options.data.id : "18",
            myModel = dataSource.get(options.data.id);
          var type = myModel ? myModel.type : '';
          $.ajax({
              url: "/FxbManager/categoryController/queryCategory?parentId=" + id,
            dataType: "json",
            success: function (result) {
              options.success(result);
            },
            error: function (result) {
              options.error(result);
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
          return data.jsonBody;
        }
      }
    });

    //=======================单位和部门树结束=======================

    $scope.windowOptions = {
      modal: true,
      visible: false,
      title: false,
      resizable: false,
      draggable: false,
      open: function () {
        this.center();
      }
    };




    //=============分页开始=======================
    var gridRowTemplate = '';
    (function () {
      var result = [];
      result.push ('<tr>');

      result.push ('<td>');
      result.push ('<input ng-checked="selected" ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox" id="check_#: id #"  class="k-checkbox"/>');
      result.push ('<label class="k-checkbox-label" for="check_#: id #"></label>');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: name #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: categoryName #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: tel #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: mobile #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: address #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: isOpen==1?\'开张\':\'停业\'#');
      result.push ('</td>');

      result.push ('<td>');
        result.push('<button ng-click="events.query(\'#: id #\')" class="table-btn" #: click==2?\'disabled\':\'\'#>编辑</button>');
        result.push('<button id="button_#: id #" class="table-btn" ng-click="events.openEnableOrSuspend(\'#: id #\', \'#: isOpen==1?\'停用\':\'启用\'#\')">#: isOpen==1?\'停用\':\'启用\'#</button>');
      result.push ('<input id="status" type="hidden" value="#: click #" />');
        result.push('<button ng-click="events.openDelete(\'#: id #\')"  class="table-btn">删除</button>');
      result.push ('</td>');

      result.push ('</tr>');
      gridRowTemplate = result.join ('');
    }) ();


    
    $scope.$watch ('model.uploadShopValue', function (newValue, oldValue) {
        if ($scope.model.uploadShopValue) {
          if (newValue) {

            var objPic = {};
            objPic.id = 'b' + utils.guid();
            objPic.saveFile = newValue.jsonBody[0].saveFile;
            
            $scope.imageArr.push(objPic);

            console.log(JSON.stringify($scope.imageArr));
          } else {
            var objPic = {};
            objPic.id = 'b' + utils.guid();
            objPic.saveFile = oldValue.jsonBody[0].saveFile;
            
            $scope.imageArr.push(objPic);
          }
        }
      });

    $scope.$watch ('model.uploadShopValue1', function (newValue, oldValue) {
        if ($scope.model.uploadShopValue1) {
          if (newValue) {
            $scope.model.shopInfo.businessLicenceImage = newValue.jsonBody[0].saveFile;
          } else {
            $scope.model.shopInfo.businessLicenceImage = oldValue.jsonBody[0].saveFile;
          }
        }
      });
    $scope.$watch ('model.uploadShopValue2', function (newValue, oldValue) {
        if ($scope.model.uploadShopValue2) {
          if (newValue) {
            $scope.model.shopInfo.identityFrontImage = newValue.jsonBody[0].saveFile;
          } else {
            $scope.model.shopInfo.identityFrontImage = oldValue.jsonBody[0].saveFile;
          }
        }
      });
    $scope.$watch ('model.uploadShopValue3', function (newValue, oldValue) {
        if ($scope.model.uploadShopValue3) {
          if (newValue) {
            $scope.model.shopInfo.identityBackImage = newValue.jsonBody[0].saveFile;
          } else {
            $scope.model.shopInfo.identityBackImage = oldValue.jsonBody[0].saveFile;
          }
        }
      });


    var ButtonUtils = {
        //发布开始时间变化
        startChange: function () {
            var startDate = $scope.node.startCreateTime.value(),
                endDate = $scope.node.endCreateTime.value();

            if (startDate) {
                startDate = new Date(startDate);
                startDate.setDate(startDate.getDate());
                $scope.node.endCreateTime.min(startDate);
            } else if (endDate) {
                $scope.node.startCreateTime.max(new Date(endDate));
            } else {
                endDate = new Date();
                $scope.node.startCreateTime.max(endDate);
                $scope.node.endCreateTime.min(endDate);
            }
        },
        //发布结束时间变化
        endChange: function () {
            var endDate = $scope.node.endCreateTime.value(),
                startDate = $scope.node.startCreateTime.value();

            if (endDate) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate());
                $scope.node.startCreateTime.max(endDate);
            } else if (startDate) {
                $scope.node.endCreateTime.min(new Date(startDate));
            } else {
                endDate = new Date();
                $scope.node.startCreateTime.max(endDate);
                $scope.node.endCreateTime.min(endDate);
            }
        }
    };

    $scope.ui = {

      tree: {
        options: {
          checkboxes: false,
          // 当要去远程获取数据的时候数据源这么配置
          dataSource: dataSource
        }
      },
      editor: KENDO_UI_EDITOR,
      windows: {
        updateWindow: {//修改窗口
          modal: true,
          content: "views/shopManager/updateShop.html",
          visible: false,
            width: 900,
            height: 800,
          title: false,
          open: function () {
            this.center();
          }
        }
      },
      grid: {
        options: {
          // 每个行的模板定义,
          rowTemplate: kendo.template(gridRowTemplate),
          noRecords: {
            template: "暂无数据"
          },
          dataSource: {

            transport: {
              read: {
                contentType:'application/x-www-form-urlencoded;charset=utf-8;',
                url: "/FxbManager/shopController/queryShopList?page=99",
                data: function(e) {
                  var temp = {}, params = $scope.model.selectParam;
                  for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                      if (params[key]) {
                        temp[key] = params[key];
                      }
                    }
                  }
                  //temp.pageNo = e.page;
                  //$scope.model.selectParam.pageNo=temp.pageNo;
                  //temp.pageSize = $scope.model.selectParam.pageSize;
                  return temp;
                },
                dataType: 'json',
                error: function (data) {
                    $scope.globle.showTip(data.info, "error");
                }
              }
            },

            pageSize: 10, // 每页显示的数据数目
            schema: {
              // 数据源默认绑定的字段
              // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
              // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
              // 优先与后面的data执行，返回的数据为下面data上面的参数response
              parse: function (response) {
                // 将会把这个返回的数组绑定到数据源当中
                return response;
              },
              total: function (response) {
                // 绑定数据所有总共多少条;
                /*var status = $scope.model.selectParam.status;
                switch (status) {
                  case 0: $scope.model.unlimitCount = response.totalSize; break;
                  case 1: $scope.model.enableCount = response.totalSize; break;
                  case 2: $scope.model.suspendCount = response.totalSize; break;
                  case 3: $scope.model.fireCount = response.totalSize; break;
                  default: alert('error status query param: ' + status);
                }*/
                return response.totalSize;
              },
              data: function (response) {
                  $scope.selected = false;
                  localDB.selectedIdArray = [];

                return response.jsonBody;
              } // 指定数据源
            },
            serverPaging: true
          },
          selectable: true,
          dataBinding: function(e) {
            $scope.model.gridReturnData = e.items;
            kendoGrid.nullDataDealLeaf(e);
          },
          pageable: {
            refresh: true,
            pageSizes: true,
            pageSize: 10,
            buttonCount: 10,
            change: function(e) {
             $scope.model.selectParam.pageNo = parseInt(e.index, 10);
             $scope.node.gridInstance.dataSource.read();
             }
          },
          // 选中切换的时候改变选中行的时候触发的事件
          columns: [
            {
              title: "<input ng-checked='selected' id='selectAlll' class='k-checkbox' ng-click='events.selectAll($event)' type='checkbox'/><label class='k-checkbox-label' for='selectAlll'></label>",
              filterable: false, width: 60
            },
              {field: "name", title: "商铺名称"},
              {field: "categoryName", title: "所属类别", width: 250},
              {field: "tel", title: "固定电话", width: 180},
              {field: "mobile", title: "移动电话", width: 180},
              {field: "address", title: "详细地址", width: 170},
              {field: "isOpen", title: "状态", width: 60},
            {
              title: "操作",width: 180
            }
          ]
        }
      },

      window: {
        addEmployeeWindow: {
          options: {
            title: false,
            modal: true,
            visible: false
          }
        }
      },
      //日期控件
      datePicker: {
          begin: {
              options: {
                  culture: "zh-CN",
                  format: "yyyy-MM-dd",
                  height: 10,
                  change: ButtonUtils.startChange

              }
          },
          end: {
              options: {
                  culture: "zh-CN",
                  format: "yyyy-MM-dd",
                  change: ButtonUtils.endChange
              }
          },
          publish: {
              options: {
                  culture: "zh-CN",
                  format: "yyyy-MM-dd HH:mm:ss",
                  value: new Date(),
                  min: new Date()
              }
          }
      }
    };

    $scope.ui.grid.options = _.merge ({}, KENDO_UI_GRID, $scope.ui.grid.options);

    $scope.ui.tree.options = _.merge ({}, KENDO_UI_TREE, $scope.ui.tree.options);
  }];
});
