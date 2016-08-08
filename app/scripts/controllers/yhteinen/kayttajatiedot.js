'use strict';

var _ = require('lodash');
var c = require('utils/core');
var angular = require('angular');
var hasPermission = require('utils/user').hasPermission;
var Promise = require('bluebird');

angular.module('jukufrontApp')
  .controller('KayttajatiedotCtrl', ['$scope', '$rootScope', 'KayttajaService', 'OrganisaatioService', 'StatusService', '$q',
    function ($scope, $rootScope, KayttajaService, OrganisaatioService, StatusService, $q) {

      function loadUsers() {
        KayttajaService.findLiviUsers().then(
          users => $scope.liikenneviraston_henkilot = users,
          StatusService.errorHandler);

        KayttajaService.hae().then(user => {
          if (hasPermission(user, "view-non-livi-kayttaja")) {
            $q.all([KayttajaService.findNonLiviUsers(), OrganisaatioService.hae()]).then(
              ([users, organizations]) => $scope.toimivaltaiset_viranomaiset = assocOrganisaationimi(users, organizations),
              StatusService.errorHandler)
          }
        });
      }

      $scope.hasDeleteKayttajaPermission = false;

      $scope.delete = function(tunnus) {
        KayttajaService.deleteKayttaja(tunnus).then(
          function() {
            StatusService.ok("", "Käyttäjän " + tunnus + " poisto onnistui")
            loadUsers();
          },
          StatusService.errorHandler);
      }

      KayttajaService.hae().then(
        user => {
          $scope.hasDeleteKayttajaPermission = hasPermission(user, "delete-kayttaja")
          $scope.hasViewNonLiviUserPermission = hasPermission(user, "view-non-livi-kayttaja")},
        StatusService.errorHandler);

      loadUsers();

      function assocOrganisaationimi (users, organizations) {
        return _.map(users, function(user) {
            user.organisaationimi = c.coalesce(_.find(organizations, {'id': user.organisaatioid}).nimi, "");
            return user;
          });
      }

  }]);
