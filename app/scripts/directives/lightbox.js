'use strict';

angular.module('mfGalleryApp').directive('lightbox', function ($window, $document, Config) {

  var CONFIG = {
    margin: 20,
    padding: 0
  };

  return {
    templateUrl: 'views/lightbox.tpl.html',
    scope: {
      image: '=lightbox',
      folderPath: '=',
      show: '=',
      ds: '=',
//      onNext: '&next',
//      onPrev: '&prev',
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

      function loadAndSetImage() {
        scope.imageLoaded = false;
        scope.imgStyle['background-image'] = 'url(' + Config.staticPath + 'images/ajax-loader.gif)';

        scope.originalUrl = makeOriginalUrl();
        var url = makeUrl();

        var img = new Image();
        img.onload = function () {
          scope.$apply(function () {
            scope.imgStyle['background-image'] = 'url("' + url + '")';
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

      function getAlbum() {
        var album = scope.folderPath;
        // if album present, it must start with /
        if (angular.isString(album) && album.length > 0 && album.indexOf('/') !== 0) {
          album = '/' + album;
        }
        return album;
      }

      function makeUrl() {
        return Config.folder + getAlbum() + '/.thumbs/' + Config.thumbLightbox + '-' + scope.image.name;
      }

      function makeOriginalUrl() {
        return Config.folder + getAlbum() + '/' + scope.image.name;
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
      scope.originalUrl = '#';
      scope.visibleExifMeta = [ 'make', 'model'];

      scope.close = function (event) {
        if (scope.embedded) {
          return;
        }
        scope.show = false;
        resetImgStyle();
      };

      scope.prevImage = function (event) {
        event.stopPropagation();
        if (scope.ds.hasPrev()) {
          scope.ds.onPrev();
        }
      };

      scope.nextImage = function (event) {
        event.stopPropagation();
        if (scope.ds.hasNext()) {
          scope.ds.onNext();
        }
      };

      scope.toggleMeta = function (event) {
        event.stopPropagation();
        scope.showMeta = !scope.showMeta;
      };

      scope.$watch(function () {
        return {
          image: scope.image,
          show: scope.show
        };
      }, function (newValue) {
        if (!newValue.show || !newValue.image) {
          return;
        }
        loadAndSetImage();
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
