'use strict';


angular.module('mfGalleryApp').directive('pagination', function () {

  return {
    scope: {
      pages: '=pagination',
      currentPage: '=',
      currentAlbum: '='
    },
    templateUrl: 'views/pagination.tpl.html',
    link: function (scope, element) {

      scope.hasPrevious = false;
      scope.hasNext = false;
      scope.prevLink = '#';
      scope.nextLink = '#';

      scope.makeLink = function (pageIndex) {
        return '#/a/' + pageIndex + '/' + scope.currentAlbum;
      };

      scope.$watch('currentPage', function (newValue) {
        var page = parseInt(scope.currentPage, 10);
        scope.hasPrevious = page > 0;

        if (scope.hasPrevious) {
          scope.prevLink = scope.makeLink(page - 1);
        } else {
          scope.prevLink = '#';
        }

        scope.hasNext = page < scope.pages.length - 1;
        if (scope.hasNext) {
          scope.nextLink = scope.makeLink(page + 1);
        } else {
          scope.nextLink = '#';
        }
      });
    }
  };
});
