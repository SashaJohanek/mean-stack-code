'use strict';

angular.module('newsApp').constant('API', {
  url: '',
  endpoint: {
    articles: '/api/articles/',
    categories: '/api/categories/',
    items: '/api/items/',
    offers: '/api/offers/',
    pages: '/api/pages/',
    orders: '/api/orders/',
    media: '/api/media/',
    accounts: '/api/accounts/',
    reviews: '/api/reviews/',
    lectures: '/api/lectures/',
    grades: '/api/grades/',
    courses: '/api/courses/',
    topics: '/api/topics/',
    quizzes: '/api/quizzes/',
    rooms: '/api/rooms/',
    posters : '/api/posters/'
  }
});
