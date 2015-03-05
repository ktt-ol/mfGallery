'use strict';

angular.module('mfGalleryApp').controller('GalleryCtrl',
  function (albumData, $scope, $routeParams, $location, $window, Config, LinearPartitionService) {

    /* private */

    var currentAlbum = $routeParams.album || '';
    var absPath = Config.folder + '/' + currentAlbum;
    var lightboxImagePointer = 0;

    function updateBreadcrumb() {
      var start = '#/a/0/';

      $scope.ui.breadcrumb.push({
        href: start,
        name: 'Start'
      });

      // remove trailing slashes
      if (currentAlbum.length > 0 && currentAlbum[currentAlbum.length - 1] === '/') {
        currentAlbum = currentAlbum.substring(0, currentAlbum.length - 1);
      }
      currentAlbum.split('/').reduce(function (prevHref, pathElement, index, splits) {
        // ignore the last item
        if (index === splits.length - 1) {
          return;
        }

        // ignore this path if it's empty
        if (pathElement === '') {
          return prevHref;
        }

        var href = prevHref + pathElement + '/';
        $scope.ui.breadcrumb.push({
          href: href,
          name: pathElement
        });

        return href;
      }, start);
    }

    function getImageObj(imageName) {
      if (!imageName) {
        return null;
      }

      var pageIndex, imageIndex, image;
      for (pageIndex=0; pageIndex<albumData.pages.length; pageIndex++) {
        var page = albumData.pages[pageIndex];
        for (imageIndex=0; imageIndex<page.length; imageIndex++) {
          image = page[imageIndex];
          if (image.name === imageName) {
            return {
              image: image,
              pageIndex: pageIndex,
              imageIndex: imageIndex
            };
          }
        }

      }

      return null;
    }

    function updatePageAndLightbox() {
      var imageObj = getImageObj($routeParams.i);
      if (!imageObj) {
        $scope.lightbox.show = false;

        lightboxImagePointer = 0;
        $scope.page.index = $routeParams.page;
        $scope.page.images = albumData.pages[$scope.page.index];
        if (!$scope.page.images) {
          $scope.page.images = [];
        }
        return;
      }

      $scope.lightbox.image = imageObj.image;
      $scope.lightbox.folderPath = '/' + currentAlbum;
      $scope.lightbox.show = true;

      lightboxImagePointer = imageObj.imageIndex;
      $scope.page.index = imageObj.pageIndex;
      $scope.page.images = albumData.pages[$scope.page.index];
    }

    /* scope vars */

    $scope.page = {
      index: $routeParams.page,
      images: []
    };

    $scope.album = albumData;

    $scope.ui = {
      ifsMode: Config.mode === 'ifs',
      relPath: currentAlbum,
      breadcrumb: [],
      imagesContainerWidth: 0,
      parent: currentAlbum.split('/').slice(0, -1).join('/')
    };

    $scope.lightbox = {
      show: false,
      image: null,
      folderPath: '',
      imageSize: Config.thumbLightbox
    };

    $scope.$watch('lightbox.show', function (newValue) {
      // remove the 'i' search param if the lightbox is closed
      if (!newValue && $routeParams.i) {
        $location.search('');
      }
    });

    $scope.$on('widthChanged', function (event, newValue) {
      // add some safety space
      newValue -= 5;
      LinearPartitionService.fitPics($scope.page.images, {
        containerWidth: newValue,
        preferedImageHeight: Config.preferedImageHeight,
        spacing: 4
      });
    });

    $scope.$on('$locationChangeSuccess', function () {
      updatePageAndLightbox();
    });

    updateBreadcrumb();
    updatePageAndLightbox();


    /* scope functions */

    $scope.makePath = function (subAlbumId) {
      var url = '#/a/0/';
      if ($scope.ui.relPath !== '') {
        url += $scope.ui.relPath + '/';
      }

      return url + subAlbumId.folder;
    };

    $scope.makeImagePath = function (imageName) {
      return '#/a/' + $scope.page.index + '/' + $scope.ui.relPath + '?i=' + imageName;
    };

    $scope.makeThumbUrl = function (imageName, sizeName, /*optional*/ subFolder) {
      var size = sizeName === 'small' ? Config.thumbSmall : Config.thumbLightbox;
      var sub = subFolder ? '/' + subFolder : '';
      return absPath + sub + '/.thumbs/' + size + '-' + imageName;
    };


    $scope.ds = {
      onPrev: function () {
        if (lightboxImagePointer > 0) {
          var newIndex = (lightboxImagePointer - 1 + $scope.page.images.length) % $scope.page.images.length;
          $location.search('i', $scope.page.images[newIndex].name);
        } else {
          var pageIndex = $scope.page.index - 1;
          var len = albumData.pages[pageIndex].length;
          $location.url('/a/' + pageIndex + '/' + currentAlbum + '?i=' + albumData.pages[pageIndex][len - 1].name);
        }
      },
      onNext: function () {
        if (lightboxImagePointer < $scope.page.images.length - 1) {
          var newIndex = (lightboxImagePointer + 1) % $scope.page.images.length;
          $location.search('i', $scope.page.images[newIndex].name);
        } else {
          var pageIndex = $scope.page.index + 1;
          $location.url('/a/' + pageIndex + '/' + currentAlbum + '?i=' + albumData.pages[pageIndex][0].name);
        }
      },
      hasPrev: function () {
        if (lightboxImagePointer > 0) {
          return true;
        }
        return $scope.page.index > 0;
      },
      hasNext: function () {
        if (lightboxImagePointer < $scope.page.images.length - 1) {
          return true;
        }
        return $scope.page.index < albumData.pages.length - 1;
      }
    };
    
  });
