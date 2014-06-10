'use strict';

angular.module('mfGalleryApp').factory('Config', function () {

  if (!window.mfGalleryConfig) {
    throw new Error('No config found. Provide a global config object named "mfGalleryConfig".');
  }

  return window.mfGalleryConfig;
});
