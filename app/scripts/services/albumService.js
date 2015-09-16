'use strict';

angular.module('mfGalleryApp').service('AlbumService', function ($http, $log, $q, Config) {

  function paginate(albumData, pageSize) {
    var pageCount = Math.ceil(albumData.length / pageSize);
    var pages = [], start;
    for (var i=0; i<pageCount; i++) {
      start = i * pageSize;
      pages.push(albumData.slice(start, start + pageSize));
    }

    return pages;
  }

  this.loadInitialAlbum = function (currentAlbum) {
    currentAlbum = currentAlbum || '';
    return this.getAlbums(currentAlbum).then(
      function (result) {
        $log.info('Initial album loaded.');
        result.pages = paginate(result.images, Config.pageSize);
        return result;
      }, function (err) {
        $log.error('Can´t load initial album', err);
        return null;
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
