'use strict';

angular
  .module('mfGalleryApp', [
    'ngSanitize',
    'ngRoute',
    'debounce'
//    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {

    var albumData = ['AlbumService', '$route', function (AlbumService, $route) {
      var currentAlbum = $route.current.params.album || '';
      return AlbumService.getAlbums(currentAlbum);
    }];

    $routeProvider
      .when('/a/:album*?', {
        templateUrl: 'views/gallery.html',
        controller: 'GalleryCtrl',
        // don't reload if the '?' param changes
        reloadOnSearch: false,
        resolve: {
          albumData: albumData
        }
      })
      .when('/f/', {
        templateUrl: 'views/ifs.html',
        controller: 'IFSCtrl',
        // don't reload if the '?' param changes
        reloadOnSearch: false,
        resolve: {
          albumData: albumData
        }
      })
      .otherwise({
        resolve: {
          whereToGo: ['Config', '$location', function (Config, $location) {
            if (Config.mode === 'ifs') {
              $location.path('/f/');
            } else {
              $location.path('/a/');
            }
          }]
        }
      });
  });
