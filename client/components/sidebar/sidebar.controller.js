'use strict';

angular.module('newsApp')
  .controller('SidebarCtrl', function($scope, $location, Auth, $translate) {
    $scope.currentUser = Auth.getCurrentUser();

    $scope.isAdmin = Auth.isAdmin;
    $scope.path = $location.path();

    var groups = [];

    groups['/']               = 'dashboard';
    groups['/lectures']       = 'lectures';
    groups['/orders']         = 'orders';
    groups['/articles']       = 'articles';
    groups['/categories']     = 'menu';
    groups['/items']          = 'menu';
    groups['/offers']         = 'menu';
    groups['/grades']         = 'lectures-group';
    groups['/courses']        = 'lectures-group';
    groups['/topics']         = 'lectures-group';
    groups['/lectures']       = 'lectures-group';
    groups['/quizzes']       = 'lectures-group';
    groups['/reviews']        = 'restaurant';
    groups['/push']           = 'push';
    groups['/business']       = 'account';
    groups['/photos']         = 'account';
    groups['/invoice']        = 'account';
    groups['/contact']        = 'account';
    groups['/admin']          = 'admin';
    groups['/rooms-split']       = 'posters';
    groups['/posters']           = 'posters';
    groups['/calendar']          = 'posters';
    groups['/monitors']          = 'posters';
    groups['/rooms']             = 'posters';
    groups['/upload-csv']        = 'posters';

    $scope.isItemActive = function(item){
      var basepath = $location.path().split('/')[1];
      return basepath === item;
    }

    $scope.isGroupActive = function(group){
      var basepath = '/' + $location.path().split('/')[1];
      return groups[basepath] === group;
    }

    /**
    * Listen to change language click event
    */
    $scope.onChangeLanguage = function (key) {
      $translate.use(key);
    };
  });
