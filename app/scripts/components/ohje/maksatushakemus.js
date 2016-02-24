'use strict';

module.exports = function() {
  return {
    template: `
    <div>
      <h3>LISÄTIETOJA KUSTANNUKSISTA JA HAKEMUKSEN ALLEKIRJOITTAJASTA</h3>
      <juku-ohje>

        <p>Liitä hakemukseesi seuraavat tiedot:</p>

        <h5>Kustannusten todentaminen:</h5>

        <p>
          Kirjanpidon ote tai vastaava allekirjoitettu talousselvitys, josta syntyneet maksatukseen
          haettavat kustannukset voidaan todentaa. Laskujäljennöksiä ei tule toimittaa
          maksatushakemuksen yhteydessä.
        </p>

        <h5>Todistus allekirjoitusoikeudesta:</h5>

        <p>Liitä hakemukseen myös liite allekirjoitusoikeudesta.</p>
        <section>
          <ol>
            <li>
              Lataa tiedosto: <a href="resources/JUKU_allekirjoitusoikeus.doc" target="_blank">JUKU_allekirjoitusoikeus.doc</a>
            </li>
            <li>
              Täytä allekirjoitusoikeuslomake.
            </li>
            <li>
              Tulosta lomake ja allekirjoituta se organisaationne joukkoliikenteen avustushakemuksen hyväksyjällä.
            </li>
            <li>
              Skannaa allekirjoitettu lomake ja lataa se liitteeksi tähän hakemukseen.
            </li>
          </ol>
        </section>
      </juku-ohje>
    </div>
    `
  };
};
