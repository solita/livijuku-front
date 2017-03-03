package juku;

import juku.hakija.OmatHakemukset;
import juku.kasittelija.Hakemuskaudet;
import juku.kasittelija.KaikkiHakemukset;
import juku.kasittelija.Suunnittelu;
import juku.yhteinen.Hakemus;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

public class HakemuskausiTest extends TestBase {

    @Test
    public void hakijaaInformoidaanHakemuksenTilasta() throws IOException, URISyntaxException {

        /************************************************************
         * Avustushakemus
         */

        login(User.HARRI);

        // Varmista, että kausi on avoinna TODO: Korjaa tämä.
        //    WebElement eiHakemuksia = findElementByXPath("//p[%s]", containsText("Ei hakemuksia, koska hakemuskautta ei ole vielä avattu."));
        //    assertThat(eiHakemuksia, is(notNullValue()));

        // Assertoi tila keskeneräinen ja avaa hakemus
        // TODO Assertoi hakijana myös hakemuksen tila ja bread crumbs.
        WorkAround.click(OmatHakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.KESKENERAINEN));

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        WorkAround.click(Hakemus.tallennaHakemus());

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        WorkAround.click(Hakemus.palaaOmiinHakemuksiin());
        WorkAround.click(OmatHakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.KESKENERAINEN));

        // Lähetä hakemus
        tarkistaLiitteetjaLahetaHakemus();

        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        OmatHakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA);

        // Palauta hakemus täydennettäväksi
        WorkAround.click(button("Palauta täydennettäväksi"));
        // TODO Lisää selite täydennyspyynnölle
        WorkAround.click(okOlenVarma());

        //Assertoi käsittelijänä tila Täydennettävänä
        spanWithHakemustila(Hakemustila.TAYDENNETTAVANA);
        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila täydennettävänä
        // Avaa hakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.TAYDENNETTAVANA));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.TAYDENNETTAVANA);

        // Lisätään avustussummat
        syotaRahasummat(Hakemus.rahakentat(), "1000,00", "3000,00");

        // Täydennä hakemus
        tarkistaLiitteetjaLahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithHakemustila(Hakemustila.TAYDENNETTY);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta hakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(
                Hakemuslaji.AVUSTUS, Hakemustila.TAYDENNETTY));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(
                Hakemuslaji.AVUSTUS, Hakemustila.TAYDENNETTY));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.TAYDENNETTY);

        WorkAround.click(button("Merkitse tarkastetuksi"));
        WorkAround.click(okOlenVarma());

        // Assertoi käsittelijänä tila Tarkastettu
        spanWithHakemustila(Hakemustila.TARKASTETTU);

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi hakijana tila tarkastettu
        OmatHakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, Hakemustila.TARKASTETTU);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Päätä hakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));

        // Myönnetään 12 400 €
        WebElement hslMyonnettavaAvustus = Suunnittelu.hslMyonnettavaAvustus();
        hslMyonnettavaAvustus.clear();
        hslMyonnettavaAvustus.sendKeys("12400,00");

        WorkAround.click(Suunnittelu.paatoksentekoon());
        spanWithHakemustila(Hakemustila.TARKASTETTU);
        findElementByXPath("//textarea[1]").sendKeys("Päätöstekstiä");
        WorkAround.click(button("Tallenna tiedot"));
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään päättäjä
        login(User.PAIVI);
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));
        WorkAround.click(Suunnittelu.paatoksentekoon());
        WorkAround.click(button("Tallenna ja hyväksy päätös"));
        WorkAround.click(okOlenVarma());
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila päätetty
        WorkAround.click(spanWithHakemustila(Hakemustila.PAATETTY));

        // Tarkista päätös pdf
        String paatosHref = findElementByLinkText("Avaa päätös (PDF)").getAttribute("href");
        String actual = httpGetPdfText(paatosHref, User.HARRI);

        String expectedText = " suurten kaupunkiseutujen joukkoliikenteen \n"
                + "valtionavustusta 12 400 euroa.";
        assertThat(String.format("Päätös PDF sisältää tekstin %s", expectedText),
                containsNormalized(actual, expectedText));
        String expectedText2 = "Liikennevirasto on hakemuksen perusteella päättänyt myöntää hakijalle \n"
                + "toimivaltaisena viranomaisena valtionavustusta enintään 12 400 euroa";
        assertThat(String.format("Päätös PDF sisältää tekstin %s.", expectedText2),
                containsNormalized(actual, expectedText2));

        /*****************************************************
         * 1. maksatushakemus
         */

        testMaksatushakemus(Hakemuslaji.MAKSATUS1);

        /*****************************************************
         * 2. maksatushakemus
         */

        testMaksatushakemus(Hakemuslaji.MAKSATUS2);

    }


    private void testMaksatushakemus(Hakemuslaji hakemuslaji) throws IOException {
        login(User.HARRI);
        // Avaa maksatushakemus
        WorkAround.click(OmatHakemukset.hakemuksenTila(hakemuslaji, Hakemustila.KESKENERAINEN));

        // Lisää pankkitilinumero
        syotaTilinumero("FI4250001510000023");
        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();
        // Lähetä maksatushakemus
        tarkistaLiitteetjaLahetaHakemus();
        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        spanWithHakemustila(Hakemustila.VIREILLA);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota maksatushakemus käsittelyyn
        WorkAround.click(Hakemuskaudet.tilaindikaattori(hakemuslaji, Hakemustila.VIREILLA));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(
                hakemuslaji, Hakemustila.VIREILLA));

        Hakemus.tarkistaHakemuksenTila(hakemuslaji, Hakemustila.VIREILLA);

        // Palauta maksatushakemus täydennettäväksi
        WorkAround.click(button("Palauta täydennettäväksi"));
        findElementByCssSelector("#taydennysselite").sendKeys("Ole hyvä ja täydennä.");
        WorkAround.click(okOlenVarma());
        waitForAngularRequestsToFinish(driver);

        Hakemus.tarkistaHakemuksenTila(hakemuslaji, Hakemustila.TAYDENNETTAVANA);

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila täydennettävänä
        Hakemus.tarkistaHakemuksenTila(hakemuslaji, Hakemustila.TAYDENNETTAVANA);

        // Avaa maksatushakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.TAYDENNETTAVANA));

        // Assertoi täydennyspyynnön selite
        findElementsByXPath("//div[ %s and .//span[ %s ]]",
                hasClass("alert-warning"),
                containsText("Ole hyvä ja täydennä."));

        // Täydennä maksatushakemus
        syotaRahasummat(Hakemus.rahakentat(), "400,00", "1000,00");

        // Täydennä seurantatiedot
        syotaSeurantatiedot();

        // Lähetetä hakemus
        tarkistaLiitteetjaLahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithHakemustila(Hakemustila.TAYDENNETTY);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta maksatushakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(hakemuslaji, Hakemustila.TAYDENNETTY));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(hakemuslaji, Hakemustila.TAYDENNETTY));

        Hakemus.tarkistaHakemuksenTila(hakemuslaji, Hakemustila.TAYDENNETTY);

        WorkAround.click(button("Merkitse tarkastetuksi"));
        WorkAround.click(okOlenVarma());

        // Assertoi käsittelijänä tila Tarkastettu
        KaikkiHakemukset.ensimmainenTilaindikaattori(hakemuslaji, Hakemustila.TARKASTETTU);

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi hakijana tila tarkastettu
        OmatHakemukset.hakemuksenTila(hakemuslaji, Hakemustila.TARKASTETTU);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Päätä maksatushakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(hakemuslaji, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));

        // Myönnetään 4960 €
        WebElement hslMyonnettavaAvustus = Suunnittelu.hslMyonnettavaAvustus();
        hslMyonnettavaAvustus.clear();
        hslMyonnettavaAvustus.sendKeys("4960,00");

        WorkAround.click(Suunnittelu.paatoksentekoon());
        spanWithHakemustila(Hakemustila.TARKASTETTU);
        findElementByXPath("//textarea[1]").sendKeys("maksatuksen päätöstekstiä");
        WorkAround.click(button("Tallenna tiedot"));
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään päättäjä
        login(User.PAIVI);
        WorkAround.click(Hakemuskaudet.tilaindikaattori(hakemuslaji, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));
        WorkAround.click(Suunnittelu.paatoksentekoon());
        WorkAround.click(button("Tallenna ja hyväksy päätös"));
        WorkAround.click(okOlenVarma());
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään hakija
        login(User.HARRI);

        // Assertoi tila päätetty
        OmatHakemukset.hakemuksenTila(hakemuslaji, Hakemustila.PAATETTY);
    }

    @Test
    public void hakijaSyottaaHakemukseenAlvillisetRahasummat() throws IOException, URISyntaxException {
        login(User.HARRI);

        //Avaa hakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.KESKENERAINEN));

        //Laita Alv-syotto paalle
        WorkAround.click(checkbox("Haluan syöttää summat arvonlisäverollisina."));

        //Syota jokaiseen kenttaan rahasumma. Rahasumma tulee syottaa pilkun kanssa kokonaisuudessaan,
        //jotta input kentassa oleva currency komponentti pystyy ottamaan arvon kasittelyyn ja arvovalidoinit toimivat
        List<WebElement> rahakentat = Hakemus.rahakentat();

        //Tarkistetaan, että tyhjästä kentästä tulee virheilmoitus
        rahakentat.get(0).clear();
        WorkAround.click(rahakentat.get(1));
        tarkistaInputKentanTila("ng-invalid-sallittu-arvo-haettavaavustus");

        // Tarkistetaan, että tulee virheilmoitus kun omarahoitusosuus on alle 50%
        rahakentat.get(0).clear();
        rahakentat.get(0).sendKeys("1000,00");
        rahakentat.get(1).clear();
        rahakentat.get(1).sendKeys("999,99");
        tarkistaInputKentanTila("ng-invalid-omarahoitus-riittava");

        syotaRahasummat(rahakentat, "1000,00", "3000,00");

        tarkistaHakemuksenSummakentat();
        WorkAround.click(checkbox("Haluan syöttää summat arvonlisäverollisina."));
        tarkistaHakemuksenSummakentat();

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        WorkAround.click(Hakemus.tallennaHakemus());

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        WorkAround.click(Hakemus.palaaOmiinHakemuksiin());
        WorkAround.click(spanWithHakemustila(Hakemustila.KESKENERAINEN));

        // Lähetä hakemus
        tarkistaLiitteetjaLahetaHakemus();

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA));
        WorkAround.click(juku.kasittelija.KaikkiHakemukset.ensimmainenTilaindikaattori(Hakemuslaji.AVUSTUS, Hakemustila.VIREILLA));

        //Tarkista summat
        tarkistaHakemuksenSummakentat();
        WorkAround.click(checkbox("Haluan katsoa arvoja arvonlisäverollisina."));
        tarkistaHakemuksenSummakentat();
    }

    private void syotaRahasummat(List<WebElement> rahakentat, String avustus, String oma) {
        for (int i = 0; i < rahakentat.size(); i += 2) {
            rahakentat.get(i).clear();
            rahakentat.get(i).sendKeys(avustus);
            rahakentat.get(i + 1).clear();
            rahakentat.get(i + 1).sendKeys(oma);
        }
    }

    private void uusiLiikennesuorite(String prefix, int suoritetyyppi, String nimi,
                                     String linjaautot, String taksit, String ajokilometrit,
                                     String matkustajamaara, String lipputulo, String nettohinta) {
        WorkAround.hideMainMenu();
        // Luodaan rivi ja poistetaan se samantien
        WorkAround.click(findElementByXPath(String.format("//button[@id='%s-lisaasuorite']", prefix)));
        WorkAround.click(findElementByXPath(String.format("//a[@id='%s-poistasuorite']", prefix)));
        WorkAround.click(findElementByXPath(String.format("//button[@id='%s-lisaasuorite']", prefix)));
        WorkAround.click(findElementByXPath(String.format("//select[@id='%s-suoritetyyppi']/option[%d]", prefix, suoritetyyppi)));
        findElementByXPath(String.format("//input[@id='%s-nimi']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-nimi']", prefix)).sendKeys(nimi);
        findElementByXPath(String.format("//input[@id='%s-linjaautot']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-linjaautot']", prefix)).sendKeys(linjaautot);
        findElementByXPath(String.format("//input[@id='%s-taksit']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-taksit']", prefix)).sendKeys(taksit);
        findElementByXPath(String.format("//input[@id='%s-ajokilometrit']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-ajokilometrit']", prefix)).sendKeys(ajokilometrit);
        findElementByXPath(String.format("//input[@id='%s-matkustajamaara']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-matkustajamaara']", prefix)).sendKeys(matkustajamaara);
        findElementByXPath(String.format("//input[@id='%s-lipputulo']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-lipputulo']", prefix)).sendKeys(lipputulo);
        findElementByXPath(String.format("//input[@id='%s-nettohinta']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-nettohinta']", prefix)).sendKeys(nettohinta);
        WorkAround.showMainMenu();
    }

    private void uusiLippusuorite(String prefix, int lipputyyppi, String seutulippualue, String myynti,
                                  String matkat, String asiakashinta, String keskipituus,
                                  String lipputulot, String rahoitus) {
        WorkAround.hideMainMenu();
        WorkAround.click(findElementByXPath(String.format("//button[@id='%s-lisaasuorite']", prefix)));
        WorkAround.click(findElementByXPath(String.format("//a[@id='%s-poistasuorite']", prefix)));
        WorkAround.click(findElementByXPath(String.format("//button[@id='%s-lisaasuorite']", prefix)));
        if (prefix.equals("kaupunki")) {
            WorkAround.click(findElementByXPath(String.format("//select[@id='%s-lipputyyppi']/option[%d]", prefix, lipputyyppi)));
        }
        if (prefix.equals("seutu")) {
            findElementByXPath(String.format("//input[@id='%s-seutulippualue']", prefix)).clear();
            findElementByXPath(String.format("//input[@id='%s-seutulippualue']", prefix)).sendKeys(seutulippualue);
        }
        findElementByXPath(String.format("//input[@id='%s-myynti']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-myynti']", prefix)).sendKeys(myynti);
        findElementByXPath(String.format("//input[@id='%s-matkat']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-matkat']", prefix)).sendKeys(matkat);
        findElementByXPath(String.format("//input[@id='%s-asiakashinta']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-asiakashinta']", prefix)).sendKeys(asiakashinta);
        findElementByXPath(String.format("//input[@id='%s-keskipituus']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-keskipituus']", prefix)).sendKeys(keskipituus);
        findElementByXPath(String.format("//input[@id='%s-lipputulot']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-lipputulot']", prefix)).sendKeys(lipputulot);
        findElementByXPath(String.format("//input[@id='%s-rahoitus']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-rahoitus']", prefix)).sendKeys(rahoitus);
        WorkAround.showMainMenu();
    }

    private void elyPerustiedot(String kaupunkilipputuki,
                                String seutulipputuki,
                                String ostot,
                                String kehittaminen) {
        setInputValue("kaupunkilipputuki", kaupunkilipputuki);
        setInputValue("seutulipputuki", seutulipputuki);
        setInputValue("ostot", ostot);
        setInputValue("kehittaminen", kehittaminen);
    }

    private void setInputValue(String id, String value) {
        final String xpath = "//input[@id='" + id + "']";
        findElementByXPath(xpath).clear();
        findElementByXPath(xpath).sendKeys(value);
    }

    private void uusiKehittamishanke(String nimi, String arvo, String kuvaus, int index) {
        WorkAround.hideMainMenu();
        // Luodaan rivi ja poistetaan se samantien
        WorkAround.click(findElementByXPath("//button[@id='lisaakehittamishanke']"));
        WorkAround.click(findElementByXPath(String.format("//a[@id='poistakehittamishanke-%d']", index)));
        WorkAround.click(findElementByXPath("//button[@id='lisaakehittamishanke']"));
        findElementByXPath(String.format("//input[@id='nimi-%d']", index)).clear();
        findElementByXPath(String.format("//input[@id='nimi-%d']", index)).sendKeys(nimi);
        findElementByXPath(String.format("//input[@id='arvo-%d']", index)).clear();
        findElementByXPath(String.format("//input[@id='arvo-%d']", index)).sendKeys(arvo);
        findElementByXPath(String.format("//input[@id='kuvaus-%d']", index)).clear();
        findElementByXPath(String.format("//input[@id='kuvaus-%d']", index)).sendKeys(kuvaus);
        WorkAround.showMainMenu();
    }

    private void uusiMaararahatarve(String prefix, String sidotut, String uudet, String tulot, String kuvaus) {
        WorkAround.hideMainMenu();
        findElementByXPath(String.format("//input[@id='%s-sidotut']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-sidotut']", prefix)).sendKeys(sidotut);
        findElementByXPath(String.format("//input[@id='%s-uudet']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-uudet']", prefix)).sendKeys(uudet);
        if (tulot != null) {
            findElementByXPath(String.format("//input[@id='%s-tulot']", prefix)).clear();
            findElementByXPath(String.format("//input[@id='%s-tulot']", prefix)).sendKeys(tulot);
        }
        findElementByXPath(String.format("//input[@id='%s-kuvaus']", prefix)).clear();
        findElementByXPath(String.format("//input[@id='%s-kuvaus']", prefix)).sendKeys(kuvaus);
        WorkAround.showMainMenu();
    }


    private void syotaSeurantatiedot() {

        /*
         * This is a working for accordion open problem in firefox browsers.
         */
        WebElement heading = findElementByXPath("//h3[text()='SEURANTATIEDOT']");
        WorkAround.click(heading);

        // Avaa accordionit
        List<WebElement> seurantaAccordionList = findElementsByXPath("//a[@class='accordion-toggle']");
        for (WebElement seurantaAccordion : seurantaAccordionList) {
            WorkAround.sleep(WorkAround.Delay.MEDIUM);
            WorkAround.click(seurantaAccordion);
        }

        // PSA-rivi
        uusiLiikennesuorite("PSA", 2, "SuoritePSA", "23", "11", "1234,23", "121", "342,45", "102,30");

        // Palveluliikenne
        uusiLiikennesuorite("PAL", 3, "SuoritePAL", "33", "21", "4100,20", "210", "400,50", "134,10");

        // Kaupunkiliput
        uusiLippusuorite("kaupunki", 4, "", "111", "222", "123,45", "12,53", "5311,35", "2500,50");

        // Seutulippu
        uusiLippusuorite("seutu", 0, "Alue1", "111", "222", "123,45", "12,53", "5311,35", "2500,50");
    }

    private void syotaTilinumero(String tilinumero) {
        findElementByXPath("//input[@id='pankkitilinumero']").clear();
        findElementByXPath("//input[@id='pankkitilinumero']").sendKeys(tilinumero);
    }

    private WebElement checkbox(String text) {
        WebElement checkboxi = findElementByXPath("//span[%s and %s]",
                containsText(text),
                isVisible());
        if (isChrome()) {
            driver.executeScript("arguments[0].scrollIntoViewIfNeeded()", checkboxi);
        }
        return checkboxi;
    }

    private boolean isChrome() {
        return System.getProperty("chrome") != null;
    }

    private void tarkistaHakemuksenSummakentat() {
        //Tarkistetaan hakemuksen valisumma kentat
        assertThat(findElementByXPath("//div[@id='test-PSA']").getText(), is(equalTo("Haettava valtionavustus: 2 727,27 €")));
        assertThat(findElementByXPath("//div[@id='test-HK']").getText(), is(equalTo("Haettava valtionavustus: 4 000,00 €")));
        assertThat(findElementByXPath("//div[@id='test-K']").getText(), is(equalTo("Haettava valtionavustus: 4 032,25 €")));

        // Tarkistetaan hakemuksen yhteensa kentta
        List<WebElement> h4s = findElementsByXPath("//h4[@class='ng-binding']");
        assertThat(h4s.get(1).getText(), is(equalTo("10 759,52 €")));
    }

    private void tarkistaInputKentanTila(String luokka) {
        waitForAngularRequestsToFinish(driver);
        List<WebElement> inputkentat = findElementsByXPath(String.format("//input[%s]",
                hasClass(luokka)));

        assertThat(String.format("Hakijan hakemussivulla input kentän luokka (%s) pitäisi näkyä kerran.", luokka),
                inputkentat,
                hasSize(equalTo(1)));
    }

    private void tarkistaLiitteetjaLahetaHakemus() {
        WorkAround.click(checkbox("Olen liittänyt hakemukseen tarvittavat"));
        waitForAngularRequestsToFinish(driver);
        lahetaHakemus();
    }

    private void lahetaHakemus() {
        WorkAround.click(button("Tallenna ja lähetä hakemus"));
        waitForAngularRequestsToFinish(driver);

        WorkAround.click(okOlenVarma());
        waitForAngularRequestsToFinish(driver);
    }

    private void lisaaAllekirjoitusLiite() throws IOException {
        waitForAngularRequestsToFinish(driver);

        WebElement fileInput = Hakemus.uniqueFileInput();

        // Tuodaan ng-file-uploadin piilottama file-input näkyviin, jotta siihen voidaan
        // Syöttää liitteen tiedostonimi
        driver.executeScript("angular.element(arguments[0])"
                + ".css('visibility', 'visible')"
                + ".css('z-index', '1000001')"
                + ".css('width','100px')"
                + ".css('height','30px');", fileInput);
        driver.executeScript("angular.element(arguments[0]).parent().removeAttr('style');", fileInput);

        String allekirjoitusliite = getPathToTestFile("JUKU_allekirjoitusoikeus.doc").toFile().getAbsolutePath();

        WorkAround.scrollIntoView(fileInput);

        WorkAround.sleep(WorkAround.Delay.SHORT);
        // Tiedostonimen syöttäminen file-inputtiin laukaisee
        // upload toiminnon automaattisesti
        fileInput.sendKeys(allekirjoitusliite);

        // Odotetaan, että liite tallentuu
        waitForAngularRequestsToFinish(driver);
    }

    private void lahetaDummyElyHakemus(User user) throws IOException, URISyntaxException {

        /************************************************************
         * Elyhakemus
         */

        login(user);

        WorkAround.click(OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.KESKENERAINEN));

        // Täytetään kenttiin arvot

        // Perustiedot
        elyPerustiedot("10000", "20000", "10000", "20000");

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        WorkAround.click(Hakemus.tallennaHakemus());


        // Lähetä hakemus
        lahetaHakemus();

        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.VIREILLA);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.ELY, Hakemustila.VIREILLA));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(Hakemuslaji.ELY, Hakemustila.VIREILLA));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.ELY, Hakemustila.VIREILLA);

        WorkAround.click(button("Merkitse tarkastetuksi"));
        WorkAround.click(okOlenVarma());

        // Assertoi käsittelijänä tila Tarkastettu
        spanWithHakemustila(Hakemustila.TARKASTETTU);
    }

    @Test
    public void hakijaVoiEsikatsellaAvustushakemustaLIVIJUKU_128() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.KESKENERAINEN));

        List<WebElement> rahakentat = findElementsByXPath("//input[@type='text' and %s]", isVisible());

        syotaRahasummat(rahakentat, "1000,00", "3000,00");

        WorkAround.click(Hakemus.tallennaHakemus());

        String hakemusid = getScopeVariableValue(button("Tallenna tiedot"), "hakemusid");
        String pdfUrl = String.format("%s/pdf/web/viewer.html?file=../../api/hakemus/%s/pdf/juku-hakemus.pdf", baseUrl(), hakemusid);

        String actual = httpGetPdfText(pdfUrl, User.HARRI);

        String expected = "Hakija: Helsingin seudun liikenne\n" +
                "Hakija hakee vuonna 2018 suurten kaupunkiseutujen joukkoliikenteen \n" +
                "valtionavustusta 12 400 euroa. Haettu avustus jakautuu seuraavasti:\n" +
                "PSA:n mukaisen liikenteen hankinta (alv 0%)\n" +
                "Paikallisliikenne 1 000 e\n" +
                "Integroitupalvelulinja 1 000 e\n" +
                "Muu PSA:n mukaisen liikenteen järjestäminen 1 000 e\n" +
                "Hintavelvoitteiden korvaaminen (alv 10%)\n" +
                "Seutulippu 1 100 e\n" +
                "Kaupunkilippu tai kuntalippu 1 100 e\n" +
                "Liityntälippu 1 100 e\n" +
                "Työmatkalippu 1 100 e\n" +
                "Liikenteen suunnittelu ja kehittämishankkeet (alv 0%)\n" +
                "Informaatio ja maksujärjestelmien kehittäminen 1 000 e\n" +
                "Matkapalvelukeskuksen suunnittelu ja kehittäminen 1 000 e\n" +
                "Matkakeskuksen suunnittelu ja kehittäminen 1 000 e\n" +
                "Raitiotien suunnittelu 1 000 e\n" +
                "Muu hanke 1 000 e\n" +
                "Hakija osoittaa omaa rahoitusta näihin kohteisiin yhteensä 37 200 euroa.\n" +
                "Lähettäjä: <hakijan nimi, joka on lähettänyt hakemuksen>\n" +
                "Liitteet\n" +
                "Liikennevirasto - esikatselu - hakemus on keskeneräinen\n" +
                "1 (1)\n";

        assertThat("Hakemuksen esikatselussa pitää näkyä rahasummat.", containsNormalized(actual, expected));

    }

    @Test
    public void liitteidenLisaaminenHakemukselleLIVIJUKU_325() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.KESKENERAINEN));

        postHakuohje(getPathToTestFile("test.pdf").toFile(),"//input[@type='file']");


        // TODO Assertoi liitteen tiedot sivulta.
    }

    @Test
    public void elyhakemus() throws IOException, URISyntaxException {

        /************************************************************
         * Elyhakemus
         */

        login(User.ELY10);

        // Varmista, että kausi on avoinna TODO: Korjaa tämä.
        //    WebElement eiHakemuksia = findElementByXPath("//p[%s]", containsText("Ei hakemuksia, koska hakemuskautta ei ole vielä avattu."));
        //    assertThat(eiHakemuksia, is(notNullValue()));

        // Assertoi tila keskeneräinen ja avaa hakemus
        // TODO Assertoi hakijana myös hakemuksen tila ja bread crumbs.
        WorkAround.click(OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.KESKENERAINEN));

        // Perustiedot
        elyPerustiedot("15000", "20000", "15000", "20000");

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        WorkAround.click(Hakemus.tallennaHakemus());

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        WorkAround.click(Hakemus.palaaOmiinHakemuksiin());
        WorkAround.click(OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.KESKENERAINEN));

        // Täytetään kenttiin arvot

        // Perustiedot
        elyPerustiedot("15000", "20000", "15000", "20000");

        // Määrärahatarve
        uusiMaararahatarve("BS", "1000", "2000", "3000", "Bruttosopimus kuvaus");
        uusiMaararahatarve("KK1", "4000", "5000", null, "Käyttösopimuskorvaukset (alueellinen) kuvaus");
        uusiMaararahatarve("KK2", "3000", "2000", null, "Käyttösopimuskorvaukset (reitti) kuvaus");

        // Tarkistetaan hakemuksen menot yhteensä kenttä
        WebElement menotYhteensa = findElementByXPath("//span[@id='menotyhteensa']");
        assertThat(menotYhteensa.getText(), is(equalTo("84 000,00 €")));

        // Kehittämishankkeet
        uusiKehittamishanke("Kehittämishanke1", "123433", "Kehittämishanke 1 kuvaus", 0);
        uusiKehittamishanke("Kehittämishanke2", "111222", "Kehittämishanke 2 kuvaus", 1);

        // Tarkistetaan hakemuksen kehittämishankkeet yhteensä kenttä
        WebElement kehittamishankkeetYhteensa = findElementByXPath("//span[@id='kehittamishankkeetyhteensa']");
        assertThat(kehittamishankkeetYhteensa.getText(), is(equalTo("234 655,00 €")));

        // Tarkistetaan hakemuksen kokonaissumma-kenttä
        WebElement elyhakemusYhteensa = findElementByXPath("//h4[@id='sumHaettavaElyAvustus']");
        assertThat(elyhakemusYhteensa.getText(), is(equalTo("318 655,00 € (sis. alv)")));

        // Tallenna hakemus
        WorkAround.click(Hakemus.tallennaHakemus());

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        WorkAround.click(Hakemus.palaaOmiinHakemuksiin());
        WorkAround.click(spanWithHakemustila(Hakemustila.KESKENERAINEN));

        // Lähetä hakemus
        lahetaHakemus();

        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.VIREILLA);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.ELY, Hakemustila.VIREILLA));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(Hakemuslaji.ELY, Hakemustila.VIREILLA));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.ELY, Hakemustila.VIREILLA);

        // Palauta hakemus täydennettäväksi
        WorkAround.click(button("Palauta täydennettäväksi"));
        // TODO Lisää selite täydennyspyynnölle
        WorkAround.click(okOlenVarma());

        //Assertoi käsittelijänä tila Täydennettävänä
        spanWithHakemustila(Hakemustila.TAYDENNETTAVANA);
        // Kirjaa sisään hakija
        login(User.ELY10);
        // Assertoi tila täydennettävänä
        // Avaa hakemus
        WorkAround.click(spanWithHakemustila(Hakemustila.TAYDENNETTAVANA));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.ELY, Hakemustila.TAYDENNETTAVANA);

        // Täydennä hakemus
        lahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithHakemustila(Hakemustila.TAYDENNETTY);

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta hakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(
                Hakemuslaji.ELY, Hakemustila.TAYDENNETTY));
        WorkAround.click(KaikkiHakemukset.ensimmainenTilaindikaattori(
                Hakemuslaji.ELY, Hakemustila.TAYDENNETTY));

        Hakemus.tarkistaHakemuksenTila(Hakemuslaji.ELY, Hakemustila.TAYDENNETTY);

        WorkAround.click(button("Merkitse tarkastetuksi"));
        WorkAround.click(okOlenVarma());

        // Assertoi käsittelijänä tila Tarkastettu
        spanWithHakemustila(Hakemustila.TARKASTETTU);

        // Lähetä muiden ELY-organisaatioiden (dummy)hakemukset
        User[] userData = {User.ELY1, User.ELY2, User.ELY3, User.ELY4, User.ELY8, User.ELY9, User.ELY12, User.ELY14};
        for (User u : userData) {
            lahetaDummyElyHakemus(u);
        }


        // Kirjaa sisään hakija
        login(User.ELY10);
        // Assertoi hakijana tila tarkastettu
        OmatHakemukset.hakemuksenTila(Hakemuslaji.ELY, Hakemustila.TARKASTETTU);


        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Päätä hakemus
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.ELY, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));

        // Asetetaan määrärahat
        findElementByXPath("//input[@id='maararaha']").clear();
        findElementByXPath("//input[@id='maararaha']").sendKeys("1000000");
        findElementByXPath("//input[@id='ylijaama']").clear();
        findElementByXPath("//input[@id='ylijaama']").sendKeys("333000");

        // Myönnetään 200000 €
        WebElement epoMyonnettavaAvustus = Suunnittelu.hslMyonnettavaAvustus();
        epoMyonnettavaAvustus.clear();
        epoMyonnettavaAvustus.sendKeys("200000,00");

        findElementByXPath("//textarea[@id='paatosteksti']").sendKeys("Päätöstekstiä");
        WorkAround.click(button("Tallenna päätösten tiedot"));
        waitForAngularRequestsToFinish(driver);

        // Tarkistetaan summat
        WebElement avustuksetYhteensa = findElementByXPath("//td[@id='haettuavustussumma']");
        assertThat(avustuksetYhteensa.getText(), is(equalTo("798 655,00 €")));
        WebElement muutosYhteensa = findElementByXPath("//td[@id='haettumuutossumma']");
        assertThat(muutosYhteensa.getText(), is(equalTo("-598 655,00 €")));

        // Kirjaa sisään päättäjä
        login(User.PAIVI);
        WorkAround.click(Hakemuskaudet.tilaindikaattori(Hakemuslaji.ELY, Hakemustila.TARKASTETTU));
        WorkAround.click(KaikkiHakemukset.suunnitteluJaPaatoksenteko(0));
        WorkAround.click(button("Tallenna ja hyväksy päätökset"));
        WorkAround.click(okOlenVarma());
        waitForAngularRequestsToFinish(driver);


        // Kirjaa sisään hakija
        login(User.ELY10);

        // Assertoi tila päätetty
        WorkAround.click(spanWithHakemustila(Hakemustila.PAATETTY));

        // Tarkista päätös pdf
        String paatosHref = findElementByLinkText("Avaa päätös (PDF)").getAttribute("href");
        String actual = httpGetPdfText(paatosHref, User.ELY10);

        String expectedText = " alueellisen joukkoliikenteen kehittämiseen 1 000 000 euron";
        assertThat(String.format("Päätös PDF sisältää tekstin %s", expectedText),
                containsNormalized(actual, expectedText));
        String expectedText2 = "liikenne- ja ympäristökeskuksille yhteensä 200 000 euroa valtion";
        assertThat(String.format("Päätös PDF sisältää tekstin %s.", expectedText2),
                containsNormalized(actual, expectedText2));
        String expectedText3 = "Etelä-Pohjanmaa ELY 200000 e";
        assertThat(String.format("Päätös PDF sisältää tekstin %s.", expectedText3),
                containsNormalized(actual, expectedText3));
    }


    private boolean containsNormalized(String actual, String expected) {
        String a = actual.replaceAll("\\s+", " ");
        String b = expected.replaceAll("\\s+", " ");
        return a.contains(b);
    }

}
