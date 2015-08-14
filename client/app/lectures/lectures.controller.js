'use strict';

angular.module('newsApp')
  .controller('LecturesListCtrl', ['$scope', '$rootScope', '$http', 'paginator',
    'Lectures', 'Topics',
    function($scope, $rootScope, $http, paginator, Lectures, Topics) {

      $scope.$watch('selectedTopic', function(newValue, oldValue) {
        if (newValue) {
          Lectures.getByTopic($scope.selectedTopic._id)
            .then(function(response) {
              var body = response.data;
              $scope.data.records = [];
              $scope.data.records = body.result;
            });
        } else {
          Lectures.get().then(function(response) {
            var body = response.data;
            $scope.data.records = [];
            $scope.data.records = body.result;
          });
        }
      });

      $scope.order = {
        isDirty: false
      };

      $scope.data = {
        records: []
      };

      // fetch the records
      Topics.get()
        .then(function(response) {
          $scope.topics = response.data.result;

          return Lectures.get();
        })
        .then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;
        })
        .catch(function(response) {
          console.log('failed to retch records', response);
        });

      // listen to hide pages list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        Lectures.get().then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;
        });
      });

      $scope.sortableOptions = {
        update: function(e, ui) {
          $scope.order.isDirty = true;

          console.log("Order updated.");
          console.log("........... e. %o", e);
          console.log(".......... ui. %o", ui);
          console.log("........items. %o", $scope.data.records);
        },
        change: function(e, ui) {
          console.log("Order change.");
        }
      };

      $scope.saveOrder = function() {
        for (var i in $scope.data.records) {
          $scope.data.records[i].weight = i;

          var data = {
            name: $scope.data.records[i].name,
            media: $scope.data.records[i].media,
            weight: $scope.data.records[i].weight,
            youtubeLink: $scope.data.records[i].youtubeLink,
            body: $scope.data.records[i].body,
            title: $scope.data.records[i].title,
            topicId: (($scope.data.records[i].topic) ? $scope.data.records[i].topic._id : null)
          };

          $scope.order.isDirty = true;

          Lectures.update($scope.data.records[i]._id, data)
            .then(function onSuccess(response) {
              $scope.order.isDirty = false;
            })
            .catch(function onError(response) {
              $log.error('response', response);
            });
        }
      };

      $scope.cancelOrder = function() {
        $scope.order.isDirty = false;
        // notify the listener when the topic is added
        $scope.$emit('list_updated');
      }

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);


