'use strict';

var angular = require("angular");
var _ = require("lodash");

export function formGroupCompact() {
  return {
    restrict: "E",
    require: "^form",
    scope: {
      label: "@label",
      //input: "&input",
      //name: "&name",
      errormessage: "&errormessage"
    },
    template: require("./input-compact.html"),
    transclude: true,
    link: function(scope, element, attributes, form) {
      var input = element[0].getElementsByTagName("input")[0];
      if (!input) {
        input = element[0].getElementsByTagName("select")[0];
      }
      if (!input) {
        console.log("Input or select element is not found inside form-group", element);
        throw("Input or select element is not found inside form-group: " + element);
      }
      //input.setAttribute("name", scope.name());
      input.classList.add("form-control");

      scope.name = input.getAttribute("name");
      scope.input = function() {
        return form[scope.name];
      }
      scope.tooltipText = function() {
        var errorFn = scope.errormessage();
        if (errorFn) {
          return (scope.errormessage())(scope.input());
        } else {
          return "";
        }
      }
    }
  }
}
