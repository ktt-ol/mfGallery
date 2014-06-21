'use strict';

angular.module('mfGalleryApp').controller('GalleryCtrl',
  function (albumData, $scope, $routeParams, $location, $window, Config, LinearPartitionService) {

    /* private */

    var currentAlbum = $routeParams.album || '';
    var absPath = Config.folder + '/' + currentAlbum;

    function updateBreadcrumb() {
      var start = '#/a/';

      $scope.ui.breadcrumb.push({
        href: start,
        name: 'Start'
      });

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

    function findCurrentIndex() {
      for (var i=0; i<$scope.ui.album.images.length; i++) {
        if ($scope.ui.album.images[i].name === $routeParams.i) {
          return i;
        }
      }
    }

    function updateLightboxByUrl() {
      if (!$routeParams.i) {
        $scope.lightbox.show = false;
        return;
      }

      $scope.lightbox.imageUrl = Config.folder + '/' + currentAlbum + '/.thumbs/' + Config.thumbLightbox + '-' + $routeParams.i;
      $scope.lightbox.show = true;
    }

    /* scope vars */

    $scope.ui = {
      ifsMode: Config.mode === 'ifs',
      relPath: currentAlbum,
      breadcrumb: [],
      album: albumData,
      imagesContainerWidth: 0,
      parent: currentAlbum.split('/').slice(0, -1).join('/')
    };

    $scope.lightbox = {
      imageUrl: null,
      show: false
    };

    $scope.$watch('lightbox.show', function (newValue) {
      // remove the 'i' search param if the lightbox is closed
      if (!newValue && $routeParams.i) {
        $location.search('');
      }
    });

    $scope.$on('widthChanged', function (event, newValue) {
      LinearPartitionService.fitPics($scope.ui.album.images, {
        containerWidth: newValue,
        preferedImageHeight: Config.preferedImageHeight,
        spacing: 4
      });
    });

    $scope.$on('$locationChangeSuccess', function () {
      updateLightboxByUrl();
    });

    updateBreadcrumb();
    updateLightboxByUrl();


    /* scope functions */

    $scope.makePath = function (subAlbumId) {
      var url = '#/a/';
      if ($scope.ui.relPath !== '') {
        url += $scope.ui.relPath + '/';
      }

      return url + subAlbumId.folder;
    };

    $scope.makeThumbUrl = function (imageName, sizeName, /*optional*/ subFolder) {
      var size = sizeName === 'small' ? Config.thumbSmall : Config.thumbLightbox;
      var sub = subFolder ? '/' + subFolder : '';
      return absPath + sub + '/.thumbs/' + size + '-' + imageName;
    };

    $scope.prevImg = function () {
      var index = findCurrentIndex();
      var newIndex = (index - 1 + $scope.ui.album.images.length) % $scope.ui.album.images.length;
      $location.search('i', $scope.ui.album.images[newIndex].name);
    };

    $scope.nextImg = function () {
      var index = findCurrentIndex();
      var newIndex = (index + 1) % $scope.ui.album.images.length;
      $location.search('i', $scope.ui.album.images[newIndex].name);
    };

    $scope.yeah = function (inview, name, element) {
      console.log('yeah!', inview, name);
      angular.element(element).unbind('scroll');
    };
  });