angular.module('newsApp')
  .controller('LecturesAddFormCtrl', ['$scope', 'Lectures', 'Media', '$log',
    '$q', '$timeout', '$state', 'ImageUploader', 'Topics',
    function($scope, Lectures, Media, $log, $q, $timeout, $state, ImageUploader,
      Topics) {

      $scope.data = {
        topics: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch the records
      Topics.get()
        .then(function(response) {

          var body = response.data;

          $scope.data.topics = Topics.map(body.result);

          var selectedTopicIndex = _.findIndex($scope.data.topics, {
            _id: (($scope.data.model.topic) ? $scope.data.model.topic._id : null)
          });
          $scope.data.model.topic = $scope.data.topics[selectedTopicIndex];
        })
        .catch(function(response) {
          console.log('failed to fetch records', response);
        });

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function(index) {
        $scope.data.uploadedImages.splice(index, 1);
        $scope.ui.progress = 0;
      }

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        function saveRecord(mediaIds) {
          var data = {
            title: $scope.data.model.title,
            body: $scope.data.model.body,
            youtubeLink: $scope.data.model.youtubeLink,
            media: mediaIds,
            topicId: (($scope.data.model.topic) ? $scope.data.model.topic._id : null)
          };

          Lectures.create(data).then(function onSuccess() {

            // notify the listener when the record is added
            $scope.$emit('list_updated');

            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function onError() {
            $log.error('failed to add photo');
            progressEnd();
          });

        }

        function saveMedia() {
          var proms = [];

          for (var i in $scope.data.uploadedImages) {
            proms.push(Media.create($scope.data.uploadedImages[i]));
          }

          $q.all(proms)
            .then(function(values) {
              console.log(values);

              var mediaIds = [];
              for (var i in values) {
                mediaIds.push(values[i].data.result._id);
              }
              saveRecord(mediaIds)
            });
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of record
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveRecord([]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('LecturesItemCtrl', ['$scope', '$log', 'modalDeleteItem', 'Lectures',
    'Media', '$state',
    function($scope, $log, modalDeleteItem, Lectures, Media, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          var recordID = record._id;
          // Get the item and delete the image associated to it
          Lectures
            .findOne(recordID)
            .then(function(response) {
              var body = response.data;
              $scope.record = body.result;

              // fetch the image
              var mediaID;
              if ($scope.record.media.length > 0) {
                mediaID = $scope.record.media[0]._id

                return Media.delete(mediaID);
              }
            })
            .then(function onSuccess(response) {
              return Lectures.delete(recordID);
            })
            .then(function onSuccess(response) {
              // reload the list view
              $state.transitionTo('lectures', {}, {
                reload: true
              });
            })
            .catch(function(response) {
              $log.error('An error occured while deleting record', response);
            });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('LecturesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Lectures', '$log', '$q', '$stateParams', '$state',
    'Media', 'ImageUploader', 'Topics',
    function($scope, $rootScope, Lectures, $log, $q, $stateParams, $state,
      Media, ImageUploader, Topics) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = []

      $scope.data = {
        topics: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch single record
      Lectures.findOne($stateParams.id)
        .then(function(response) {
          var body = response.data;
          $scope.data.model = body.result;
          $scope.ui.pictures = [];

          for (var i in $scope.data.model.media) {
            $scope.ui.pictures.push($scope.data.model.media[i].uri);
          }

          return Topics.get();
        })
        .then(function(response) {
          var body = response.data;

          $scope.data.topics = Topics.map(body.result);

          var selectedTopicIndex = _.findIndex($scope.data.topics, {
            _id: (($scope.data.model.topic) ? $scope.data.model.topic._id : null)
          });
          $scope.data.model.topic = $scope.data.topics[selectedTopicIndex];
        })
        .catch(function(response) {
          console.log('failed to fetch records', response);
        });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdateMulti($scope);

      function deleteImage(index) {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        // Check if the requested for deletion
        // image is part of the images already stored in our model
        //
        // Please note that the total number of images
        // in the UI may be more that those in the model:
        // The use may has staged (uploaded but not saved)
        // additional images.
        if ($scope.data.model.media.length > index) {
          mediaID = $scope.data.model.media[index]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(index, 1);
        } else {
          // It is a temporarily uploaded image
          // Calculate its new index (in the uploaded array)
          var reducedIndex = index - $scope.data.model.media.length;
          // Remove it for the array in order
          // to prevent its serialization on update (save)
          $scope.data.uploadedImages.splice(reducedIndex, 1);

        }

        // Remove the image preview
        $scope.ui.pictures.splice(index, 1);

        // Set the progress bar
        $scope.ui.progress = 0;
      }

      /**
       * Delete the current image
       */
      $scope.deleteImage = function(index) {
        deleteImage(index);
      };

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) return;

        progressStart();

        var toBeUpdateRecordId = $scope.data.model._id;

        function saveRecord(mediaIds) {

          // It could be other media allready
          // associated to this record. We should merge them

          var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

          var data = {
            title: $scope.data.model.title,
            body: $scope.data.model.body,
            youtubeLink: $scope.data.model.youtubeLink,
            media: totalMediaIDs,
            weight: $scope.data.model.weight,
            topicId: (($scope.data.model.topic) ? $scope.data.model.topic._id : null)
          };

          Lectures.update($scope.data.model._id, data)
            .then(function onSuccess(response) {
              // notify the listener when the record is added
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('lectures.details', {
                id: toBeUpdateRecordId
              });
            }, function onError(response) {
              $log.error('response', response);
            });

        }

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.

            var proms = [];

            for (var i in $scope.data.uploadedImages) {
              proms.push(Media.create($scope.data.uploadedImages[i]));
            }

            $q.all(proms)
              .then(function(values) {
                console.log(values);

                var mediaIds = [];
                for (var i in values) {
                  mediaIds.push(values[i].data.result._id);
                }
                console.log("Media ids %o", mediaIds);
                saveRecord(mediaIds)
              });

          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of record
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveRecord([]);
        }


        // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id).then(
            function onSuccess(responce) {
              console.log(responce);
            },

            function onError(responce) {
              console.log(responce);
            }
          );
        }

        for (var key in $scope.trashbin) {
          deleteMedia($scope.trashbin[key]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('LecturesDetailsCtrl', ['$scope', '$stateParams', '$log',
    'Lectures',
    function($scope, $stateParams, $log, Lectures) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single page
      Lectures.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.data.model.pictures = [];

        for (var i in $scope.data.model.media) {

          $scope.data.model.pictures.push($scope.data.model.media[i].uri);
        }

      });
    }
  ]);
