package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
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
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        tarkistaHakijanHakemuksenTila("Keskeneräinen", "hakemus-tila-keskenerainen");

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        tallennaHakemus();

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        linkInPosition("Palaa omiin hakemuksiin", 1).click();
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        // Lähetä hakemus
        lahetaHakemus();

        // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
        spanWithTextAndClass("Vireillä", "hakemus-tila-vireilla");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        avaaHakemus("Vireillä", "hakemus-tila-vireilla");

        tarkistaHakijanHakemuksenTila("Vireillä", "hakemus-tila-vireilla");

        // Palauta hakemus täydennettäväksi
        button("Palauta täydennettäväksi").click();
        okOlenVarma().click();

        //Assertoi käsittelijänä tila Täydennettävänä
        spanWithTextAndClass("Täydennettävänä", "hakemus-tila-taydennettavana");
        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila täydennettävänä
        // Avaa hakemus
        spanWithTextAndClass("Täydennettävänä", "hakemus-tila-taydennettavana").click();

        tarkistaHakijanHakemuksenTila("Täydennettävänä", "hakemus-tila-taydennettavana");

        // Täydennä hakemus
        lahetaHakemus();

        // Assetoi hakijana tila Täydennetty.
        spanWithTextAndClass("Täydennetty", "hakemus-tila-taydennetty");

        // Kirjaa sisään käsittelijä
        login(User.KATRI);

        // Tarkasta hakemus
        avaaHakemus("Täydennetty", "hakemus-tila-taydennetty");

        tarkistaHakijanHakemuksenTila("Täydennetty", "hakemus-tila-taydennetty");

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
        linkInPosition("Suunnittelu ja päätöksenteko", 1).click();
        linkInPosition("Päätöksentekoon", 1).click();
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu");
        findElementByXPath("//textarea[1]").sendKeys("Päätöstekstiä");
        button("Tallenna").click();
        // Kirjaa sisään päättäjä
        login(User.PAIVI);
        spanWithTextAndClass("Tarkastettu", "hakemus-tila-tarkastettu").click();
        linkInPosition("Suunnittelu ja päätöksenteko", 1).click();
        linkInPosition("Päätöksentekoon", 1).click();
        button("Tallenna ja hyväksy päätös").click();
        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver());

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila päätetty
        spanWithTextAndClass("Päätetty", "hakemus-tila-paatetty").click();

        // Tarkista päätös pdf
        String paatosHref = findElementByLinkText("Avaa päätös (PDF)").getAttribute("href");
        String actual = httpGetPdfText(paatosHref, User.HARRI);

        String expectedText = "Hakija: Helsingin seudun liikenne\n"
                + "Hakija hakee vuonna 2016 suurten kaupunkiseutujen joukkoliikenteen \n"
                + "valtionavustusta 0 euroa.";
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
        // Ota maksatushakemus 1 käsittelyyn
        // Palauta maksatushakemus 1 täydennettäväksi
        // Kirjaa sisään hakija
        // Assertoi tila täydennettävänä
        // Avaa maksatushakemus 1
        // Täydennä maksatushakemus 1
        // Assetoi hakijana tila Täydennetty.
        // Kirjaa sisään käsittelijä
        // Tarkasta maksatushakemus 1
        // Assertoi käsittelijänä tila Tarkastettu
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
        klikkaaCheckboxia("Haluan syöttää summat arvonlisäverollisina.");

        //Syota jokaiseen kenttaan rahasumma. Rahasumma tulee syottaa pilkun kanssa kokonaisuudessaan,
        //jotta input kentassa oleva currency komponentti pystyy ottamaan arvon kasittelyyn ja arvovalidoinit toimivat
        List<WebElement> rahakentat = findElementsByXPath("//input[@type='text' and %s]", isVisible());

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
        klikkaaCheckboxia("Haluan syöttää summat arvonlisäverollisina.");
        tarkistaHakemuksenSummakentat();

        // Lisää allekirjoitusliite
        lisaaAllekirjoitusLiite();

        // Tallenna hakemus
        tallennaHakemus();

        // Käydään hakemuksen päänäkymässä ja takaisin hakemukseen, jotta liitteet päivittyvät
        linkInPosition("Palaa omiin hakemuksiin", 1).click();
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();


        // Lähetä hakemus
        lahetaHakemus();

        // Kirjaa sisään käsittelijä
        login(User.KATRI);
        // Ota hakemus käsittelyyn
        avaaHakemus("Vireillä", "hakemus-tila-vireilla");

        //Tarkista summat
        tarkistaHakemuksenSummakentat();
        klikkaaCheckboxia("Haluan katsoa arvoja arvonlisäverollisina.");
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

    private void klikkaaCheckboxia(String text) {
        WebElement checkboxi = findElementByXPath("//span[%s and %s]",
                containsText(text),
                isVisible());
        if (isChrome()) {
            driver().executeScript("arguments[0].scrollIntoViewIfNeeded()", checkboxi);
        }
        checkboxi.click();
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

    private void tarkistaHakijanHakemuksenTila(String teksti, String luokka) {
        List<WebElement> hakemuksenTilaIndikaattorit = findElementsByXPath(String.format("//span[%s and %s and %s]",
                hasClass(luokka),
                containsText(teksti),
                isVisible()));

        assertThat(String.format("Hakijan hakemussivulla hakemuksen tila (%s) pitäisi näkyä kerran.", teksti),
                hakemuksenTilaIndikaattorit,
                hasSize(equalTo(1)));
    }

    private void tarkistaInputKentanTila(String luokka) {
        waitForAngularRequestsToFinish(driver());
        List<WebElement> inputkentat = findElementsByXPath(String.format("//input[%s]",
                hasClass(luokka)));

        assertThat(String.format("Hakijan hakemussivulla input kentän luokka (%s) pitäisi näkyä kerran.", luokka),
                inputkentat,
                hasSize(equalTo(1)));
    }

    private WebElement linkInPosition(String text, int position) {
        return findElementByXPath("//*[(self::a or self::button) and %s and %s][%s]",
                containsText(text),
                isVisible(),
                position);
    }

    private void avaaHakemus(String tila, String statusClass) {
        WebElement vireillaLaatikko =
                spanWithTextAndClass(tila, statusClass);
        vireillaLaatikko.click();

        WebElement helsinginSeudunVireilla =
                spanWithTextAndClass(tila, statusClass);
        helsinginSeudunVireilla.click();
    }

    private void lahetaHakemus() {
        klikkaaCheckboxia("Olen liittänyt hakemukseen tarvittavat");
        waitForAngularRequestsToFinish(driver());
        button("Tallenna ja lähetä hakemus").click();
        waitForAngularRequestsToFinish(driver());

        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver());
    }


    private void lisaaAllekirjoitusLiite() throws IOException {
        WebElement fileInput = findElementByXPath("//input[@type='file']");
        driver().executeScript("angular.element(arguments[0]).css('visibility', 'visible').css('width','').css('height','');", fileInput);
        String allekirjoitusliite = getPathToTestFile("JUKU_allekirjoitusoikeus.doc").toFile().getAbsolutePath();
        fileInput.sendKeys(allekirjoitusliite);
    }

    @Test
    public void hakijaVoiEsikatsellaAvustushakemustaLIVIJUKU_128() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        List<WebElement> rahakentat = findElementsByXPath("//input[@type='text' and %s]", isVisible());

        syotaRahasummat(rahakentat);

        tallennaHakemus();

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

    private void tallennaHakemus() {
        button("Tallenna").click();
    }

}
