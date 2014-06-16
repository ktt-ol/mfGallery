'use strict';

angular.module('mfGalleryApp').service('AlbumService', function ($http, $log, $q, Config) {

  this.loadInitialAlbum = function (currentAlbum) {
    currentAlbum = currentAlbum || '';
    return this.getAlbums(currentAlbum).then(
      function (result) {
        $log.info('Initial album loaded.');
        return result;
      }, function (err) {
        $log.error('Can´t load initial album', err);
        return $q.reject(err);
      });
  };

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
