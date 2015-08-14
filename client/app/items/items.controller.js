'use strict';

angular.module('newsApp')
  .controller('ItemsListCtrl', ['$scope', '$rootScope', '$http',
    'Items', 'Categories', '$log',
    function($scope, $rootScope, $http, Items, Categories, $log) {

      $scope.$watch('selectedCategory', function(newValue, oldValue) {

        if (newValue) {
          Items.getByCategory($scope.selectedCategory._id).then(function(response) {
            var body = response.data;
            $scope.data.records = [];
            $scope.data.records = body.result;
          });
        }else{
          // fetch the items
          Items.get({
            page: 1
          }).then(function(response) {
            var body = response.data;
            $scope.data.records = [];
            $scope.data.records = body.result;
          });
        }
      });

      $scope.order= {
        isDirty: false
      }

      $scope.data = {
        records: []
      };

      // initialization
      (function(scope) {
        Categories.get().then(function onSuccess(response) {
          scope.categories = response.data.result;
          // scope.selectedCategory = scope.categories[0];
        }, function onFailed(response) {
          console.error('Failed to fetch the categories');
        });
      })($scope);

      // fetch the items
      Items.get({
        page: 1
      }).then(function(response) {
        var body = response.data;
        $scope.data.records = body.result;
      });

      // listen to list updated event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        Items.get({
          page: 1
        }).then(function(response) {
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
          console.log("........records. %o", $scope.data.records);
        },
        change: function(e, ui){
          console.log("Order change.");
        }
      };

      $scope.saveOrder = function(){
        for(var i in $scope.data.records){
          $scope.data.records[i].weight = i;

          var data = {
            name:         $scope.data.records[i].name,
            intro:        $scope.data.records[i].intro,
            description:  $scope.data.records[i].description,
            categoryId:   $scope.data.records[i].categoryId,
            prices:       $scope.data.records[i].prices,
            media:        $scope.data.records[i].media,
            weight:       $scope.data.records[i].weight,
            tax:          $scope.data.records[i].tax,
            preparation:  $scope.data.records[i].preparation
          };

          $scope.order.isDirty = true;
          Items.update($scope.data.records[i]._id, data).then(function onSuccess(response) {
            console.log('response: %o', response)
            $scope.order.isDirty = false;
          }, function onError(response) {
            $log.error('response', response);
          });

        }
        console.log("........records. %o", $scope.data.records);
      }

      $scope.cancelOrder = function(){
        $scope.order.isDirty = false;
        // notify the listener when the category is added
        $scope.$emit('list_updated');
      }

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('newsApp')
  .controller('ItemsItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Items', '$state',
    function($scope, $log, modalDeleteItem, Items, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(item) {
        modalDeleteItem.open(function () {
          Items.delete(item._id)
            .then(function(response) {
              $state.transitionTo('items', {}, {
                reload: true
              });
            });
          });
      };
    }
  ]);

