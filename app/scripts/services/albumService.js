'use strict';

angular.module('mfGalleryApp').service('AlbumService', function ($http, Config) {

  this.getAlbums = function (path) {
    if (!path) {
      path = '.';
    }

    var meta = Config.folder + '/' + path + '/meta.json';
    return $http.get(meta).then(function (response) {
      return response.data;
    });
  };

});
