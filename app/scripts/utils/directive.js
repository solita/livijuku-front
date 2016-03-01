'use strict';

var _ = require('lodash');
var c = require('utils/core');

/**
 * Template function creates a simple element directive, which consists of a html-template.
 * The template source does not change and shares the same scope, where this directive is used.
 */
export function template(content) {
  return _.constant({
    restrict: 'E',
    scope: false,
    template: content
  });
}

export function bindModel() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: false,
    link: function(scope, element, attrs, modelCtrl) {
      if (c.isNullOrUndefined(scope.inputs)) { scope.inputs = {} }
      if (c.isNullOrUndefined(attrs.bindModel)) {
        throw "Attribuutin bind-model arvoa ei ole määritetty."
      }
      scope.inputs[attrs.bindModel] = modelCtrl;
    }
}};

export function requiredErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : null;
  }
}

export function maxErrorMessage(maxvalue) {
  return function (input) {
    return input.$error.max ? 'Arvo on liian suuri. Maksimiarvo on ' + maxvalue : null;
  }
}

export function maxlengthNumberErrorMessage(maxvalue) {
  return function (input) {
    return input.$error.maxlength ? 'Arvo on liian suuri. Maksimiarvo on ' + maxvalue : null;
  }
}

export function maxlengthTextErrorMessage(maxlength) {
  return function (input) {
    return input.$error.maxlength ? 'Teksti on liian pitkä. Maksimipituus on ' + maxvalue : null;
  }
}

export function combineErrorMessages() {
  return input => _.find(_.map(arguments, f => f(input)), c.isDefinedNotNull);
}

export function createTabFunctions($scope, tabProperty) {
  $scope.isTabSelected = function(tyyppi) {
    return $scope[tabProperty] === tyyppi;
  };

  $scope.toTab = function(tyyppi) {
    $scope[tabProperty] = tyyppi;
  };
}
