define (function () {
  return ['Restangular', '$http', function (Restangular, $http) {
    var a = Restangular.withConfig (function (config) {
      config.setBaseUrl ('/web/admin/');
    });
    var menuHttp = a.one ('questionLibrary/findLibraryListByParentId');
    return {
      getMenuList: function (libraryId) {
          return menuHttp.get({libraryId: libraryId, enabled: '-1'});
      },
      getRootList:function(){
        return a.one('questionLibrary/getRootList').get();
      },
      findLibraryList:function(model){
        return a.one('questionLibrary/findLibraryList').get({searchDto:model});
      },
      save:function(model){
        return a.all('questionLibrary/create.action').post(model);
      },
      remove:function(libraryId){
        return a.one('questionLibrary/delete').get({libraryId:libraryId});
      },
      update: function (model) {
        return a.all('questionLibrary/update').post(model);
      },
      findLibraryById:function(libraryId){
        return a.one('questionLibrary/findLibraryById').get({libraryId:libraryId});
      }
    }
  }]
});
