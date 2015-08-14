'use strict';

angular.module('newsApp')
  .controller('PushCtrl', function ($scope, $http) {
    $scope.push = {};

    $scope.send = function(){
      $http.post('https://api.cloud.appcelerator.com/v1/users/login.json?key=DgZ1cQDq8FZmxh2sSpWvYrbwWvlUFwLQ&pretty_json=true', {
        'login': 'skounis@gmail.com',
        'password': 'password'
      }).success(function(responce){
        console.log(responce);

        var sessionId = responce.meta.session_id;
        var url = 'https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=DgZ1cQDq8FZmxh2sSpWvYrbwWvlUFwLQ&pretty_json=true&_session_id=' + sessionId

        var payload = {
          'payload': $scope.push.message,
          'to_ids': 'everyone',
          'channel': $scope.push.channel
        }
        // Session id
        // "https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=IJRQvWqlqrGThrcwiKaLAaGUZ20vmXLR&_session_id=bzvXsSXxoMtpvZugTRhM8Jt-i4Q
        //
        $http.post(url, payload).
        success(function(data, status, headers, config){
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
          alert("Message sent.")
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
          alert("An error occurred.")
        });




      });
    }

    $(window).trigger('resize');

  });
