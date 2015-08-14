'use strict';

angular.module('newsApp')
  .controller('QuizzesListCtrl', ['$scope', '$rootScope', '$http', 'paginator', 'Quizzes',
    function($scope, $rootScope, $http, paginator, Quizzes) {

      var firstPage = 1; // get the 1st page

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

      // fetch the records
      Quizzes.get(firstPage).then(function(response) {
        var body = response.data;
        $scope.data.records = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPrevious(body.page === 1);
        paginator.setNext(body.page === body.num_pages);
      });

      /**
       * Browse the previous page of records
       */
      $scope.previousPage = function() {
        // fetch the pages
        Quizzes.get(paginator.getPage() - 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {

        // fetch the records
        Quizzes.get(paginator.getPage() + 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }

      // listen to hide pages list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {

        Quizzes.get(firstPage).then(function(response) {
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
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesAddFormCtrl', ['$scope', 'Quizzes', '$log', '$state',
    function($scope, Quizzes, $log, $state) {
      $scope.data = {
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {
          questions: []
        }
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /**
       * Add question inputs with empty values
       */
      $scope.addQuestionInputs = function() {
        $scope.data.model.questions.push({
          question: '',
          answers: []
        });
      };

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        var data = {
          title: $scope.data.model.title,
          body: $scope.data.model.body,
          questions: $scope.data.model.questions
        };

        Quizzes.create(data).then(function onSuccess() {
          // notify the listener when the record is added
          $scope.$emit('list_updated');

          // display the updated form
          $state.transitionTo($state.current, {}, {
            reload: true
          });
        }, function onError() {
          progressEnd();
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesItemCtrl', ['$scope', '$log', 'modalDeleteItem',
    'Quizzes', '$state',
    function($scope, $log, modalDeleteItem, Quizzes, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          Quizzes.delete(record._id)
            .then(function onSuccess(response) {
              // reload the list view
              $state.transitionTo('quizzes', {}, {
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
  .controller('QuizzesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Quizzes', '$log', '$stateParams', '$state',
    function($scope, $rootScope, Quizzes, $log, $stateParams, $state) {
      $scope.data = {
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /**
       * Add question inputs with empty values
       */
      $scope.addQuestionInputs = function() {
        $scope.data.model.questions.push({
          question: '',
          answers: []
        });
      };


      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch single record
      Quizzes.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
      });

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) return;

        progressStart();

        var toBeUpdateRecordId = $scope.data.model._id;

        var data = {
          title: $scope.data.model.title,
          body: $scope.data.model.body,
          questions: $scope.data.model.questions
        };

        Quizzes.update($scope.data.model._id, data)
          .then(function onSuccess(response) {
            // notify the listener when the record is added
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('quizzes.details', {
              id: toBeUpdateRecordId
            });
          }, function onError(response) {
            $log.error('response', response);
          });
      };
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesDetailsCtrl', ['$scope', '$stateParams', '$log',
    'Quizzes',
    function($scope, $stateParams, $log, Quizzes) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single page
      Quizzes.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
      });
    }
  ]);


angular.module('newsApp')
  .controller('QuestionItemCtrl', ['$scope', function($scope) {
    $scope.addAnswerInputs = function(answers) {
      answers.push({
        text: '',
        correct: false
      });
    };

    /**
     * Remove question inputs by the element index
     */
    $scope.removeQuestion = function(index) {
      $scope.data.model.questions.splice(index, 1);
    };
  }]);

angular.module('newsApp')
  .controller('AnswerItemCtrl', ['$scope', function($scope) {
    /**
     * Remove question inputs by the element index
     */
    $scope.removeAnswerInputs = function(answers, index) {
      answers.splice(index, 1);
    };
  }]);
