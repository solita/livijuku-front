'use strict';

var _ = require('lodash');
var angular = require('angular');
var d = require('utils/directive');
var c = require('utils/core');
var t = require('utils/time');

const kilpailutusPVMProperties = [
  'julkaisupvm',
  'tarjouspaattymispvm',
  'hankintapaatospvm',
  'liikennointialoituspvm',
  'liikennointipaattymispvm',
  'hankittuoptiopaattymispvm',
  'optiopaattymispvm'];


const kilpailutusPVMNames = {
  julkaisupvm:               'tarjouspyynnön julkaisupäivä',
  tarjouspaattymispvm:       'tarjousajan päättyminen',
  hankintapaatospvm:         'hankintapäätös',
  liikennointialoituspvm:    'liikennöinnin aloituspäivä',
  liikennointipaattymispvm:  'liikennöinnin päättyminen',
  hankittuoptiopaattymispvm: 'käyttöönotetun option päättyminen',
  optiopaattymispvm:         'optioiden päättyminen'
};

function createOrderValidator(scope, path, orderrelation) {
  return function(modelValue, viewValue) {
    var othervalue = _.get(scope, path);
    return c.isNullOrUndefined(modelValue) ||
           c.isNullOrUndefined(othervalue) ||
           orderrelation(modelValue, othervalue);
  }
}

angular.module('jukufrontApp').directive('kilpailutusPvmValidator', function () {
  return {
    require: 'form',
    link: function(scope, elem, attr, form) {

      function setValidators(properties, errortype, orderrelation) {
        _.forEach(_.initial(properties), (property, index) => {
          _.forEach(_.slice(properties, index + 1), (otherProperty) => {
            form[property].$validators[errortype + '-' + otherProperty] = createOrderValidator(scope, 'kilpailutus.' + otherProperty, orderrelation);
          });
        })
      }

      setValidators(kilpailutusPVMProperties, 'less-than', (modelValue, othervalue) => modelValue < othervalue);
      setValidators(_.reverse(_.clone(kilpailutusPVMProperties)), 'gt-than', (modelValue, othervalue) => modelValue > othervalue);

      form.hankittuoptiopaattymispvm.$validators['less-than-optiopaattymispvm'] =
        createOrderValidator(scope, 'kilpailutus.optiopaattymispvm', (modelValue, othervalue) => modelValue <= othervalue);

      form.optiopaattymispvm.$validators['gt-than-hankittuoptiopaattymispvm'] =
        createOrderValidator(scope, 'kilpailutus.hankittuoptiopaattymispvm', (modelValue, othervalue) => modelValue >= othervalue);


      function validate() {
        _.forEach(kilpailutusPVMProperties, (property, index) => {
          form[property].$validate();
        });
      }

      scope.$watchGroup(_.map(kilpailutusPVMProperties, p => 'kilpailutus.' + p), validate);
    }
  };
});

const lessThanErrorMessages = _.mapValues(_.mapKeys(kilpailutusPVMNames, (value, key) => 'less-than-' + key), v => nimi => nimi + ' pitää olla aikaisemmin kuin ' + v);
const gtThanErrorMessages = _.mapValues(_.mapKeys(kilpailutusPVMNames, (value, key) => 'gt-than-' + key), v => nimi => nimi + ' pitää olla myöhemmin kuin ' + v);

function createOrderErrorMessage(nimi, errormessages) {
  return function (input) {
    const error = _.first(_.values(_.pick(errormessages, _.keys(input.$error))));
    return error ? error(nimi) : null;
  }
}

