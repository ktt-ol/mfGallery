'use strict';

angular.module('mfGalleryApp').factory('loadImageWithCache', function ($log, $q) {

  var imageStatusCache = {};

  /**
   *
   * @param {string} imageUrl
   * @returns {Promise} with { width, height }
   */
  function loadImage(imageUrl) {
    var entry = imageStatusCache[imageUrl];
    if (entry) {
      return entry.promise;
    }

    entry = imageStatusCache[imageUrl] = $q.defer();
    var img = new Image();
    img.onload = function () {
      entry.resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = function () {
      entry.reject('Could not load image');
    };

    img.src = imageUrl;

    return entry.promise;
  }

  return loadImage;
});
