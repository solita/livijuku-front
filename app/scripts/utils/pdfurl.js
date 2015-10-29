'use strict';

module.exports = {
  getHakemusPdfUrl: function (id) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + id + '/pdf/juku-hakemus.pdf';
  },
  getPaatosPdfUrl: function (id) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + id + '/paatos/pdf/juku-paatos.pdf';
  },
  getHakuohjePdfUrl: function (vuosi) {
    return 'pdf/web/viewer.html?file=../../api/hakemuskausi/' + vuosi + '/hakuohje';
  },
  getLiitePdfUrl: function (hakemusid, liitenumero) {
    return 'pdf/web/viewer.html?file=../../api/hakemus/' + hakemusid + '/liite/' + liitenumero;
  }
};
