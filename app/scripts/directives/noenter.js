'use strict';

var $ = require('jquery');

angular.module('jukufrontApp')
  .directive('noenter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          event.preventDefault();
          var fields = $(this).parents('form:eq(0),body').find('input, textarea, select, a');
          var index = fields.index(this);
          if (index > -1 && (index + 1) < fields.length)
            fields.eq(index + 1).focus();
        }
      });
    };
  });