angular.module('jukufrontApp').controller('KilpailutusCtrl',
  ['$scope', '$state', '$element', '$q', 'StatusService', 'OrganisaatioService', 'KilpailutusService', 'KayttajaService',
  function ($scope, $state, $element, $q, StatusService, OrganisaatioService, KilpailutusService, KayttajaService) {

    const isNew = $state.params.id == 'new';
    $scope.isNew = isNew;

    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      formatMonth: 'MM'
    };

    if (isNew) {
      $q.all([OrganisaatioService.hae(), KayttajaService.hae()]).then(
        ([organisaatiot, user]) => {
          $scope.kilpailutus = {
            organisaatioid: user.organisaatioid,
            kohdearvo: null,
            kalusto:   null,
            selite:    null,
            sopimusmallitunnus: null,

            julkaisupvm:               null,
            tarjouspaattymispvm:       null,
            hankintapaatospvm:         null,
            liikennointialoituspvm:    null,
            liikennointipaattymispvm:  null,
            hankittuoptiopaattymispvm: null,
            optiopaattymispvm:         null,

            optioselite: null,

            hilmalinkki: null,
            asiakirjalinkki: null,

            liikennoitsijanimi: null,
            tarjousmaara:  null,
            tarjoushinta1: null,
            tarjoushinta2: null
          };
          $scope.organisaatio = _.find(organisaatiot, {id: user.organisaatioid});
          $scope.organisaatiot = organisaatiot;
        }, StatusService.errorHandler);
    } else {
      $q.all([OrganisaatioService.hae(), KilpailutusService.get($state.params.id)]).then(
        ([organisaatiot, kilpailutus]) => {
          $scope.kilpailutus = c.updateAll(kilpailutus, kilpailutusPVMProperties, value => c.isNotBlank(value) ? new Date(value) : null);

          $scope.organisaatio = _.find(organisaatiot, {id: kilpailutus.organisaatioid});

          $scope.organisaatiot = organisaatiot;
        }, StatusService.errorHandler);
    }

    KilpailutusService.findSopimusmallit().then(sopimusmallit => {
      $scope.sopimusmallit = _.concat( {tunnus: null, nimi: "Valitse sopimusmalli"}, sopimusmallit);
    }, StatusService.errorHandler);

    $scope.cancel = function () {
      $state.go('app.kilpailutukset');
    };

    $scope.save = function () {
      StatusService.tyhjenna();

      if (!$scope.kilpailutusForm.$valid) {
        $scope.$emit('focus-invalid');
        d.touchErrorFields($scope.kilpailutusForm);

        StatusService.virhe('', 'Korjaa lomakkeen virheet ennen tallentamista.');
        return;
      }

      var kilpailutusEdit = c.updateAll(
        _.clone($scope.kilpailutus),
        kilpailutusPVMProperties,
        date => date ? t.toISOString(date) : null);

      kilpailutusEdit.id = undefined;

      if (c.isNotBlank(kilpailutusEdit.hilmalinkki) &&
          kilpailutusEdit.hilmalinkki.indexOf('http') !== 0) {
        kilpailutusEdit.hilmalinkki = 'https://' + kilpailutusEdit.hilmalinkki;
      }

      const savePromise = isNew ?
        KilpailutusService.add(kilpailutusEdit) :
        KilpailutusService.save($scope.kilpailutus.id, kilpailutusEdit);

      savePromise.then(function() {
        StatusService.ok('', 'Kilpailutuksen tallennus onnistui.');
        $scope.kilpailutusForm.$setPristine();
        $state.go('app.kilpailutukset');
      }, StatusService.errorHandler);
    };

    $scope.kohdenimiErrorMessage = d.requiredErrorMessage('Kohteen nimi');

    function createNotRequiredKilpailutusPVMErrorMessage(nimi) {
      return d.combineErrorMessages(d.dateErrorMessage,
        createOrderErrorMessage(nimi, lessThanErrorMessages),
        createOrderErrorMessage(nimi, gtThanErrorMessages));
    }

    function createRequiredKilpailutusPVMErrorMessage(nimi) {
      return d.combineErrorMessages(
        d.dateErrorMessage,
        d.requiredErrorMessage(nimi),
        createOrderErrorMessage(nimi, lessThanErrorMessages),
        createOrderErrorMessage(nimi, gtThanErrorMessages));
    }

    $scope.julkaisupvmErrorMessage = createNotRequiredKilpailutusPVMErrorMessage('Tarjouspyynnön julkaisupäivä');
    $scope.tarjouspaattymispvmErrorMessage = createNotRequiredKilpailutusPVMErrorMessage('Tarjousajan päättyminen');
    $scope.hankintapaatospvmErrorMessage = createNotRequiredKilpailutusPVMErrorMessage('Hankintapäätös');

    $scope.liikennointialoituspvmErrorMessage = createRequiredKilpailutusPVMErrorMessage('Liikennöinnin aloittaminen');
    $scope.liikennointipaattymispvmErrorMessage = createRequiredKilpailutusPVMErrorMessage('Liikennöinnin päättäminen');

    $scope.hankittuoptiopaattymispvmErrorMessage = createNotRequiredKilpailutusPVMErrorMessage('Käyttöönotetun option päättyminen');
    $scope.optiopaattymispvmErrorMessage = createNotRequiredKilpailutusPVMErrorMessage('Optioiden päättyminen');

  }]);


