'use strict';

angular.module('newsApp')
  .controller('ArticlesListCtrl', ['$scope', '$rootScope', '$http', '$location',
    'paginator', 'Articles', '$translate',
    function($scope, $rootScope, $http, $location, paginator, Articles, $translate) {

      var FIRST_PAGE = 1; // get the 1st page

      $scope.data = {
        records: []
      };

      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 0,
        page_size: 0,
        total: 0,
        num_pages: 0
      };

      $scope.paginator = paginator;

      // fetch the data
      Articles.get(FIRST_PAGE).then(function(response) {
        var body = response.data;
        $scope.data.records = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPrevious(body.page === 1);
        paginator.setNext(body.page === body.num_pages);
      });

      /**
       * Browse the previous page of articles
       */
      $scope.previousPage = function() {
        // fetch the data
        Articles.get(paginator.getPage() - 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }

      /**
       * Browse the next page of articles
       */
      $scope.nextPage = function() {

        // fetch the data
        Articles.get(paginator.getPage() + 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }

      // listen to updated list event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {

        Articles.get(FIRST_PAGE).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });

      });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');

      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };
    }
  ]);

angular.module('newsApp')
  .controller('ArticlesItemCtrl', ['$scope', '$log', 'modalDeleteItem', 'Articles',
    'Media', '$state',
    function($scope, $log, modalDeleteItem, Articles, Media, $state) {

      /**
       * Delete article item from the list
       */
      $scope.deleteItem = function(article) {

        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          Articles.findOne(article._id).then(function(response) {
            var body = response.data;
            $scope.record = body.result;

            // fetch the image
            var mediaID;
            if ($scope.record.media.length > 0) {
              mediaID = $scope.record.media[0]._id

              Media.delete(mediaID)
                .then(function onSuccess(response) {
                    $log.info('Media is deleted ', response);
                  },
                  function onError(response) {
                    console.log('An error occured while deleting Media ', response);
                  });
            }
          });

          Articles.delete(article._id)
            .then(function onSuccess(response) {
              // reload the pages list view
              $state.transitionTo('articles', {}, {
                reload: true
              });
            }, function onError(response) {
              console.log('An error occured while deleting record ', response);
            });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('ArticlesAddFormCtrl', ['$scope', 'Articles', 'Media',
    '$log', '$q', '$timeout', '$state', 'ImageUploader',
    function($scope, Articles, Media, $log, $q, $timeout, $state, ImageUploader) {

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      // Keeps UI related information
      // states, progress etc.
      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function(index) {
        console.log("Remove image at index: %i", index);
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
              tags: $scope.data.model.tags,
              body: $scope.data.model.body,
              media: mediaIds
            };

            Articles.create(data).then(function onSuccess() {

              // notify the listener when the page is added
              $scope.$emit('list_updated');

              // display the updated form
              $state.transitionTo($state.current, {}, {
                reload: true
              });
            }, function onError() {
              $log.error('failed to add photo');
              progressEnd();
            });


          } //saveRecord()

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
                console.log("Media ids %o", mediaIds);
                saveRecord(mediaIds)
              });
          } //saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of page
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveRecord([]);
        }

      };

    }
  ]);

angular.module('newsApp')
  .controller('ArticlesUpdateFormCtrl', [
    '$scope', '$rootScope', '$upload', 'Articles', '$log', '$q', '$stateParams',
    '$state', '$location', 'Media', 'ImageUploader',
    function($scope, $rootScope, $upload, Articles, $log, $q, $stateParams,
      $state, $location, Media, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = []

      $scope.data = {
        uploadedImages: [],
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
      Articles.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.ui.pictures = [];

        for (var i in $scope.data.model.media) {
          $scope.ui.pictures.push($scope.data.model.media[i].uri);
        }

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
        }else{
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

            // It could be other media already
            // associated to this page. We should merge them
            var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

            var data = {
              title: $scope.data.model.title,
              tags: $scope.data.model.tags,
              body: $scope.data.model.body,
              media: totalMediaIDs
            };

            Articles.update($scope.data.model._id, data)
              .then(function onSuccess(response) {
                // notify the listener when the list is updated
                $rootScope.$emit('list_updated');
                // display the updated form
                $state.transitionTo('articles.details', {
                  id: toBeUpdateRecordId
                });
              }, function onError(response) {
                $log.error('response', response);
              });

          } // saverRecord()

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
        // and proceed with the save of page
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

      }; //update()
    }
  ]);

angular.module('newsApp')
  .controller('ArticlesDetailsCtrl', ['$scope', '$stateParams',
    'Articles',
    function($scope, $stateParams, Articles) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      $scope.ui = {};

      // fetch single record
      Articles.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.ui.pictures = [];

        for (var i in $scope.data.model.media) {
          $scope.ui.pictures.push($scope.data.model.media[i].uri);
        }

      });
    }
  ]);
