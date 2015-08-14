'use strict';

angular.module('newsApp')
  .controller('CoursesListCtrl', ['$scope', '$rootScope', '$http', '$location',
    'paginator', 'Courses', 'Grades', '$log',
    function($scope, $rootScope, $http, $location, paginator, Courses, Grades,
      $log) {

      $scope.$watch('selectedGrade', function(newValue, oldValue) {
        if (newValue) {
          Courses.getByGrade($scope.selectedGrade._id)
            .then(function(response) {
              var body = response.data;
              $scope.data.records = [];
              $scope.data.records = body.result;
            });
        } else {
          // fetch the items
          Courses.get({
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

      // fetch the required records
      Grades
        .get()
        .then(function(response) {
          $scope.grades = response.data.result;

          return Courses.get();
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

          Courses.get().then(function(response) {
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
            gradeId: $scope.data.records[i].grade || null,
            weight: $scope.data.records[i].weight
          };

          $scope.order.isDirty = true;
          Courses.update($scope.data.records[i]._id, data).then(function onSuccess(response) {
            console.log('response: %o', response)
            $scope.order.isDirty = false;
          }, function onError(response) {
            $log.error('response', response);
          });

        }
        console.log("........items. %o", $scope.data.records);
      }

      $scope.cancelOrder = function() {
        $scope.order.isDirty = false;
        // notify the listener when the course is added
        $scope.$emit('list_updated');
      }

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('newsApp')
  .controller('CoursesItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Courses', 'Media', '$state',
    function($scope, $log, modalDeleteItem, Courses, Media, $state) {

      /**
       * Delete course item from the list
       */
      $scope.deleteItem = function(course) {
        modalDeleteItem.open(function() {
          var courseID = course._id;

          // Get the record and delete the image associated to it
          Courses.findOne(courseID)
            .then(function(response) {
              var body = response.data;
              $scope.record = body.result;

              // fetch the image
              var mediaID;
              if ($scope.record.media.length > 0) {
                mediaID = $scope.record.media[0]._id

                return Media.delete(mediaID)
              }
            })
            .then(function onSuccess(response) {
              return Courses.delete(courseID);
            })
            .then(function onSuccess(response) {
              // reload the list view
              $state.transitionTo('courses', {}, {
                reload: true
              });
            })
            .catch(function onError(response) {
              console.log('An error occured while deleting record ', response);
            })
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('CoursesAddFormCtrl', ['$scope', 'Courses', 'Grades', '$log',
    '$timeout', '$state', 'Media', 'ImageUploader',
    function($scope, Courses, Grades, $log, $timeout, $state, Media,
      ImageUploader) {

      $scope.data = {
        // keeps track of the available grade
        grades: [],
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
      Grades.get().then(function(response) {
        var body = response.data;
        $scope.data.grades = body.result;
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

        function saveCourse(mediaIds) {
          var data = {
            name: $scope.data.model.name,
            gradeId: (($scope.data.model.grade) ? $scope.data.model.grade._id : null),
            media: mediaIds
          };

          Courses.create(data).then(function onSuccess() {

            // notify the listener when the course is added
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
                // Saving Course
                var mediaIds = [];
                mediaIds.push(responce.data.result._id)
                saveCourse(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of course
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveCourse([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('CoursesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Courses', '$log', '$stateParams', '$state',
    '$location', 'Media', 'ImageUploader', 'Grades',
    function($scope, $rootScope, Courses, $log, $stateParams, $state, $location,
      Media, ImageUploader, Grades) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = []

      $scope.data = {
        grades: [],
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
      Courses.findOne($stateParams.id)
        .then(function(response) {
          var body = response.data;
          $scope.data.model = body.result;

          // fetch the image
          var mediaID;
          if ($scope.data.model.media.length > 0) {

            $scope.data.model.picture = $scope.data.model.media[0].uri;
          }

          return Grades.get();
        }).then(function(response) {
          var body = response.data;
          $scope.data.grades = body.result;

          var selectedGradeIndex = _.findIndex($scope.data.grades, {
            _id: (($scope.data.model.grade) ? $scope.data.model.grade._id : null)
          });
          $scope.data.model.grade = $scope.data.grades[selectedGradeIndex];
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
          // Remove the image reference for the courses object
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
      $scope.deleteImage = function(course) {
        deleteImage();
      };

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) return;

        progressStart();

        var toBeUpdateCourseId = $scope.data.model._id;

        var data = {
          name: $scope.data.model.name
        };

        function saveCourse(mediaIds) {
          var existingIds = $scope.data.model.media;
          var mergedIds = existingIds.concat(mediaIds);

          var data = {
            name: $scope.data.model.name,
            gradeId: (($scope.data.model.grade) ? $scope.data.model.grade._id : null),
            weight: $scope.data.model.weight,
            media: mergedIds
          };

          Courses.update($scope.data.model._id, data).then(function onSuccess(response) {
            progressEnd();
            // notify the listener when the course is added
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('courses.details', {
              id: toBeUpdateCourseId
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
                // Saving Course
                var mediaIds = [];
                mediaIds.push(responce.data.result._id)
                saveCourse(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
                progressEnd();
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of course
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveCourse([]);
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
  .controller('CoursesDetailsCtrl', ['$scope', '$stateParams',
    'Courses', 'Media', '$log',
    function($scope, $stateParams, Courses, Media, $log) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single course
      Courses.findOne($stateParams.id).then(function(response) {
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
