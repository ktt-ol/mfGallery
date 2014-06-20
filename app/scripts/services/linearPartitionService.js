'use strict';

angular.module('mfGalleryApp').service('LinearPartitionService', function () {

  /*
   The following is taken from https://github.com/jakobholmelund/fitpicsjs
   Author: Jakob Holmelund
   */
  /* jshint ignore:start */
  var linearPartition = function (seq, k) {
    var i, n, partitionTable, table, solution, ans = [],
      finalResult = [];

    if (k <= 0) {
      return finalResult;
    }

    n = seq.length - 1;

    if (k > n) {
      for (i = 0; i < seq.length; i++) {
        finalResult.push([seq[i]]);
      }

      return finalResult;
    }

    partitionTable = linearPartitionTable(seq, k);

    table = partitionTable[0];
    solution = partitionTable[1];

    k = k - 2;

    while (k >= 0) {
      var partialAns = [];

      for (i = solution[n - 1][k] + 1; i < n + 1; i++) {
        partialAns.push(seq[i]);
      }

      partialAns = [partialAns];

      ans = partialAns.concat(ans);
      n = solution[n - 1][k];
      k = k - 1;
    }

    for (i = 0; i < n + 1; i++) {
      finalResult.push(seq[i]);
    }

    finalResult = [finalResult];

    return finalResult.concat(ans);
  };


  var linearPartitionTable = function (seq, k) {
    var i, j, n = seq.length,
      row = [],
      table = [],
      solution = [];

    // Create the table
    for (i = 0; i < n; i++) {
      row = [];
      for (j = 0; j < k; j++) {
        row.push(0);
      }
      table.push(row);
    }

    // Create solution
    for (i = 0; i < n - 1; i++) {
      row = [];
      for (j = 0; j < k - 1; j++) {
        row.push(0);
      }
      solution.push(row);
    }

    for (i = 0; i < n; i++) {
      table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
    }

    for (i = 0; i < k; i++) {
      table[0][i] = seq[0];
    }

    for (i = 1; i < n; i++) {
      for (j = 1; j < k; j++) {
        var listToMin = [],
          x;
        for (x = 0; x < i; x++) {
          listToMin.push([Math.max.apply(Math, [table[x][j - 1], table[i][0] - table[x][0]]), x]);
        }

        var result = {
          computed: Infinity,
          value: Infinity
        };
        for (x = 0; x < listToMin.length; x++) {
          listToMin[x][0] < result.computed && (result = {
            value: listToMin[x],
            computed: listToMin[x][0]
          });
        }

        table[i][j] = result.value[0];
        solution[i - 1][j - 1] = result.value[1];
      }
    }

    return [table, solution];
  };


// options

  /**

   images = [{
    width:
    height:
    ... Custom info
}]

   options = {
    containerWidth: int,
    preferedImageHeight: int,
    border: int,
    spacing: int
}

   **/
  var linearPartitionFitPics = function (images, options) {
    options.border = options.border || 0;
    options.spacing = options.spacing || 0;

    var index = 0,
      partition, rowBuffer = [],
      rows, summedWidth = 0,
      summedRatios = 0,
      weights = [];

    for (var i = 0; i < images.length; i++) {
      images[i].aspectRatio = images[i].width / images[i].height;
      summedWidth += images[i].aspectRatio * options.preferedImageHeight;
    }

    rows = Math.round(summedWidth / options.containerWidth);

    if (rows < 1) {
      for (i = 0; i < images.length; i++) {
        images[i].width = parseInt(options.preferedImageHeight * images[i].aspectRatio, 10);
        images[i].height = options.preferedImageHeight;
      }
    } else {
      for (i = 0; i < images.length; i++) {
        weights.push(parseInt(images[i].aspectRatio * 100, 10));
      }

      partition = linearPartition(weights, rows);

      for (i = 0; i < partition.length; i++) {
        var row = partition[i];
        var rowWidth = options.containerWidth;

        if (options.spacing) {
          rowWidth = rowWidth - (options.spacing * (row.length - 1));
        }

        summedRatios = 0;
        rowBuffer = [];

        for (var j = 0; j < row.length; j++) {
          rowBuffer.push(images[index++]);
        }

        for (j = 0; j < rowBuffer.length; j++) {
          summedRatios += rowBuffer[j].aspectRatio;
        }


        for (j = 0; j < rowBuffer.length; j++) {
          var image = rowBuffer[j];
          image.width = parseInt(rowWidth / summedRatios * image.aspectRatio, 10);
          image.height = parseInt(rowWidth / summedRatios, 10);
          if (j === rowBuffer.length - 1) {
            image.break = true;
          }
        }
      }
    }

    return images;
  };

  /*
   END linear partition code
   */


  /**
   images = [{
    width:
    height:
    ... Custom info
}]

   options = {
    containerWidth: int,
    preferedImageHeight: int,
    border: int,
    spacing: int
}
   */
  this.fitPics = function (images, options) {
    return linearPartitionFitPics(images, options);
  };

  /* jshint ignore:end */
});

