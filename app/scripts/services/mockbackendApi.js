'use strict';

angular.module('jukufrontApp')
  .run(function ($httpBackend) {

    var kayttajaOsasto = [{
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
    }];

    var hakemukset = [{
      vuosi: '2015',
      id: '101',
      osasto: 'Pori',
      diaarinumero: '123/223',
      kasittelija: 'Ei määritelty',
      aikaleima: '2014-11-25T08:21:45.206Z',
      avustushakemusstatus: 'K',
      avustushakemushakuaika: '1.9-31.12.2014',
      paikallisliikenne: true,
      paikallisliikenneValtionavustus: '100000',
      paikallisliikenneRahoitusosuus: '100000',
      integroitupalvelulinja: true,
      integroitupalvelulinjaValtionavustus: '200000',
      integroitupalvelulinjaRahoitusosuus: '200000',
      muupsa: true,
      muupsaValtionavustus: '300000',
      muupsaRahoitusosuus: '300000',
      ensimmaksatusstatus: 'Ei käynnissä',
      ensimmaksatushakuaika: '1.1-30.6.2015',
      toinenmaksatusstatus: 'Ei käynnissä',
      toinenmaksatushakuaika: '1.7-31.12.2015'
    },
      {
        vuosi: '2015',
        id: '102',
        osasto: 'Helsingin seudun liikenne',
        diaarinumero: '121/221',
        kasittelija: 'Jenni Eskola',
        aikaleima: '2014-11-23T11:41:32.206Z',
        avustushakemusstatus: 'T',
        avustushakemushakuaika: '1.9-31.12.2014',
        paikallisliikenne: true,
        paikallisliikenneValtionavustus: '100000',
        paikallisliikenneRahoitusosuus: '100000',
        integroitupalvelulinja: true,
        integroitupalvelulinjaValtionavustus: '200000',
        integroitupalvelulinjaRahoitusosuus: '200000',
        muupsa: true,
        muupsaValtionavustus: '300000',
        muupsaRahoitusosuus: '300000',
        ensimmaksatusstatus: 'Ei käynnissä',
        ensimmaksatushakuaika: '1.1-30.6.2015',
        toinenmaksatusstatus: 'Ei käynnissä',
        toinenmaksatushakuaika: '1.7-31.12.2015'
      },
      {
        vuosi: '2015',
        id: '103',
        osasto: 'Hämeenlinna',
        diaarinumero: '111/241',
        kasittelija: 'Toni Bärman',
        aikaleima: '2014-11-20T12:01:21.206Z',
        avustushakemusstatus: 'V',
        avustushakemushakuaika: '1.9-31.12.2014',
        paikallisliikenne: true,
        paikallisliikenneValtionavustus: '100000',
        paikallisliikenneRahoitusosuus: '100000',
        integroitupalvelulinja: true,
        integroitupalvelulinjaValtionavustus: '200000',
        integroitupalvelulinjaRahoitusosuus: '200000',
        muupsa: true,
        muupsaValtionavustus: '300000',
        muupsaRahoitusosuus: '300000',
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
    $httpBackend.whenGET(/api\/(\w+)\/(\d+)\/avustushakemus/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var osasto = urlSplit[2];
      var vuosi = urlSplit[3];
      var tulos = _.find(hakemukset, {'osasto': osasto, 'vuosi': vuosi});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET(/api\/(\d+)\/avustushakemukset/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var vuosi = urlSplit[2];
      var tulos = _.filter(hakemukset, {'vuosi': vuosi});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET(/api\/(\w+)\/aktiivisethakemukset/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var osasto = urlSplit[2];
      var tulos = _.union(_.filter(hakemukset, {
        'osasto': osasto, 'avustushakemusstatus': 'Keskeneräinen'
      }), _.filter(hakemukset, {
        'osasto': osasto,
        'avustushakemusstatus': 'Lähetetty'
      }), _.filter(hakemukset, {'osasto': osasto, 'avustushakemusstatus': 'Tarkastettu'}));
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET(/api\/(\w+)\/vanhathakemukset/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var osasto = urlSplit[2];
      var tulos = _.filter(hakemukset, {'osasto': osasto, 'avustushakemusstatus': 'Päätetty'});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenGET(/api\/(\w+)\/tiedot/).respond(function (method, url, data) {
      var urlSplit = url.split('/');
      var osasto = urlSplit[2];
      var tulos = _.find(kayttajaOsasto, {'osasto': osasto});
      return [200, JSON.stringify(tulos)];
    });
    $httpBackend.whenPOST(/api\/(\w+)\/(\d+)\/tallennaavustushakemus/).respond(function (method, url, data) {
      var params = angular.fromJson(data);
      var urlSplit = url.split('/');
      var osasto = urlSplit[2];
      var vuosi = urlSplit[3];
      var indeksi = _.findIndex(hakemukset, {'osasto': osasto, 'vuosi': vuosi});
      hakemukset[indeksi].avustushakemusstatus = params.avustushakemusstatus;
      hakemukset[indeksi].aikaleima = params.aikaleima;
      hakemukset[indeksi].paikallisliikenne = params.paikallisliikenne;
      hakemukset[indeksi].paikallisliikenneValtionavustus = params.paikallisliikenneValtionavustus;
      hakemukset[indeksi].paikallisliikenneRahoitusosuus = params.paikallisliikenneRahoitusosuus;
      hakemukset[indeksi].integroitupalvelulinja = params.integroitupalvelulinja;
      hakemukset[indeksi].integroitupalvelulinjaValtionavustus = params.integroitupalvelulinjaValtionavustus;
      hakemukset[indeksi].integroitupalvelulinjaRahoitusosuus = params.integroitupalvelulinjaRahoitusosuus;
      hakemukset[indeksi].muupsa = params.muupsa;
      hakemukset[indeksi].muupsaValtionavustus = params.muupsaValtionavustus;
      hakemukset[indeksi].muupsaRahoitusosuus = params.muupsaRahoitusosuus;
      if (params.avustushakemusstatus === 'Keskeneräinen') {
        return [201, 'Save ok'];
      } else {
        return [201, 'Send ok'];
      }

    });
    $httpBackend.whenPOST(/api\/hakemuskausi/).passThrough();
    $httpBackend.whenGET(/api\/hakemukset/).passThrough();
    $httpBackend.whenGET(/api\/hakemukset\/hakija/).passThrough();
    $httpBackend.whenGET(/api\/hakemus\/(\d+)/).passThrough();
    $httpBackend.whenGET(/api\/hakemuskaudet/).passThrough();
    $httpBackend.whenGET(/api\/organisaatiot/).passThrough();
    $httpBackend.whenGET(/\.html$/).passThrough();
    $httpBackend.whenGET(/\.json$/).passThrough();
  });
