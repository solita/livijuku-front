'use strict';

module.exports = {
  getHakemusPdfUrl: function (id) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + id + '/pdf/juku-hakemus.pdf';
  },
  getSeurantatietoPdfUrl: function (id) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + id + '/seuranta/pdf/juku-hakemus-seurantatiedot.pdf';
  },
  getPaatosPdfUrl: function (id) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + id + '/paatos/pdf/juku-paatos.pdf';
  },
  getHakuohjePdfUrl: function (vuosi) {
    return 'pdf/web/viewer.html?file=../../api/hakemuskausi/' + vuosi + '/hakuohje';
  },
  getElyHakuohjePdfUrl: function (vuosi) {
    return 'pdf/web/viewer.html?file=../../api/hakemuskausi/' + vuosi + '/elyhakuohje';
  },
  getLiitePdfUrl: function (hakemusid, liitenumero) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + hakemusid + '/liite/' + liitenumero;
  }
};
