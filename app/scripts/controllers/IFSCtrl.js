'use strict';

angular.module('mfGalleryApp').controller('IFSCtrl',
  function (albumData, $scope, $routeParams, $location, Config) {

    // based on current index!
    function updateLightbox() {
      if (!albumData.images[$scope.ui.currentIndex]) {
        $scope.lightbox.show = false;
        return;
      }

      $scope.ui.currentImage = albumData.images[$scope.ui.currentIndex];

      $scope.lightbox.imageUrl = Config.folder + '/.thumbs/' + Config.thumbLightbox + '-' + $scope.ui.currentImage.name;
      $scope.lightbox.show = true;
    }

    function showInitialImage() {
      if (!angular.isArray(albumData.images) || albumData.images.length === 0) {
        return;
      }

      if ($routeParams.i) {
        $scope.ui.currentIndex = findImageIndexObjByName($routeParams.i);
        if ($scope.ui.currentIndex) {
          updateLightbox();
          return;
        }
      }
      $scope.ui.currentIndex = 0;
      updateLightbox();
    }

    function findImageIndexObjByName(imageName) {
      for (var i = 0; i < albumData.images.length; i++) {
        if (albumData.images[i].name === imageName) {
          return i;
        }

      }
      return null;
    }

    $scope.ui = {
      currentImage: {},
      size: albumData.images.length,
      currentIndex: null
    };

    $scope.lightbox = {
      imageUrl: '',
      show: false,
      imgSize: {}
    };

    $scope.$on('$locationChangeSuccess', function () {
      if ($routeParams.i) {
        $scope.ui.currentIndex = findImageIndexObjByName($routeParams.i);
      } else {
        $scope.ui.currentIndex = 0;
      }

      updateLightbox();
    });


    showInitialImage();

    $scope.prevImg = function () {
      var newIndex = ($scope.ui.currentIndex - 1 + albumData.images.length) % albumData.images.length;
      $location.search('i', albumData.images[newIndex].name);
    };

    $scope.nextImg = function () {
      var newIndex = ($scope.ui.currentIndex + 1) % albumData.images.length;
      $location.search('i', albumData.images[newIndex].name);
    };


  });
