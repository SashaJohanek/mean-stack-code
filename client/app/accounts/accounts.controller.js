'use strict';


angular.module('newsApp')
  .controller('AccountsCtrl', [ '$scope', '$rootScope', '$location', '$log', '$upload', '$q', 'Accounts', 'Media',
  function ($scope, $rootScope, $location, $log, $upload, $q, Accounts, Media) {

    // UI related information like progress data
    $scope.ui = {}
    // Temporary upload data
    $scope.upload = {
      uploadedImages: []
    }
    // The object that will be serialized / de-serialized
    $scope.data = {};

    // Time picker
    $scope.ismeridian = false;
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.timezone = 0;
    // $scope.openHours = [
    //   {day: 1, openAt: null, closeAt: null},
    //   {day: 2, openAt: null, closeAt: null},
    //   {day: 3, openAt: null, closeAt: null},
    //   {day: 4, openAt: null, closeAt: null},
    //   {day: 5, openAt: null, closeAt: null}
    // ];

    $scope.ui.progress = 0;
    $scope.ui.inProgress = false;

    /**
     * Add Open Hour inputs with empty values
     */
    $scope.addOpenHourInputs = function() {
      $scope.data.business.hours.days.push({
        day: 1,
        openAt: null,
        closeAt: null
      });
    };

    $scope.removeOpenHourInputs = function(index) {
      $scope.data.business.hours.days.splice(index, 1);
    };

    function progressStart(){
      $scope.ui.inProgress = true;
    }

    function progressEnd(){
      $scope.ui.inProgress = false;
    }

    // listen to hide news list update event
    var listUpdatedListener = $rootScope.$on('list_updated', function() {

      // fetch the list
      Accounts.get().then(function(response) {
        var body = response.data;
        $scope.data = body.result[0];
        console.log("Accounts: %o", body.result);
        $scope.ui.pictures = [];

        for (var i in $scope.data.media){
          // TODO: What's this "uri:" string here?
          uri:
          $scope.ui.pictures.push($scope.data.media[i].uri);
        }


      });

    });

    /*
     * Listen on file select
     */
    $scope.onFileSelect = function($files) {
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
      // $scope.image = {};
      $scope.ui.progress = 0;

      $scope.upload.file = $files[0];

      // Upload file filter
      // Only images are accepted
      var fileExt = $scope.upload.file.name.split('.').slice(-1)[0];
      console.log("file type: " + fileExt);


      if ( !(['jpg', 'jpeg', 'png', 'gif' ].indexOf( fileExt.toLowerCase() ) > -1) ){
        alert("No image");
        return;
      }
      //
      //// filter

      $upload.upload({
        url: '/api/uploads',
        method: 'POST',
        file: $scope.upload.file
      }).progress(function(evt) {
        progressStart();
        $scope.ui.progress = parseInt(100.0 * evt.loaded / evt.total);
        $log.debug('percent: ' + $scope.ui.progress);
      }).success(function(data, status, headers, config) {

        $scope.ui.pictures.push(data.result.file.path);

        console.log("Uploaded: %o", data);
        $scope.upload.uploadedImages.push(data.result);
        progressEnd();
      })
      .error(function(data, status, headers, config){
        console.log(data);
        progressEnd();
      });
    };

    $scope.update = function (){

      function saveAccounts(mediaIds){
        for(var i = 0; i < $scope.data.business.hours.days.length; i++){
          var d = $scope.data.business.hours.days[i];
          d.openAt = new Date(d.openAt).getTime();
          d.closeAt = new Date(d.closeAt).getTime();
          $scope.data.business.hours.days[i] = d;
        }

        var totalMediaIDs = $scope.data.media.concat((mediaIds));

        $scope.data.media = totalMediaIDs;

        Accounts.update($scope.data._id, $scope.data).then(function onSuccess(response) {
          console.log('response: %o', response)
          $.notify("All the changes have been saved.", {"status":"success"} || {});

          // notify the listener when the news is added
          $scope.$emit('list_updated');

        }, function onError(response) {
          $log.error('response', response);
        });
      } //saveAccounts()

      function saveMedia(){
        var proms  = [];

        for (var i in $scope.upload.uploadedImages){
          proms.push(Media.create($scope.upload.uploadedImages[i]));
        }

        $q.all(proms)
        .then(function(values) {
          console.log(values);

          var mediaIds = [];
          for(var i in values){
            mediaIds.push(values[i].data.result._id);
          }
          console.log("Media ids %o", mediaIds);
          saveAccounts(mediaIds)
        });
      } //saveMedia()

      // If a media is given and uploaded, save the media, get its id
      // and proceed with the save of page
      if ($scope.upload.uploadedImages.length > 0){
        saveMedia();
      }else{
        saveAccounts([]);
      }

    }

    $scope.cancel = function(){
      $.notify("All the changes have been canceled.", {"status":"info"} || {});

      // notify the listener when the news is added
      $scope.$emit('list_updated');
    }

    // notify the listener when the news is added
    $scope.$emit('list_updated');

    // unregister the listener to avoid memory leak
    $scope.$on('$destroy', listUpdatedListener);

    $(window).trigger('resize');

  }]);
