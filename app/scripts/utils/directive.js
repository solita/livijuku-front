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

/**
 * A case template directive consists of a map of templates.
 * The current template is selected dynamically by the type parameter i.e. templates[scope.type].
 * This mechanism is loosely based on blog post: http://onehungrymind.com/angularjs-dynamic-templates/
 */
export function caseTemplate(templates) {
  return ['$compile', $compile => {
    return {
      restrict: 'E',
      scope: {
        type: "<type"
      },
      link: function(scope, element) {

        var template = templates[scope.type];
        if (c.isNullOrUndefined(template)) {
          throw "Type: " + scope.type + " has no template."
        }
        element.html(template);
        $compile(element.contents())(scope.$parent);
      }
    }
  }];
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

/*
 * Format float values using finnish conventions
 * see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 */
export function formatFloat(value) {
  const parts = _.split(_.toString(value), '.');
  parts[0] = _.replace(parts[0], /\B(?=(\d{3})+(?!\d))/g, '\xa0');
  return _.join(parts, ',');
}

export function formatFloatToFixed(scale, value) {
  return formatFloat(_.round(value, scale).toFixed(scale));
}

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

export function maxNumberErrorMessage(input, element) {
  return input.$error.max ? 'Arvo on liian suuri. Maksimiarvo on ' + formatFloat(element.attr('max')) : null;
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

export function dateErrorMessage(input) {
  return input.$error.date ? 'Päivämäärä on virheellisen muotoinen. Sallittu muoto on päivä.kuukausi.vuosi. Vuosiluku on mahdollista määrittää neljällä tai kahdella numerolla.' : null;
}

export function combineErrorMessages() {
  return (input, element) => _.find(_.map(arguments, f => f(input, element)), c.isDefinedNotNull);
}

export function createTabFunctions($scope, tabProperty) {
  $scope.isTabSelected = function(tyyppi) {
    return $scope[tabProperty] === tyyppi;
  };

  $scope.toTab = function(tyyppi) {
    $scope[tabProperty] = tyyppi;
  };
}

// see: http://stackoverflow.com/questions/30628611/programmatically-set-all-form-fields-to-ng-touched-on-form-submission
export function touchErrorFields(form) {
  _.forEach(form.$error, function (error) {
      _.forEach(error, function(errorField){
          errorField.$setTouched();
        });
    });
}
