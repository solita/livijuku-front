'use strict';

var _ = require('lodash');
var angular = require('angular');
var d = require('utils/directive');

angular.module('jukufrontApp').controller('KilpailutusCtrl', ['$scope', '$state', '$element', 'OrganisaatioService', function ($scope, $state, $element, OrganisaatioService) {

  OrganisaatioService.hae().then(response => {
    $scope.organisaatiot = response;

    var idParts = $state.params.id.split('-'),
      kilpailutusRaw = _.filter($scope.kilpailutukset, { id: idParts[1] + '-' + idParts[2], organisaatioId: parseInt(idParts[0], 10) })[0],
      organisaatio = _.filter($scope.organisaatiot, ['id', parseInt(idParts[0], 10)])[0];

    $scope.kilpailutus = {
      linjat: kilpailutusRaw.name,
      organisaatio: organisaatio,
      tarjousPvm: kilpailutusRaw.dates[0],
      paatosPvm: kilpailutusRaw.dates[2],
      ilmoitusVoittajastaPvm: kilpailutusRaw.dates[4],
      liikennointiAlkaaPvm: kilpailutusRaw.dates[5],
      vaadittuKalusto: kilpailutusRaw.vaadittuKalusto,
      lisatiedot: kilpailutusRaw.lisatiedot,
      linkToHilma: kilpailutusRaw.linkToHilma 
    };

    console.info($scope.kilpailutus);
  });

  $scope.kilpailutukset = [{
    id: 'kohde-1',
    organisaatioId: 1,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2016-12-20'), new Date('2017-02-20'), new Date('2017-10-20'), new Date('2019-11-20')],
    lisatiedot: '',
    vaadittuKalusto: '',
    linkToHilma: ''
  }, {
    id: 'kohde-2',
    organisaatioId: 1,
    name: 'Kohde 2',
    dates: [new Date('2016-03-01'), new Date('2016-06-30'), new Date('2016-10-01'), new Date('2017-01-01'), new Date('2017-04-05'), new Date('2018-10-05')],
    lisatiedot: '',
    vaadittuKalusto: '',
    linkToHilma: ''
  }, {
    id: 'kohde-1',
    organisaatioId: 2,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2017-02-20'), new Date('2018-05-10'), new Date('2018-11-01')],
    lisatiedot: '',
    vaadittuKalusto: '',
    linkToHilma: 'http://www.hankintailmoitukset.fi/fi/'
  }];

  $scope.cancel = () => {
    $state.go('app.yhteinen.kilpailutukset');
  };

  $scope.kohteenNimiErrorMessage = d.requiredErrorMessage('Kohteen nimi');

}]);
