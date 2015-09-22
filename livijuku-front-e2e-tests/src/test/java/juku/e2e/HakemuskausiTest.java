package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static juku.e2e.WorkAround.click;
import static juku.e2e.WorkAround.scrollIntoView;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class HakemuskausiTest extends TestBase {

    @Test
    public void hakijaaInformoidaanHakemuksenTilasta() throws IOException, URISyntaxException {
        login(User.HARRI);

        // Varmista, että kausi on avoinna TODO: Korjaa tämä.
        //    WebElement eiHakemuksia = findElementByXPath("//p[%s]", containsText("Ei hakemuksia, koska hakemuskautta ei ole vielä avattu."));
        //    assertThat(eiHakemuksia, is(notNullValue()));

        // Assertoi tila keskeneräinen ja avaa hakemus
        // TODO Assertoi hakijana myös hakemuksen tila ja bread crumbs.
        hakija.Hakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, "Keskeneräinen", "hakemus-tila-keskenerainen").click();

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        yhteinen.Hakemus.tallennaHakemus().click();

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        click(yhteinen.Hakemus.palaaOmiinHakemuksiin());
        hakija.Hakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, "Keskeneräinen", "hakemus-tila-keskenerainen").click();

        // Lähetä hakemus
        lahetaHakemus();

        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        hakija.Hakemukset.hakemuksenTila(Hakemuslaji.AVUSTUS, "Vireillä", "hakemus-tila-vireilla");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        kasittelija.Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, "Vireillä", "hakemus-tila-vireilla").click();
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.AVUSTUS, "Vireillä", "hakemus-tila-vireilla").click();

        tarkistaHakemuksenTila("Vireillä", "hakemus-tila-vireilla");

        // Palauta hakemus täydennettäväksi
        button("Palauta täydennettäväksi").click();
        // TODO Lisää selite täydennyspyynnölle
        okOlenVarma().click();

        //Assertoi käsittelijänä tila Täydennettävänä
        spanWithTextAndClass("Täydennettävänä", "hakemus-tila-taydennettavana");
        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila täydennettävänä
        // Avaa hakemus
        spanWithTextAndClass("Täydennettävänä", "hakemus-tila-taydennettavana").click();

        tarkistaHakemuksenTila("Täydennettävänä", "hakemus-tila-taydennettavana");

        // Lisätään avustussummat
        syotaRahasummat(yhteinen.Hakemus.rahakentat());

        // Täydennä hakemus
        lahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithTextAndClass("Täydennetty", "hakemus-tila-taydennetty");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta hakemus
        kasittelija.Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, "Täydennetty", "hakemus-tila-taydennetty").click();
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.AVUSTUS, "Täydennetty", "hakemus-tila-taydennetty").click();

        tarkistaHakemuksenTila("Täydennetty", "hakemus-tila-taydennetty");

        button("Merkitse tarkastetuksi").click();
        okOlenVarma().click();

        // Assertoi käsittelijänä tila Tarkastettu
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu");

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi hakijana tila tarkastettu
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Päätä hakemus
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu").click();
        yhteinen.Hakemus.suunnitteluJaPaatoksenteko().click();
        kasittelija.Suunnittelu.paatoksentekoon().click();
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu");
        findElementByXPath("//textarea[1]").sendKeys("Päätöstekstiä");
        button("Tallenna tiedot").click();
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään päättäjä
        login(User.PAIVI);
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu").click();
        yhteinen.Hakemus.suunnitteluJaPaatoksenteko().click();
        kasittelija.Suunnittelu.paatoksentekoon().click();
        button("Tallenna ja hyväksy päätös").click();
        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver);

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila päätetty
        spanWithTextAndClass("Päätetty", "hakemus-tila-paatetty").click();

        // Tarkista päätös pdf
        String paatosHref = findElementByLinkText("Avaa päätös (PDF)").getAttribute("href");
        String actual = httpGetPdfText(paatosHref, User.HARRI);

        String expectedText = " suurten kaupunkiseutujen joukkoliikenteen \n"
                + "valtionavustusta 13 900 euroa.";
        assertThat(String.format("Päätös PDF sisältää tekstin %s", expectedText),
                containsNormalized(actual, expectedText));

        // Avaa maksatushakemus 1
        findElementByLinkText("1. maksatushakemus").click();
        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();
        // Lähetä maksatushakemus 1
        lahetaHakemus();
        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        spanWithTextAndClass("Vireillä", "hakemus-tila-vireilla");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota maksatushakemus 1 käsittelyyn
        kasittelija.Hakemuskaudet.tilaindikaattori(Hakemuslaji.MAKSATUS1, "Vireillä", "hakemus-tila-vireilla").click();
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.MAKSATUS1, "Vireillä", "hakemus-tila-vireilla").click();

        tarkistaHakemuksenTila("Vireillä", "hakemus-tila-vireilla");

        // Palauta maksatushakemus 1 täydennettäväksi
        button("Palauta täydennettäväksi").click();
        findElementByCssSelector("#taydennysselite").sendKeys("Ole hyvä ja täydennä.");
        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver);

        tarkistaHakemuksenTila("Täydennettävänä", "hakemus-tila-taydennettavana");

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila täydennettävänä
        tarkistaHakemuksenTila("Täydennettävänä", "hakemus-tila-taydennettavana");

        // Avaa maksatushakemus 1
        spanWithTextAndClass("Täydennettävänä", "hakemus-tila-taydennettavana").click();

        // Assertoi täydennyspyynnön selite
        findElementsByXPath("//div[ %s and .//span[ %s ]]",
                hasClass("alert-warning"),
                containsText("Ole hyvä ja täydennä."));

        // Täydennä maksatushakemus 1
        // TODO Syötä rahasumma
        lahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithTextAndClass("Täydennetty", "hakemus-tila-taydennetty");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta maksatushakemus 1
        kasittelija.Hakemuskaudet.tilaindikaattori(Hakemuslaji.MAKSATUS1, "Täydennetty", "hakemus-tila-taydennetty").click();
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.MAKSATUS1, "Täydennetty", "hakemus-tila-taydennetty").click();

        tarkistaHakemuksenTila("Täydennetty", "hakemus-tila-taydennetty");

        button("Merkitse tarkastetuksi").click();
        okOlenVarma().click();

        // Assertoi käsittelijänä tila Tarkastettu
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.MAKSATUS1, "Tarkastettu", "hakemus-tila-tarkastettu");

        // Kirjaa sisään hakija
        // Assertoi hakijana tila tarkastettu
        // Kirjaa sisään käsittelijä
        // Päätä maksatushakemus 1
        // Kirjaa sisään päättäjä
        // Kirjaa sisään hakija
        // Assertoi tila päätetty
        // Tarkista päätös pdf

        // Avaa maksatushakemus 2
        // Lisää allekirjoitusliite
        // Tallenna hakemus
        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        // Lähetä maksatushakemus 2
        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        // Kirjaa sisään käsittelijä
        // Ota maksatushakemus 2 käsittelyyn
        // Palauta maksatushakemus 2 täydennettäväksi
        // Kirjaa sisään hakija
        // Assertoi tila täydennettävänä
        // Avaa maksatushakemus 2
        // Täydennä maksatushakemus 2
        // Assetoi hakijana tila Täydennetty.
        // Kirjaa sisään käsittelijä
        // Tarkasta maksatushakemus 2
        // Assertoi käsittelijänä tila Tarkastettu
        // Kirjaa sisään hakija
        // Assertoi hakijana tila tarkastettu
        // Kirjaa sisään käsittelijä
        // Päätä maksatushakemus 2
        // Kirjaa sisään päättäjä
        // Kirjaa sisään hakija
        // Assertoi tila päätetty
        // Tarkista päätös pdf

    }

    @Test
    public void hakijaSyottaaHakemukseenAlvillisetRahasummat() throws IOException, URISyntaxException {
        login(User.HARRI);

        //Avaa hakemus
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        //Laita Alv-syotto paalle
        checkbox("Haluan syöttää summat arvonlisäverollisina.").click();

        //Syota jokaiseen kenttaan rahasumma. Rahasumma tulee syottaa pilkun kanssa kokonaisuudessaan,
        //jotta input kentassa oleva currency komponentti pystyy ottamaan arvon kasittelyyn ja arvovalidoinit toimivat
        List<WebElement> rahakentat = yhteinen.Hakemus.rahakentat();

        //Tarkistetaan, että tyhjästä kentästä tulee virheilmoitus
        rahakentat.get(0).clear();
        rahakentat.get(1).click();
        tarkistaInputKentanTila("ng-invalid-omarahoitus-riittava");

        // Tarkistetaan, että tulee virheilmoitus kun omarahoitusosuus on alle 50%
        rahakentat.get(0).clear();
        rahakentat.get(0).sendKeys("1000,00");
        rahakentat.get(1).clear();
        rahakentat.get(1).sendKeys("999,99");
        tarkistaInputKentanTila("ng-invalid-omarahoitus-riittava");

        syotaRahasummat(rahakentat);

        tarkistaHakemuksenSummakentat();
        checkbox("Haluan syöttää summat arvonlisäverollisina.").click();
        tarkistaHakemuksenSummakentat();

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        yhteinen.Hakemus.tallennaHakemus().click();

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        click(yhteinen.Hakemus.palaaOmiinHakemuksiin());
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        // Lähetä hakemus
        lahetaHakemus();

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        kasittelija.Hakemuskaudet.tilaindikaattori(Hakemuslaji.AVUSTUS, "Vireillä", "hakemus-tila-vireilla").click();
        kasittelijanKaikkiHakemuksetHSL(Hakemuslaji.AVUSTUS, "Vireillä", "hakemus-tila-vireilla").click();

        //Tarkista summat
        tarkistaHakemuksenSummakentat();
        checkbox("Haluan katsoa arvoja arvonlisäverollisina.").click();
        tarkistaHakemuksenSummakentat();
    }

    private void syotaRahasummat(List<WebElement> rahakentat) {
        for (int i = 0; i < rahakentat.size(); i += 2) {
            rahakentat.get(i).clear();
            rahakentat.get(i).sendKeys("1000,00");
            rahakentat.get(i + 1).clear();
            rahakentat.get(i + 1).sendKeys("3000,00");
        }
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
        List<WebElement> alvsummat = findElementsByXPath("//div[@class='col-md-4 ng-binding']");

        assertThat(alvsummat.get(0).getText(), is(equalTo("Haettava valtionavustus: 3 000,00 €")));
        assertThat(alvsummat.get(3).getText(), is(equalTo("Haettava valtionavustus: 4 000,00 €")));
        assertThat(alvsummat.get(6).getText(), is(equalTo("Haettava valtionavustus: 5 000,00 €")));

        // Tarkistetaan hakemuksen yhteensa kentta
        List<WebElement> h4s = findElementsByXPath("//h4[@class='ng-binding']");
        assertThat(h4s.get(4).getText(), is(equalTo("12 000,00 € (sis. alv)")));
    }

    private void tarkistaHakemuksenTila(String teksti, String luokka) {
        List<WebElement> hakemuksenTilaIndikaattorit = findElementsByXPath(String.format("//span[%s and %s and %s]",
                hasClass(luokka),
                containsText(teksti),
                isVisible()));

        assertThat(String.format("Hakemussivulla hakemuksen tila (%s) pitäisi näkyä kerran.", teksti),
                hakemuksenTilaIndikaattorit,
                hasSize(equalTo(1)));
    }

    private void tarkistaInputKentanTila(String luokka) {
        waitForAngularRequestsToFinish(driver);
        List<WebElement> inputkentat = findElementsByXPath(String.format("//input[%s]",
                hasClass(luokka)));

        assertThat(String.format("Hakijan hakemussivulla input kentän luokka (%s) pitäisi näkyä kerran.", luokka),
                inputkentat,
                hasSize(equalTo(1)));
    }

    private WebElement kasittelijanKaikkiHakemuksetHSL(Hakemuslaji hakemuslaji, String tila, String statusClass) {
        // TODO Assertoi, että kyseisen hakemuslajin välilehti on avoinna
        // TODO Tässä oletetaan, että ainoa vireilläoleva hakemus on kyseisen hakijan (HSL).
        return spanWithTextAndClass(tila, statusClass);
    }

    private void lahetaHakemus() {
        checkbox("Olen liittänyt hakemukseen tarvittavat").click();
        waitForAngularRequestsToFinish(driver);
        click(button("Tallenna ja lähetä hakemus"));
        waitForAngularRequestsToFinish(driver);

        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver);
    }

    private void lisaaAllekirjoitusLiite() throws IOException {
        waitForAngularRequestsToFinish(driver);

        WebElement fileInput = yhteinen.Hakemus.uniqueFileInput();

        // Tuodaan ng-file-uploadin piilottama file-input näkyviin, jotta siihen voidaan
        // Syöttää liitteen tiedostonimi
        driver.executeScript("angular.element(arguments[0])"
                + ".css('visibility', 'visible')"
                + ".css('z-index', '1000001')"
                + ".css('width','100px')"
                + ".css('height','30px');", fileInput);

        String allekirjoitusliite = getPathToTestFile("JUKU_allekirjoitusoikeus.doc").toFile().getAbsolutePath();

        scrollIntoView(fileInput);

        // DEBUG screenshot
        TestBase.takeScreenshot("DEBUG");

        WorkAround.sleep(WorkAround.Delay.SHORT);
        // Tiedostonimen syöttäminen file-inputtiin laukaisee
        // upload toiminnon automaattisesti
        fileInput.sendKeys(allekirjoitusliite);

        // Odotetaan, että liite tallentuu
        waitForAngularRequestsToFinish(driver);
    }

    @Test
    public void hakijaVoiEsikatsellaAvustushakemustaLIVIJUKU_128() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        List<WebElement> rahakentat = findElementsByXPath("//input[@type='text' and %s]", isVisible());

        syotaRahasummat(rahakentat);

        yhteinen.Hakemus.tallennaHakemus().click();

        String hakemusid = getScopeVariableValue(button("Tallenna tiedot"), "hakemusid");
        String pdfUrl = String.format("%s/pdf/web/viewer.html?file=../../api/hakemus/%s/pdf", baseUrl(), hakemusid);

        String actual = httpGetPdfText(pdfUrl, User.HARRI);

        String expected = "Hakija: Helsingin seudun liikenne\n" +
                "Hakija hakee vuonna 2016 suurten kaupunkiseutujen joukkoliikenteen \n" +
                "valtionavustusta 13 900 euroa. Haettu avustus jakautuu seuraavasti:\n" +
                "PSA:n mukaisen liikenteen hankinta\n" +
                "Paikallisliikenne 1 100 e\n" +
                "Integroitupalvelulinja 1 100 e\n" +
                "Muu PSA:n mukaisen liikenteen järjestäminen 1 100 e\n" +
                "Hintavelvoitteiden korvaaminen\n" +
                "Seutulippu 1 100 e\n" +
                "Kaupunkilippu tai kuntalippu 1 100 e\n" +
                "Liityntälippu 1 100 e\n" +
                "Työmatkalippu 1 100 e\n" +
                "Liikenteen suunnittelu ja kehittämishankkeet\n" +
                "Informaatio ja maksujärjestelmien kehittäminen 1 240 e\n" +
                "Matkapalvelukeskuksen suunnittelu ja kehittäminen 1 240 e\n" +
                "Matkakeskuksen suunnittelu ja kehittäminen 1 240 e\n" +
                "Raitiotien suunnittelu 1 240 e\n" +
                "Muu hanke 1 240 e\n" +
                "Hakija osoittaa omaa rahoitusta näihin kohteisiin yhteensä 41 700 euroa.\n" +
                "Lähettäjä: <hakijan nimi, joka on lähettänyt hakemuksen>\n" +
                "Liikennevirasto - esikatselu - hakemus on keskeneräinen\n" +
                "1 (1)\n";

        assertThat("Hakemuksen esikatselussa pitää näkyä rahasummat.", containsNormalized(actual, expected));

    }

    @Test
    public void liitteidenLisaaminenHakemukselleLIVIJUKU_325() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        postHakuohje(getPathToTestFile("test.pdf").toFile());

        // TODO Assertoi liitteen tiedot sivulta.
    }

    private boolean containsNormalized(String actual, String expected) {
        String a = actual.replaceAll("\\s+", " ");
        String b = expected.replaceAll("\\s+", " ");
        return a.contains(b);
    }

}
