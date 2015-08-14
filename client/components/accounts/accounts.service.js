'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .service('Accounts', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.accounts;

      // Public API here
      return {
        initialize: function(userID, data){
          var prefs = {
            createdBy: userID,
            business: {
              name: '',
              description: '',
              hours: '',
              website: '',
              email: '',
              address: '',
              addressExtra: '',
              zipcode: '',
              latlong: '',
              zoom: ''
            },
            invoice: {
              name: data.invoice.name,
              organisationId: data.invoice.organisationId,
              phone: '',
              email: '',
              address: '',
              addressExtra: '',
              zipcode: '',
              state: '',
            },
            contact: {
              name: '',
              phone: '',
              email: ''
            },
            offers: {
              active: true
            },
            media: [],
            createdAt: Date.now(),
            modifiedAt: Date.now()
          };

          return $http.post(API_ENDPOINT, prefs);
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        get: function(page) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page
            }
          });
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        getForUser: function(userId) {
          return $http.get(API_ENDPOINT + 'search/' + userId);
        }
      };
    }
  ]);
