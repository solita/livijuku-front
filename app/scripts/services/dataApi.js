'use strict';

/**
 * @ngdoc service
 * @name jukufrontApp.dataApi
 * @description
 * # dataApi
 * Factory in the jukufrontApp.
 */
angular.module('services.dataApi', [])
  .factory('HakemuksetOsasto', function ($http) {
    var getAvustushakemusOsastoVuosi = function (osasto, vuosi) {
      return $http({method: 'GET', url: '/api/' + osasto + '/' + vuosi + '/avustushakemus/'})
        .then(function (response) {
          return response.data;
        });
    };
    var getAvustushakemuksetVuosi = function (vuosi) {
      return $http({method: 'GET', url: '/api/' + vuosi + '/avustushakemukset/'})
        .then(function (response) {
          return response.data;
        });
    };
    var getHakemuksetOsastoAktiiviset = function (osasto) {
      return $http({method: 'GET', url: '/api/' + osasto + '/aktiivisethakemukset/'})
        .then(function (response) {
          return response.data;
        });
    };
    var getHakemuksetOsastoVanhat = function (osasto) {
      return $http({method: 'GET', url: '/api/' + osasto + '/vanhathakemukset/'})
        .then(function (response) {
          return response.data;
        });
    };
    var saveAvustushakemus = function (osasto, vuosi, formdata) {
      return $http({method: 'POST', url: '/api/' + osasto + '/' + vuosi + '/tallennaavustushakemus/', data: formdata})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getAvustushakemus: function (osasto, vuosi) {
        return getAvustushakemusOsastoVuosi(osasto, vuosi);
      },
      getAvustushakemuksetVuosi: function (vuosi) {
        return getAvustushakemuksetVuosi(vuosi);
      },
      getHakemuksetOsastoAktiiviset: function (osasto) {
        return getHakemuksetOsastoAktiiviset(osasto);
      },
      getHakemuksetOsastoVanhat: function (osasto) {
        return getHakemuksetOsastoVanhat(osasto);
      },
      saveAvustushakemus: function (osasto, vuosi, formdata) {
        return saveAvustushakemus(osasto, vuosi, formdata);
      }
    };
  })
  .factory('Osasto', function ($http) {
    var getOsasto = function (osasto) {
      return $http({method: 'GET', url: '/api/' + osasto + '/tiedot/'})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getOsasto: function (osasto) {
        return getOsasto(osasto);
      }
    };
  })

  .factory('AvustuskohteetFactory', function ($resource) {
    return $resource('/api/hakemus/avustuskohteet/:id', {}, {
      query: {method: 'GET', isArray: true},
      update: {
        url: '/api/avustuskohteet',
        method: 'PUT',
        params: {},
        data: '@avustuskohteet',
        headers: {'Content-Type': 'application/json'}
      }
    });
  })

  .factory('HakemusFactory', function ($resource) {
    return $resource('/api/hakemukset/hakija', {}, {
      get: {url: '/api/hakemus/:id', method: 'GET', params: {}, isArray: false},
      query: {method: 'GET', params: {id: '@id'}, isArray: true},
      update: {
        url: '/api/hakemus/selite',
        method: 'PUT',
        params: {},
        data: '@selitedata',
        headers: {'Content-Type': 'application/json'}
      },
      laheta: {
        url: '/api/laheta-hakemus',
        method: 'POST',
        data: {hakemusid: '@hakemusid'}
      },
      tarkasta: {
        url: '/api/tarkasta-hakemus',
        method: 'POST',
        data: {hakemusid: '@hakemusid'}
      },
      suunniteltuavustus: {
        url: '/api/hakemus/suunniteltuavustus',
        method: 'PUT',
        data: '@avustusdata'
      }
    });
  })

  .factory('HakemuskausiFactory', function ($resource) {
    return $resource('/api/hakemuskaudet', {}, {
      query: {method: 'GET', isArray: true},
      create: {
        url: '/api/hakemuskausi',
        method: 'POST',
        params: {},
        data: {vuosi: '@vuosi'}
      }
    });
  })

  .factory('HakemusSuunnitelmatFactory', function ($resource) {
    return $resource('/api/hakemussuunnitelmat/:vuosi/:hakemustyyppitunnus', {}, {
      get: {method: 'GET', params: {}, isArray: true}
    });
  })

  .factory('UserFactory', function ($resource) {
    return $resource('/api/user', {}, {
      query: {method: 'GET', isArray: false}
    });
  })

  .factory('Organisaatiot', function ($http) {
    var getOrganisaatiot = function (organisaatiot) {
      return $http({method: 'GET', url: '/api/organisaatiot'})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getOrganisaatiot: function (organisaatiot) {
        return getOrganisaatiot(organisaatiot);
      }
    };
  });
