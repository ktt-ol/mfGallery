'use strict';


angular.module('mfGalleryApp').directive('pagination', function () {

  return {
    scope: {
      pages: '=pagination',
      current: '='
    },
    templateUrl: 'views/pagination.tpl.html',
    link: function (scope, element) {

      scope.hasPrevious = false;
      scope.hasNext = false;
      scope.prevLink = '#';
      scope.nextLink = '#';

      scope.makeLink = function (pageIndex) {
        return '#/a/' + pageIndex + '/';
      };

      scope.$watch('current', function (newValue) {
        var current = parseInt(scope.current, 10);
        scope.hasPrevious = current > 0;

        if (scope.hasPrevious) {
          scope.prevLink = scope.makeLink(current - 1);
        } else {
          scope.prevLink = '#';
        }

        scope.hasNext = current < scope.pages.length - 1;
        if (scope.hasNext) {
          scope.nextLink = scope.makeLink(current + 1);
        } else {
          scope.nextLink = '#';
        }
      });
    }
  };
});
