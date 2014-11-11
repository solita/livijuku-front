'use strict';

/**
 * @ngdoc overview
 * @name livijukufrontApp
 * @description
 * # livijukufrontApp
 *
 * Main module of the application.
 */
angular
  .module('livijukufrontApp', [
    'controllers.MainCtrl',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
