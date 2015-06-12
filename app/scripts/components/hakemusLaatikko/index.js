'use strict';

module.exports = function () {
  return {
    scope: {
      title: '@',
      inactive: '=',
      tila: '@',
      hakemuskausi: '='
    },
    template: `
      <hakemus-panel class="hakemus-laatikko" title="{{title}}" inactive="inactive">
        <hakemus-label tila="{{hakemuskausi.avustushakemukset[tila].tilatunnus}}"></hakemus-label>
        <div class="hakemus-laatikko__hakuaika">
          <strong>Hakuaika:</strong>
          {{ hakemuskausi.avustushakemukset[tila].alkupvm | date: 'dd.MM yyyy' }} - {{ hakemuskausi.avustushakemukset[tila].loppupvm | date: 'dd.MM yyyy' }}
        </div>
      </hakemus-panel>`
  };
};
