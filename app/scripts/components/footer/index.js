'use strict';

function footerController($scope, ConfigService) {
  ConfigService.hae().then(function (response) {
    $scope.environmentName = response.environmentName;
  });
}


footerController.$inject = ['$scope', 'ConfigService'];

module.exports = function () {
  return {
    restrict: 'E',
    controller: footerController,
    template: `
      <div class="footer navbar">
        <div class="container">
          <img src="images/juku_logo.svg" class="logo footer__logo">

          <div>
            <span class="footer__version">${__VERSION__}</span>
            <span class="footer__environment">
              {{environmentName}}
            </span>
          </div>

          <span class="footer__domain">
            Liikennevirasto
          </span>
        </div>
      </div>
    `,
    replace: true
  };
};
