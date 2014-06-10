'use strict';

angular
  .module('mfGalleryApp', [
    'ngSanitize',
    'ngRoute',
    'debounce'
//    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/a/:album*?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        // don't reload if the '?' param changes
        reloadOnSearch: false,
        resolve: {
          albumData: ['AlbumService', '$route', function (AlbumService, $route) {
            var currentAlbum = $route.current.params.album || '';
            console.log('current album: ', currentAlbum);
            return AlbumService.getAlbums(currentAlbum);
          }]
        }
      })
//      .when('/f/:image/:path*', {
//        templateUrl: 'views/full.html',
//        controller: 'FullCtrl'
//      })
      .otherwise({
        redirectTo: '/a/'
      });
  });
