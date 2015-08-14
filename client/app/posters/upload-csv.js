'use strict'

angular.module('newsApp')
    .controller('UploadCsvCtrl', ['$scope', 'Posters', '$filter', '$timeout',
      function($scope, Posters, $filter, $timeout) {
        var self = this;
        self.csvFile = csvFile;
        self.uploadedPosters = [];
        self.updateObject = updateObject;
        self.groupPosters = groupPosters;
        self.unionPosters = unionPosters;
        self.onSave = onSave;
        self.filterPosters = filterPosters;

        self.string = '';
        self.checkbox = 'YES';
        self.delimiter = [',', ';', '|'];
        self.currentDelimiter = self.delimiter[0];

        function csvFile(e,files){
          var reader=new FileReader();
          reader.onload=function(e){
            self.string=reader.result;
            self.filterPosters()
          };
          reader.readAsText(files[0]);
        }

        function filterPosters(){
          if(self.string){
            var obj=$filter('csvToObj')(self.string, self.currentDelimiter);
            //do what you want with obj !
            self.updateObject(obj)
          }
        }

        function updateObject(obj){
          obj.splice(0,1);
          $timeout(function(){
            self.uploadedPosters = self.groupPosters(obj)
          }, 1);
        }

        function groupPosters(obj){
          var group_obj = _.groupBy(obj, 'code')
              , union_obj = [];

          _.each(group_obj, function(el){
            union_obj.push(self.unionPosters(el))
          });
          return union_obj
        }

        function unionPosters(el){
          var _union = {};

          _.each(el, function(item){
            _union.code = item.code;
            _union.title = item.title;

            if(item.author.firstName == item.correspondingAuthor.firstName &&
                item.author.lastName == item.correspondingAuthor.lastName){
              item.author.isCorresponding = true
            }
            if(item.author.firstName == item.presenter.firstName &&
                item.author.lastName == item.presenter.lastName){
              item.author.isPresenter = true
            }

            if(!_union.authors) _union.authors = [];
            _union.authors.push(item.author)

          });
          return _union
        }

        function onSave(){
          Posters.save(self.uploadedPosters).$promise.then(function onSuccess(){
            // notify the listener when the record is added
            console.log('=======', arguments[0])
          })
        }
      }
    ]);
