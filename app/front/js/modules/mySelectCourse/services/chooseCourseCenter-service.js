/**
 * Created by wangzy on 2015/8/21.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/northChooseCourseCenter');
        });
        return {
            //查询课程分类
            findCourseCategory:function(){
                return base.all("findCourseCategory").post();
            },
            //查询课程分类(异步加载)
            GetCourseCategory:function(param){
                return base.one("GetCourseCategory").get(param);
            },
            //条件查询课程数据
            findByQuery:function(param){
                return base.all("findByQuery").post(param)
            },
            //获取通知公告数据
            findById: function (courseId) {
                return base.one("get").get(courseId);
            },
            selectCourse:function(param){
                return base.one("addCourse").get(param);
            }
        };
    }]
});
