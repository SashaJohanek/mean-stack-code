'use strict';

angular.module('newsApp')
  .controller('TopicsListCtrl', ['$scope', '$rootScope', '$http', '$location',
    'paginator', 'Topics', 'Courses',
    function($scope, $rootScope, $http, $location, paginator, Topics, Courses) {

      $scope.$watch('selectedCourse', function(newValue, oldValue) {
        if (newValue) {
          Topics.getByCourse($scope.selectedCourse._id)
            .then(function(response) {
              var body = response.data;
              $scope.data.records = [];
              $scope.data.records = body.result;
            });
        } else {
          // fetch the items
          Topics.get({
            page: 1
          }).then(function(response) {
            var body = response.data;
            $scope.data.records = [];
            $scope.data.records = body.result;
          });
        }
      });

      $scope.order = {
        isDirty: false
      }

      $scope.data = {
        records: []
      };

      // fetch the records
      Courses.get()
        .then(function(response) {
          $scope.courses = response.data.result;

          return Topics.get();
        })
        .then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;
        })
        .catch(function(response) {
          console.log('failed to retch records', response);
        });

      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {

          Topics.get().then(function(response) {
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
            courseId: (($scope.data.records[i].course) ? $scope.data.records[i].course._id : null)
          };

          $scope.order.isDirty = true;

          Topics.update($scope.data.records[i]._id, data)
            .then(function onSuccess(response) {
              console.log('response: %o', response)
              $scope.order.isDirty = false;
            })
            .catch(function onError(response) {
              $log.error('response', response);
            });

        }
        console.log("........items. %o", $scope.data.records);
      }

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
  .controller('TopicsItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Topics', 'Media', '$state',
    function($scope, $log, modalDeleteItem, Topics, Media, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          var recordID = record._id;

          // Get the record and delete the image associated to it
          Topics
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
              return Topics.delete(recordID);
            })
            .then(function onSuccess(response) {
              // reload the list view
              $state.transitionTo('topics', {}, {
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
  .controller('TopicsAddFormCtrl', ['$scope', 'Topics', '$log', '$timeout',
    '$state', 'Media', 'ImageUploader', 'Courses',
    function($scope, Topics, $log, $timeout, $state, Media, ImageUploader,
      Courses) {

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
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
      Courses.get().then(function(response) {
        var body = response.data;
        $scope.data.courses = body.result;
      });

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function() {
        $scope.data.uploadedImages = [];
        $scope.ui.progress = 0;
      }

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        function saveTopic(mediaIds) {
          var data = {
            name: $scope.data.model.name,
            courseId: (($scope.data.model.course) ? $scope.data.model.course._id : null),
            media: mediaIds
          };

          Topics.create(data).then(function onSuccess() {

            // notify the listener when the topic is added
            $scope.$emit('list_updated');

            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function onError() {
            $log.error('failed to add photo');
          });
        }

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.
            // TODO: a check for an empty array is required
            Media.create($scope.data.uploadedImages[0]).then(
              function onSuccess(responce) {
                console.log(responce);
                // Media is saved.
                // Saving Topic
                var mediaIds = [];
                mediaIds.push(responce.data.result._id)
                saveTopic(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of topic
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveTopic([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('TopicsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Topics', '$log', '$stateParams', '$state',
    '$location', 'Media', 'ImageUploader', 'Courses',
    function($scope, $rootScope, Topics, $log, $stateParams, $state,
      $location, Media, ImageUploader, Courses) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = []

      $scope.data = {
        courses: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controllers are binded to.
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
      Topics
        .findOne($stateParams.id)
        .then(function(response) {
          var body = response.data;
          $scope.data.model = body.result;

          // fetch the image
          var mediaID;
          if ($scope.data.model.media.length > 0) {
            $scope.data.model.picture = $scope.data.model.media[0].uri;
          }

          return Courses.get();
        })
        .then(function(response) {
          var body = response.data;
          $scope.data.courses = body.result;

          var selectedCourseIndex = _.findIndex($scope.data.courses, {
            _id: (($scope.data.model.course) ? $scope.data.model.course._id : null)
          });
          $scope.data.model.course = $scope.data.courses[selectedCourseIndex];
        })
        .catch(function(response) {
          console.log('failed to fetch records', response);
        });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdate($scope);

      function deleteImage() {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        if ($scope.data.model.media.length > 0) {
          mediaID = $scope.data.model.media[0]._id

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the topics object
          $scope.data.model.media.splice(0, 1);
        }

        // Remove the image preview
        $scope.data.model.picture = '';
        // Set the progress bar
        $scope.ui.progress = 0;
      }

      /**
       * Delete the current image
       */
      $scope.deleteImage = function(topic) {
        deleteImage();
      };

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) return;

        progressStart();

        var toBeUpdateTopicId = $scope.data.model._id;

        var data = {
          name: $scope.data.model.name
        };

        function saveTopic(mediaIds) {
          var existingIds = $scope.data.model.media;
          var mergedIds = existingIds.concat(mediaIds);

          var data = {
            name: $scope.data.model.name,
            weight: $scope.data.model.weight,
            media: mergedIds,
            courseId: (($scope.data.model.course) ? $scope.data.model.course._id : null),
          };

          Topics.update($scope.data.model._id, data).then(function onSuccess(response) {
            progressEnd();
            // notify the listener when the topic is added
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('topics.details', {
              id: toBeUpdateTopicId
            }, {
              reload: true
            });
          }, function onError(response) {
            $log.error('response', response);
            progressEnd();
          });
        }

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.
            // TODO: a check for an empty array is required
            Media.create($scope.data.uploadedImages[0]).then(
              function onSuccess(responce) {
                console.log(responce);
                // Media is saved.
                // Saving Topic
                var mediaIds = [];
                mediaIds.push(responce.data.result._id)
                saveTopic(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
                progressEnd();
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of topic
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveTopic([]);
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
  .controller('TopicsDetailsCtrl', ['$scope', '$stateParams',
    'Topics', 'Media', '$log',
    function($scope, $stateParams, Topics, Media, $log) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single topic
      Topics.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;

        // fetch the image
        var mediaID;
        if ($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }

      });
    }
  ]);
