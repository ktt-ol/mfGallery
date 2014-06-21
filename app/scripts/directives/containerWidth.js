'use strict';

angular.module('mfGalleryApp').directive('containerWidth', function ($rootScope, $window, debounce) {

  return {
    scope: {
      eventName: '@containerWidth'
    },
    link: function (scope, element) {

      var debouncedResize = debounce(function () {
        sendEvent();
      }, 1000);

      function sendEvent() {
        $rootScope.$broadcast(scope.eventName, element[0].offsetWidth);
      }

      function onResize(event) {
        debouncedResize();
      }

      angular.element($window).on('resize', onResize);

      // send event on start
      sendEvent();

      // cleanup
      scope.$on('$destroy', function () {
        angular.element($window).off('resize', onResize);
        debouncedResize.cancel();
      });
    }
  };
});
