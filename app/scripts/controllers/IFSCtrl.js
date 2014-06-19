'use strict';

angular.module('mfGalleryApp').controller('IFSCtrl',
  function (albumData, $scope, $routeParams, $location, Config) {

    var currentIndex = null;

    // based on current index!
    function updateLightbox() {
      if (!albumData.images[currentIndex]) {
        $scope.lightbox.show = false;
        return;
      }

      $scope.ui.currentImage = albumData.images[currentIndex];

      $scope.lightbox.imageUrl = Config.folder + '/.thumbs/' + Config.thumbLightbox + '-' + $scope.ui.currentImage.name;
      $scope.lightbox.show = true;
    }

    function showInitialImage() {
      if (!angular.isArray(albumData.images) || albumData.images.length === 0) {
        return;
      }

      if ($routeParams.i) {
        currentIndex = findImageIndexObjByName($routeParams.i);
        if (currentIndex) {
          updateLightbox();
          return;
        }
      }
      currentIndex = 0;
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
      currentImage: {}
    };

    $scope.lightbox = {
      imageUrl: '',
      show: false
    };

    $scope.$on('$locationChangeSuccess', function () {
      if ($routeParams.i) {
        currentIndex = findImageIndexObjByName($routeParams.i);
      } else {
        currentIndex = 0;
      }

      updateLightbox();
    });


    showInitialImage();

    $scope.prevImg = function () {
      var newIndex = (currentIndex - 1 + albumData.images.length) % albumData.images.length;
      $location.search('i', albumData.images[newIndex].name);
    };

    $scope.nextImg = function () {
      var newIndex = (currentIndex + 1) % albumData.images.length;
      $location.search('i', albumData.images[newIndex].name);
    };


  });
