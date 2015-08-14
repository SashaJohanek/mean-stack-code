'use strict';

angular.module('newsApp')
  .factory('paginator', function() {

    var pagination = {
      next: false,
      previous: false,
      page: 0,
      page_size: 0,
      total: 0,
      num_pages: 0
    };

    // Public API here
    return {
      setNext: function(next) {
        pagination.next = next;
      },
      next: function() {
        return pagination.next;
      },
      setPrevious: function(previous) {
        pagination.previous = previous;
      },
      previous: function() {
        return pagination.previous;
      },
      setPage: function(page) {
        pagination.page = page;
      },
      getPage: function() {
        return pagination.page;
      },
      setPages: function(pages) {
        pagination.num_pages = pages;
      },
      getPages: function() {
        return pagination.num_pages;
      }
    };
  });
