'use strict';

angular.module('mfGalleryApp').directive('lightbox', function ($window, $document, Config) {

  var CONFIG = {
    margin: 20,
    padding: 0
  };

  return {
    templateUrl: 'views/lightbox.tpl.html',
    scope: {
      imageUrl: '&lightbox',
      show: '=',
      onNext: '&next',
      onPrev: '&prev',
      embedded: '@',
      sizeUpdate: '='
    },
    link: function (scope, element) {

      function resetImgStyle() {
        scope.imgSize = {
          width: '200px',
          height: '200px'
        };

        scope.imgStyle = angular.extend({
          'background-image': 'url(' + Config.staticPath + 'images/ajax-loader.gif)'
        }, scope.imgSize);
      }

      function setSize(width, height) {
        scope.imgSize.width = width + 'px';
        scope.imgSize.height = height + 'px';
        scope.imgStyle = angular.extend(scope.imgStyle, scope.imgSize);

        if (scope.sizeUpdate) {
          scope.sizeUpdate = angular.extend(scope.imgSize);
        }

        if (scope.embedded) {
          scope.dialogSize = scope.imgSize;
          return;
        }
        scope.dialogSize.width = (width + CONFIG.padding) + 'px';
        var heightWidthPadding = height + CONFIG.padding;
        var top = ($window.innerHeight - heightWidthPadding) / 2;
        scope.dialogSize.height = heightWidthPadding + 'px';
        scope.dialogSize.top = top + 'px';
      }

      function loadAndSetImage(url) {
        scope.imageLoaded = false;
        scope.imgStyle['background-image'] = 'url(' + Config.staticPath + 'images/ajax-loader.gif)';

        var img = new Image();
        img.onload = function () {
          scope.$apply(function () {
            scope.imgStyle['background-image'] = 'url(' + url + ')';
            scope.imageLoaded = true;
            var windowHWQ = $window.innerHeight / $window.innerWidth;
            var imgHWQ = img.height / img.width;

            if (windowHWQ > imgHWQ) {
              var maxWidth = Math.min($window.innerWidth, img.width);
              setSize(maxWidth - CONFIG.margin, img.height);
            } else {
              var maxHeight = Math.min($window.innerHeight, img.height);
              setSize(img.width, maxHeight - CONFIG.margin);
            }

          });

        };
        img.src = url;
      }

      function onKeyDown(event) {
        switch (event.keyCode) {
        case 39:
          // right arrow
          scope.$apply(function () {
            scope.nextImage(event);
          });
          break;
        case 37:
          // left arrow
          scope.$apply(function () {
            scope.prevImage(event);
          });
          break;
        case 27:
          // esc
          scope.$apply(function () {
            scope.close();
          });
          break;
//        default:
//          console.log('unhandled key', event.keyCode);
        }
      }

      scope.dialogSize = scope.embedded ? {} : {
        width: '200px',
        height: '200px'
      };

      scope.imgSize = {
      };
      scope.imageLoaded = false;

      scope.close = function (event) {
        if (scope.embedded) {
          return;
        }
        scope.show = false;
        resetImgStyle();
      };

      scope.prevImage = function (event) {
        event.stopPropagation();
        scope.onPrev();
      };

      scope.nextImage = function (event) {
        event.stopPropagation();
        scope.onNext();
      };

      scope.$watch(function () {
        return {
          url: scope.imageUrl(),
          show: scope.show
        };
      }, function (newValue) {
        if (!newValue.show || !newValue.url || newValue.url === '') {
          return;
        }
        loadAndSetImage(newValue.url);
      }, true);

      scope.$watch('show', function (newValue) {
        if (newValue) {
          angular.element($document).on('keydown', onKeyDown);
        } else {
          angular.element($document).off('keydown', onKeyDown);
        }

      });

      scope.$on('$destroy', function () {
        angular.element($document).off('keydown', onKeyDown);
      });

      resetImgStyle();
    }
  };
});
