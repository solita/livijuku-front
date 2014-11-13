'use strict';

/**
 * @ngdoc overview
 * @name jukufrontApp
 * @description
 * # jukufrontApp
 *
 * Main module of the application.
 */
angular
  .module('jukufrontApp', [
    'controllers.MainCtrl',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/avustushakemus', {
        templateUrl: 'views/avustushakemus.html',
        controller: 'AvustushakemusCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
