define(['angular',
        'modules/exam/services/exam-service',
        'modules/exam/controllers/exam-basic',
        'modules/exam/controllers/exam-all',
        'modules/exam/controllers/exam-wait',
        'modules/exam/controllers/exam-finish',
        'modules/exam/controllers/exam-lost',
        'modules/exam/controllers/exam-info',
        'modules/exam/controllers/exam-wrong',
        'directives/upload-advert-directive'
    ],
    function (angular, examService,
              examBasic, examAll, examWait, examFinish, examLost,
              info, wrong, uploadAdvert) {
        'use strict';
        return angular.module('app.exam', [])
            .factory('examService', examService)
            .controller('app.exam.basic', examBasic)
            .controller('app.exam.all', examAll)
            .controller('app.exam.wait', examWait)
            .controller('app.exam.finish', examFinish)
            .controller('app.exam.lost', examLost)
            .controller('app.exam.info', info)
            .controller('app.exam.wrong', wrong)
            .directive ('uploadAdvert', uploadAdvert);
    });
