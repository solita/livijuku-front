'use strict';

module.exports = {
  getHakemusPdfUrl: function (id) {
    return 'api/hakemus/' + id + '/pdf/juku-hakemus.pdf';
  },
  getSeurantatietoPdfUrl: function (id) {
    return 'api/hakemus/' + id + '/seuranta/pdf/juku-hakemus-seurantatiedot.pdf';
  },
  getPaatosPdfUrl: function (id) {
    return 'api/hakemus/' + id + '/paatos/pdf/juku-paatos.pdf';
  },
  getHakuohjePdfUrl: function (vuosi) {
    return 'api/hakemuskausi/' + vuosi + '/hakuohje';
  },
  getElyHakuohjePdfUrl: function (vuosi) {
    return 'api/hakemuskausi/' + vuosi + '/elyhakuohje';
  },
  getLiitePdfUrl: function (hakemusid, liitenumero) {
    return 'api/hakemus/' + hakemusid + '/liite/' + liitenumero;
  }
};
