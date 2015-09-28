'use strict';

var angular = require("angular");
var _ = require("lodash");

export function formGroupCompact() {
  return {
    restrict: "E",
    scope: {
      input: "&input",
      name: "&name",
      errormessage: "&errormessage"
    },
    template: require("./input-compact.html"),
    transclude: true,
    link: function(scope, element, attributes) {
      var input = element[0].getElementsByTagName("input")[0];
      input.setAttribute("name", scope.name());
      input.classList.add("form-control");
    }
  }
}
