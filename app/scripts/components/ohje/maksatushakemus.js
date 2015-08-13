'use strict';

module.exports = function() {
  return {
    template: `
    <div>
      <h3>LISÄTIETOJA KUSTANNUKSISTA JA HAKEMUKSEN ALLEKIRJOITTAJASTA</h3>
      <juku-ohje>

        <p>Liitä hakemukseesi seuraavat tiedot:</p>

        <h5>Seurantalomakkeet:</h5>

        <p>Lataa seurantalomake: <a href="resources/JUKU_valtionavustusten_seurantalomake_2015.xlsx" target="_blank">Valtionavustuksen
          seurantalomake</a>
        </p>
        <section>
          <ul>
            <li>
              Täytä lomakkeeseen tiedot PSA-liikenteestä ja hintavelvoitteiden korvaamisesta (Linja-, sopimus- tai
              yhteenvetotasolla).
            </li>
            <li>
              Huomaa, että valtionavustuksen seurantalomakeessa on neljä välilehteä: Paikallisliikenne,
              palveluliikenne,
              kaupunkilippu ja seutulippu.
            </li>
            <li>
              Toimivaltaisen viranomaisen ja seurantatietojen ajankohdan voit valita lomakkeen alasvetovalikoista.
            </li>
          </ul>
        </section>
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
