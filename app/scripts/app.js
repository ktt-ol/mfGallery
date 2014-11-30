'use strict';

angular
  .module('mfGalleryApp', [
    'ngSanitize',
    'ngRoute',
    'debounce',
    'angular-inview'
  ])
  .config(function ($routeProvider) {
    var albumData = ['AlbumService', '$route', function (AlbumService, $route) {
      return AlbumService.loadInitialAlbum($route.current.params.album);
    }];

    $routeProvider
      .when('/a/', {
        resolve: {
          redirectToPage0: ['$location', function ($location) {
            $location.path('/a/0/');
          }]
        }
      })
      .when('/a/:page?/:album*?', {
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
              $location.path('/a/0/');
            }
          }]
        }
      });
  });