angular.module('newsApp')
  .controller('ItemsAddFormCtrl', ['$scope', 'Items', '$log',
    '$state', 'Categories', 'Media', 'Taxes', 'PreparationTimes',
    'ImageUploader',
    function($scope, Items, $log, $state, Categories, Media, Taxes,
      PreparationTimes, ImageUploader) {

      $scope.data = {
        file: null,
        categories: [],
        taxes: Taxes.get(),
        times: PreparationTimes.get(),
        preparation: 0,
        prices: [],
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

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.prices.push({
          name: '',
          value: ''
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.prices.splice(index, 1);
      };

      // initialization
      (function() {
        $scope.addPriceInputs();
      })();

      // get the category list from DB
      Categories.get(1).then(function onSuccess(response) {
        $scope.data.categories = response.data.result;
      }, function onError(response) {
        $log.error('Failed to load the categories');
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
       * Handle the form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        function saveItem(mediaIds) {
            var data = {
              name: $scope.data.model.name,
              intro: $scope.data.model.intro,
              description: $scope.data.model.description,
              categoryId: (($scope.data.model.category) ? $scope.data.model.category._id : null),
              tax: (($scope.data.model.tax) ? $scope.data.model.tax.value : 0),
              preparation: (($scope.data.preparation) ? $scope.data.preparation.value : 0),
              prices: $scope.data.prices,
              link: $scope.data.model.link,
              media: mediaIds
            };

            Items.create(data).then(function onSuccess(response) {

              // notify the listener when the list is updated
              $scope.$emit('list_updated');

              // display the updated form
              $state.transitionTo($state.current, {}, {
                reload: true
              });
            }, function onError(response) {
              $log.error('failed to add photo');
            });
          } //saveItem()

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.
            // TODO: a check for an empty array is required
            Media.create($scope.data.uploadedImages[0]).then(
              function onSuccess(responce) {
                console.log(responce);
                // Media is saved.
                // Saving item
                var mediaIds = [];
                mediaIds.push(responce.data.result._id)
                saveItem(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
              }
            );
          } //saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of item
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveItem([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('ItemsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Items', '$log', '$stateParams',
    '$state', 'Categories', 'Media', 'Taxes', 'PreparationTimes',
    'ImageUploader',
    function($scope, $rootScope, Items, $log, $stateParams,
      $state, Categories, Media, Taxes, PreparationTimes, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = []

      $scope.data = {
        file: null,
        filePath: '',
        updated: {},
        categories: [],
        taxes: Taxes.get(),
        tax:0,
        times: PreparationTimes.get(),
        preparation: 0,
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

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.model.prices.push({
          name: '',
          value: ''
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.model.prices.splice(index, 1);
      };

      // fetch single item
      Items.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;

        // get the category list from DB
        Categories.get(1)
          .then(function onSuccess(response) {
            $scope.data.categories = response.data.result;

            var selectedCategoryIndex = _.findIndex($scope.data.categories, {
              // _id: $scope.data.model.categoryId
              _id: (($scope.data.model.category) ? $scope.data.model.category._id : null )
            });
            $scope.data.model.category = $scope.data.categories[selectedCategoryIndex];
          }, function onError(response) {
            $log.error('Failed to load the categories');
          });

        // fetch the image
        var mediaID;
        if ($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }

        // Set the selected tax
        var selectedTaxIndex = _.findIndex($scope.data.taxes, {
          value: $scope.data.model.tax
        });
        $scope.data.tax = $scope.data.taxes[selectedTaxIndex];

        // Set the selected preparation time
        var selectedTimeIndex = _.findIndex($scope.data.times, {
          value: $scope.data.model.preparation
        });
        $scope.data.preparation = $scope.data.times[selectedTimeIndex];

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
          mediaID = $scope.data.model.media[0]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(0, 1);
        }

        // Remove the image preview
        $scope.data.model.picture = '';
        // Set the progress bar
        $scope.ui.progress = 0;
      };

      /**
       * Delete the current image
       */
      $scope.deleteImage = function(category) {
        deleteImage();
      };


      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) return;

        progressStart();

        var toBeUpdateItemId = $scope.data.model._id;

        function saveItem(mediaIds) {
          var existingIds = $scope.data.model.media;
          var mergedIds    = existingIds.concat(mediaIds);

          var data = {
            name: $scope.data.model.name,
            intro: $scope.data.model.intro,
            description: $scope.data.model.description,
            prices: $scope.data.model.prices,
            weight: $scope.data.model.weight,
            //categoryId: (($scope.data.model.category) ? $scope.data.model.category._id : null),
            category: (($scope.data.model.category) ? $scope.data.model.category._id : null),
            tax: (($scope.data.tax) ? $scope.data.tax.value : 0),
            preparation: (($scope.data.preparation) ? $scope.data.preparation.value : 0),
            link: $scope.data.model.link,
            media: mergedIds
          };

          Items.update($scope.data.model._id, data).then(function onSuccess(response) {
            $scope.data.model.picture = $scope.data.filePath;
            // notify the listener when the list is updated
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('items.details', {
              id: toBeUpdateItemId
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
              // Saving Item
              var mediaIds = [];
              mediaIds.push(responce.data.result._id)
              saveItem(mediaIds);
            },

            function onError(responce) {
              console.log(responce);
              progressEnd();
            }
          );
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of item
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveItem([]);
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
  .controller('ItemsDetailsCtrl', ['$scope', '$stateParams',
    'Items', 'Categories', 'Media', '$log',
    function($scope, $stateParams, Items, Categories, Media, $log) {
      /// hold the details data
      $scope.data = {
        model : {}
      };

      // fetch single data
      Items.findOne($stateParams.id).then(function(response) {
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
