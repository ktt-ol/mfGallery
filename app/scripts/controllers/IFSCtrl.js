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

      $scope.lightbox.image = $scope.ui.currentImage;
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
        if (albumData.images[i].filename === imageName) {
          return i;
        }

      }
      return null;
    }

    function getPrevImage() {
      var index = ($scope.ui.currentIndex - 1 + albumData.images.length) % albumData.images.length;
      return albumData.images[index];
    }

    function getNextImage() {
      var index = ($scope.ui.currentIndex + 1) % albumData.images.length;
      return albumData.images[index];
    }

    $scope.ui = {
      currentImage: {},
      size: albumData.images.length,
      currentIndex: null
    };

    $scope.lightbox = {
      image: null,
      folderPath: '',
      boxSize: {}
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

    $scope.ds = {
      onPrev: function () {
        $location.search('i', getPrevImage().filename);
      },
      onNext: function () {
        $location.search('i', getNextImage().filename);
      },
      hasPrev: function () {
        return $scope.ui.currentIndex !== 0;
      },
      hasNext: function () {
        return $scope.ui.currentIndex !== albumData.images.length - 1;
      },
      getPrev: function () {
        return getPrevImage();
      },
      getNext: function () {
        return getNextImage();
      }
    };

  });
