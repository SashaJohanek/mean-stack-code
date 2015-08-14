'use strict';

/**
 * ImageUploader is exist to handle the upload process for:
 * - add form, represent by onFileSelectForAdd
 * - update form, will be represent by onFileSelectForUpdate
 *
 * We separate those process as add and update form handle the update process
 * differently.
 *
 * The ImageUploader service only need the scope reference in order to access
 * the required parts like `$scope.ui` and `$scope.data`.
 */
angular.module('newsApp')
  .factory('ImageUploader', ['$upload', '$log', function($upload, $log) {

    var ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

    function progressStart(scope) {
      scope.ui.inProgress = true;
    }

    function progressEnd(scope) {
      scope.ui.inProgress = false;
    }

    function deleteImage(scope) {
      // Store the media id in order to delete
      // this entry in the future
      var mediaID;
      if (scope.data.model.media.length > 0) {
        mediaID = scope.data.model.media[0]._id

        scope.trashbin.push(mediaID);
        // Remove the image reference for the categories object
        scope.data.model.media.splice(0, 1);
      }

      // Remove the image preview
      scope.data.model.picture = '';
      // Set the progress bar
      scope.ui.progress = 0;
    }

    // Public API here
    return {
      onFileSelectForAdd: function(scope) {
        /*
         * When a file is selected it is uploaded in a temporary
         * folder in the server.
         *
         * A reference to this path will be stored in the scope.
         *
         * When the save button in this form will be pressed this
         * uploaded file will be moved to its final place (files system or S3)
         *
         * Currently we are supporting only one image. In the case of multiple
         * images selection we will take under account only the first.
         */
        return function($files) {
          scope.ui.progress = 0;

          scope.data.file = $files[0];

          // Upload file filter
          // Only images are accepted
          var fileExt = scope.data.file.name.split('.').slice(-1)[0];

          if (!(ACCEPTED_IMAGE_TYPES.indexOf(fileExt.toLowerCase()) > -1)) {
            alert('No image');
            return;
          }

          $upload.upload({
              url: '/api/uploads',
              method: 'POST',
              file: scope.data.file
            }).progress(function(evt) {
              progressStart(scope);
              scope.ui.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
              scope.data.uploadedImages.push(data.result);
              progressEnd(scope);
            })
            .error(function(data, status, headers, config) {
              progressEnd(scope);
            });
        }
      },
      onFileSelectForUpdateMulti: function(scope) {
        return function($files) {

          scope.data.file = $files[0];

          $upload.upload({
              url: '/api/uploads',
              method: 'POST',
              file: scope.data.file
            }).progress(function(evt) {
              progressStart(scope);
              scope.ui.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
              scope.ui.pictures.push(data.result.file.path);
              scope.data.uploadedImages.push(data.result);
              progressEnd(scope);
            })
            .error(function(data, status, headers, config) {
              progressEnd(scope);
            });

        }
      },
      onFileSelectForUpdate: function(scope) {
        return function($files) {
          deleteImage(scope);

          scope.data.file = $files[0];

          $upload.upload({
              url: '/api/uploads',
              method: 'POST',
              file: scope.data.file
            }).progress(function(evt) {
              progressStart(scope);
              scope.ui.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
              scope.data.model.picture = data.result.file.path;
              // at this point we only support uploading one image at one time
              if (scope.data.uploadedImages.length > 0) {
                scope.data.uploadedImages.splice(0, 1);
              }

              scope.data.uploadedImages.push(data.result);
              progressEnd(scope);
            })
            .error(function(data, status, headers, config) {
              progressEnd(scope);
            });
        }
      }
    };
  }]);
