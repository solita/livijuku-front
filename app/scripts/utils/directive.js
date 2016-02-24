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
