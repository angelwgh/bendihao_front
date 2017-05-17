/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/northMyselectCourse');
        });
        return {
            //查询课程分类
            findCourseCategory:function(){
                return base.all("findCourseCategory").post()
            },
            //条件查询数据
            findByQuery:function(param){
                return base.all("findByQuery").post(param)
            },
            //获取我选修课课程详细信息
            findById: function (param) {
                return base.one("get").get(param);
            },
            //删除我的选修课
            removeCourse:function(param){
                return base.one("removeCourse").get(param);
            }
        };
    }]
});
