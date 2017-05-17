define(['angular',
        'modules/library/controllers/question-library-ctrl',
        'modules/library/services/question-library-service',
        'directives/remote-validate-directive',
        'directives/pager-directive'
    ],
    function (angular, questionLibraryCtrl, questionLibraryService, validateDirective) {
        'use strict';
        return angular.module('app.library', []).controller('app.library.questionLibraryCtrl', questionLibraryCtrl)


            .factory('questionLibraryService', questionLibraryService)

            .directive('ajaxValidate', validateDirective)

    });
