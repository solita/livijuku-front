'use strict';

describe('Controller: LahHakemusCtrl', function () {

  // load the controller's module
  beforeEach(module('jukufrontApp'));

  var LahHakemusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LahHakemusCtrl = $controller('LahHakemusCtrl', {
      $scope: scope
    });
  }));

  it('should have no hakemukset to start', function () {
    expect(scope.hakemukset.length).toBe(0);
  });

  it('should add hakemus to the array', function () {
    scope.hakemus =  { "kuntaNimi": "", "kuntaPostiosoite": "", "kuntaPostinumero": "", "kuntaPostitoimipaikka": "", "kuntaPankkitili": "", "kuntaYhteysHlo": "", "kuntaYhteysHloVirkaAsema": "", "kuntaYhteysHloPuh": "", "kuntaYhteysHloSahkoposti": "", "status": "" };
    scope.addHakemus(scope.hakemus);
    expect(scope.hakemukset.length).toBe(1);
  });

  it('should then remove hakemus from the array', function () {
    scope.hakemus =  { "kuntaNimi": "", "kuntaPostiosoite": "", "kuntaPostinumero": "", "kuntaPostitoimipaikka": "", "kuntaPankkitili": "", "kuntaYhteysHlo": "", "kuntaYhteysHloVirkaAsema": "", "kuntaYhteysHloPuh": "", "kuntaYhteysHloSahkoposti": "", "status": "" };
    scope.addHakemus(scope.hakemus);
    scope.removeHakemus(0);
    expect(scope.hakemukset.length).toBe(0);
  });
});
