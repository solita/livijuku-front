'use strict';

module.exports = function() {
  return {
    scope: {
      hakemus: '=hakemus'
    },
    restrict: 'E',
    replace: true,
    template: require('./index.html')
  };
};
