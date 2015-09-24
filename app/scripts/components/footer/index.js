'use strict';

function footerController($scope, ConfigService) {
  ConfigService.hae().then(function (response) {
    $scope.environmentName = response.environmentName;
  }, $scope.environmentName = '');
}


footerController.$inject = ['$scope', 'ConfigService'];

module.exports = function () {
  return {
    restrict: 'E',
    controller: footerController,
    template: `
      <div class="footer navbar">
        <div class="container">
          <div class="col-xs-8">
            <img src="images/juku_logo.svg" class="logo">
            <span>${__VERSION__}</span>
          </div>
          <div class="col-xs-2">
            {{environmentName}}
          </div>
          <div class="col-xs-2 footer__domain">
            Liikennevirasto
          </div>
        </div>
      </div>
    `,
    replace: true
  };
};
