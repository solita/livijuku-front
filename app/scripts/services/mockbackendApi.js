'use strict';

angular.module('jukufrontApp')
  .run(function ($httpBackend) {

    var kayttajaOsasto = {
      osasto: 'Pori',
      kuntaNimi: 'Pori',
      kuntaPostiosoite: 'PL 123',
      kuntaPostinumero: '28100',
      kuntaPostitoimipaikka: 'Pori',
      kuntaPankkitili: 'FI6580001234567890',
      kuntaYhteysHlo: 'Heikki Hakija',
      kuntaYhteysHloVirkaAsema: 'Joukkoliikenneasiantuntija',
      kuntaYhteysHloPuh: '044 1234567',
      kuntaYhteysHloSahkoposti: 'heikki.hakija@pori.fi',
      kuntaToinenYhteysHlo: 'Teuvo Toinen',
      kuntaToinenYhteysHloVirkaAsema: 'Joukkoliikenneasiantuntija',
      kuntaToinenYhteysHloPuh: '044 12312345',
      kuntaToinenYhteysHloSahkoposti: 'teuvo.toinen@pori.fi',
      kuntaHyvaksyjaYhteysHlo: 'Päivi Päättäjä',
      kuntaHyvaksyjaYhteysHloVirkaAsema: 'Liikenneinsinööri',
      kuntaHyvaksyjaYhteysHloPuh: '044 3453456',
      kuntaHyvaksyjaYhteysHloSahkoposti: 'paivi.paattaja@pori.fi'
    };

    var hakemukset = [{
      vuosi: '2015',
      osasto: 'Pori',
      avustushakemusstatus: 'Keskeneräinen',
      avustushakemushakuaika: '1.9-31.12.2014',
      ensimmaksatusstatus: 'Ei käynnissä',
      ensimmaksatushakuaika: '1.1-30.6.2015',
      toinenmaksatusstatus: 'Ei käynnissä',
      toinenmaksatushakuaika: '1.7-31.12.2015'
    },
      {
        vuosi: '2014',
        osasto: 'Pori',
        avustushakemusstatus: 'Päätetty',
        avustushakemushakuaika: '1.9-31.12.2013',
        ensimmaksatusstatus: 'Maksettu',
        ensimmaksatushakuaika: '1.1-30.6.2014',
        toinenmaksatusstatus: 'Maksettu',
        toinenmaksatushakuaika: '1.7-31.12.2014'
      },
      {
        vuosi: '2013',
        osasto: 'Pori',
        avustushakemusstatus: 'Päätetty',
        avustushakemushakuaika: '1.9-31.12.2012',
        ensimmaksatusstatus: 'Maksettu',
        ensimmaksatushakuaika: '1.1-30.6.2013',
        toinenmaksatusstatus: 'Maksettu',
        toinenmaksatushakuaika: '1.7-31.12.2013'
      }];
    $httpBackend.whenGET(/api\/(\w+)\/aktiivisethakemukset/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var haettavaOsasto = urlSplit[2];
      var tulos = _.reject(hakemukset, {'osasto': haettavaOsasto, 'avustushakemusstatus': 'Päätetty'});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET('/api/Pori/vanhathakemukset/').respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var haettavaOsasto = urlSplit[2];
      var tulos = _.filter(hakemukset, {'osasto': haettavaOsasto, 'avustushakemusstatus': 'Päätetty'});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
    $httpBackend.whenGET(/\.json$/).passThrough();
  });
