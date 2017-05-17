define(function () {
  'use strict';
  return ['$scope', 'KENDO_UI_GRID', 'kendo.grid', 'global', 'recommendManagerService', function ($scope, KENDO_UI_GRID, kendoGrid, global, recommendManagerService) {

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
      close: function(){
        //还原表单状态
        $scope.node.windows.viewWindow.close();
      }
    };


    //监听区域点击事件
    var monitorClick = '';
  $scope.events = {
      queryRecommendUser: function (uid) {
        recommendManagerService.queryRecommendUser(uid).then(function (data) {
          if (data.state == 1){
            $scope.model.recommendUser = data.jsonBody;
            
          }
          $scope.node.windows.viewWindow.center().open();
        });
      },
      selectPage: function(e) {
        e.preventDefault();
        $scope.model.selectParam.pageNo = 1;
        $scope.node.gridInstance.pager.page(1);
        $scope.node.gridInstance.dataSource.read();
      },
      cancel: function (e) {
        e.preventDefault();
        utils.close();
      }
    };

    $scope.model.selectItems = [];


    //这个是弹窗时阴影
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
      result.push ('#: account #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: tel #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: number #');
      result.push ('</td>');

      result.push ('<td>');
      result.push ('#: time #');
      result.push ('</td>');

      result.push ('<td>');
        result.push('<button ng-click="events.queryRecommendUser(\'#: id #\')" class="table-btn" >查看人数</button>');
      result.push ('</td>');

      result.push ('</tr>');
      gridRowTemplate = result.join ('');
    }) ();



    $scope.ui = {
      windows: {
        viewWindow: {//修改窗口
          modal: true,
          content: "views/recommendManager/viewRecommend.html",
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
                url: "/FxbManager/recommendController/queryRecommendList",
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
              {field: "name", title: "用户昵称"},
              {field: "account", title: "本地号", width: 250},
              {field: "tel", title: "注册电话", width: 200},
              {field: "number", title: "推荐人数", width: 200},
              {field: "time", title: "推荐时间", width: 200},
            {
              title: "查看",width: 180
            }
          ]
        }
      }
    };

    $scope.ui.grid.options = _.merge ({}, KENDO_UI_GRID, $scope.ui.grid.options);
  }];
});
