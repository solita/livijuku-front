'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('KayttajatiedotCtrl', ['$scope', function ($scope) {


    $scope.toimivaltaiset_viranomaiset = [
      {
        "nimi": "John Doe",
        "organisaatio": "Suomenkylä",
        "rooli": "Hakija",
        "sahkoposti": "john.doe@suomenkyla.fi",
        "puhelinnumero": "040123456",
        "viimeisin_kirjautuminen":  1438588783988
      },
      {
        "nimi": "Markus Meikäläinen",
        "organisaatio": "Oulu",
        "rooli": "Hakija",
        "sahkoposti": "markus.m@oulu.fi",
        "puhelinnumero": "0507654321",
        "viimeisin_kirjautuminen": 1437655152000
      }
    ];

    $scope.liikenneviraston_henkilot = [
      {
        "nimi": "Katri Käsittelijä",
        "rooli": "Käsittelijä",
        "sahkoposti": "katri.k@liikennevirasto.fi",
        "puhelinnumero": "040111222"
      },
      {
        "nimi": "Päivi Päättäjä",
        "rooli": "Päätöksentekijä",
        "sahkoposti": "paivi.p@liikennevirasto.fi",
        "puhelinnumero": "050555777"
      }
    ];

  }]);
