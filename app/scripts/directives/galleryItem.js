'use strict';


angular.module('mfGalleryApp').directive('galleryItem', function () {

  return {
    scope: {
      image: '=galleryItem',
      listenOn: '@',
      url: '@'
    },
    template: '<div in-view="inview($inview)" class="gallery-image waiting">\n    <div class="overlay">\n        <span class="name">{{::image.filename}}</span>\n        <span class="size text-right">{{::image.width}} x {{::image.height}}</span>\n    </div>\n</div>',
    replace: true,
    link: function (scope, element) {

      var loaded = false;

      function updateElement() {
        element.css({
          width: scope.image.linPart.width + 'px',
          height: scope.image.linPart.height + 'px'
        });

        if (scope.image.linPart.break) {
          element.addClass('break');
        } else {
          element.removeClass('break');
        }
      }

      function loadImage() {
//        element.addClass('waiting');

        var img = new Image();
        img.onload = function () {
          element.removeClass('waiting');
          element.css({
            'background': 'url("' + scope.url + '")',
            'backgroundSize': 'cover'
          });
        };

        img.src = scope.url;
      }

      scope.inview = function (inview) {
        if (loaded) {
          return;
        }
        loaded = true;

        loadImage();
      };

      scope.$on(scope.listenOn, function () {
        updateElement();
      });

      updateElement();
    }
  };
});
