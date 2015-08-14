'use strict'

angular.module('newsApp')
  .filter('csvToObj', function() {
    return function(input, delimiter) {
      var rows = input.split('\n');
      var obj = [];
      angular.forEach(rows, function(val) {
        var o = val.split(delimiter);
        obj.push({
          code: o[0],
          title: o[1],
          topic: o[2],
          subtopic: o[3],
          session: o[4],
          presenter:{
            firstName: o[5],
            lastName: o[6],
            affiliation: o[7],
            email: o[8]
          },
          correspondingAuthor:{
            firstName: o[9],
            lastName: o[10],
            affiliation: o[11],
            email: o[12]
          },
          author:{
            firstName: o[13],
            lastName: o[14],
            institution: o[15],
            email: o[16],
            isCorresponding: false,
            isPresenter: false
          }
        });
      });
      return obj;
    };
  });