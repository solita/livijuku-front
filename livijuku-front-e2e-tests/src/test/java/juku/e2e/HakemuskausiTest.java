package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.testng.AssertJUnit.assertTrue;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

import com.paulhammant.ngwebdriver.AngularModelAccessor;

public class HakemuskausiTest extends TestBase {

    @Test
    public void hakuohje_kauden_avaus_ja_restorepoint_update() throws IOException,
            InterruptedException {

        postHakuohje(2016);

        login(User.KATRI);

        boolean kaynnistaNapinTilaEnnen =
                findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi")).isEnabled();
        assertTrue("Käynnistä hakemuskausi == enabled", kaynnistaNapinTilaEnnen);

        // Aseta avustuskauden alkupäivä 1.1.
        asetaAvustuskaudenAlkupaiva0101();

        button("Käynnistä hakemuskausi").click();
        waitForAngularRequestsToFinish(driver());

        boolean kaynnistaNappiNakyy = true;
        for (int i = 0; i < 25; i++) {
            sleep(100);
            try {
                button("Käynnistä hakemuskausi");
            } catch (NoSuchElementException e) {
                kaynnistaNappiNakyy = false;
                break;
            }
        }
        assertThat("Käynnistä hakemuskausi jäi näkyviin vaikka kausi avattiin.", !kaynnistaNappiNakyy);

        // Päivitetään testien restorepoint tähän, jotta kautta ei tarvitse avata muissa testeissä.
        createRestorePoint(TEST_RESTORE_POINT);
    }

    private void asetaAvustuskaudenAlkupaiva0101() {
        findElementByLinkText("Muokkaa hakuaikoja").click();
        String datepicker = ".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1)";

        WebElement avustushakemuskaudenAlkupv = findElementByCssSelector(
                datepicker + " > span:nth-child(3) > button:nth-child(1)");
        avustushakemuskaudenAlkupv.click();
        WebElement vuosikuukausiValitsin = findElementByCssSelector(
                datepicker
                        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > button");
        vuosikuukausiValitsin.click();
        WebElement kuukausi01 = findElementByCssSelector(
                datepicker
                        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > button");
        kuukausi01.click();
        WebElement paiva01 = findElementByCssSelector(
                datepicker
                        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > button");
        paiva01.click();

        findElementByLinkText("Tallenna hakuajat").click();
        waitForAngularRequestsToFinish(driver());
    }

    @Test
    public void hakijaaInformoidaanHakemuksenTilasta() throws IOException {
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
        linkInPosition("Palaa hakemusten päänäkymään", 1).click();
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
    }

    @Test
    public void hakijaSyottaaHakemukseenAlvillisetRahasummat() throws IOException {
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
        tarkistaInputKentanTila("ng-invalid-sallittu-arvo-haettavaavustus");

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
        linkInPosition("Palaa hakemusten päänäkymään", 1).click();
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
        return System.getProperty("chrome")!=null;
    }

    private void tarkistaHakemuksenSummakentat() {
        //Tarkistetaan hakemuksen valisumma kentat
        List<WebElement> h4t = findElementsByXPath("//h4[@class='panel-title ng-binding']");

        assertThat(h4t.get(1).getText(), is(equalTo("3 000,00 € (sis. alv)")));
        assertThat(h4t.get(3).getText(), is(equalTo("4 000,00 € (sis. alv)")));
        assertThat(h4t.get(5).getText(), is(equalTo("5 000,00 € (sis. alv)")));

        // Tarkistetaan hakemuksen yhteensa kentta
        List<WebElement> h4s = findElementsByXPath("//h4[@class='ng-binding']");
        assertThat(h4s.get(0).getText(), is(equalTo("12 000,00 € (sis. alv)")));
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
        String hakemusId = getScopeVariableValue(button("Tallenna tiedot"), "hakemusid");
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(baseUrl() + "/api/hakemus/" + hakemusId + "/liite");
        httpPost.addHeader("oam-remote-user", User.HARRI.getLogin());
        httpPost.addHeader("oam-user-organization", User.HARRI.getOrganization());
        httpPost.addHeader("oam-groups", User.HARRI.getGroup());

        FileBody liite = new FileBody(getPathToTestFile("JUKU_allekirjoitusoikeus.doc").toFile());

        HttpEntity reqEntity = MultipartEntityBuilder.create()
                .addPart("liite", liite)
                .build();
        httpPost.setEntity(reqEntity);
        System.out.println("************************************");

        try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
            System.out.println(httpPost);
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            // do something useful with the response body
            // and ensure it is fully consumed
            EntityUtils.consume(entity);
        } finally {
            System.out.println("************************************");
        }
    }

    private void postHakuohje(int vuosi) throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();

        HttpPost httpPost = new HttpPost(baseUrl() + "/api/hakemuskausi/" + vuosi + "/hakuohje");
        httpPost.addHeader("oam-remote-user", User.KATRI.getLogin());
        httpPost.addHeader("oam-user-organization", User.KATRI.getOrganization());
        httpPost.addHeader("oam-groups", User.KATRI.getGroup());

        FileBody hakuohje = new FileBody(getPathToTestFile("test.pdf").toFile());

        HttpEntity reqEntity = MultipartEntityBuilder.create()
                .addPart("hakuohje", hakuohje)
                .build();
        httpPost.setEntity(reqEntity);
        System.out.println("************************************");

        try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
            System.out.println(httpPost);
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            // do something useful with the response body
            // and ensure it is fully consumed
            EntityUtils.consume(entity);
        } finally {
            System.out.println("************************************");
        }
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
        String pdfUrl = String.format("%s/pdf/web/viewer.html?file=/api/hakemus/%s/pdf", baseUrl(), hakemusid);

        String actual = httpGetPdfText(pdfUrl, User.HARRI);

        String expected = "Hakija: Helsingin seudun liikenne\n"
                + "Hakija hakee vuonna 2016 suurten kaupunkiseutujen joukkoliikenteen \n"
                + "valtionavustusta 13900 euroa. Haettu avustus jakautuu seuraavasti:\n"
                + "Paikallisliikenne 1100 e\n"
                + "Integroitupalvelulinja 1100 e\n"
                + "Muu PSA:n mukaisen liikenteen järjestäminen 1100 e\n"
                + "Seutulippu 1100 e\n"
                + "Kaupunkilippu tai kuntalippu 1100 e\n"
                + "Liityntälippu 1100 e\n"
                + "Työmatkalippu 1100 e\n"
                + "Informaatio ja maksujärjestelmien kehittäminen 1240 e\n"
                + "Matkapalvelukeskuksen suunnittelu ja kehittäminen 1240 e\n"
                + "Matkakeskuksen suunnittelu ja kehittäminen 1240 e\n"
                + "Raitiotien suunnittelu 1240 e\n"
                + "Muu hanke 1240 e\n"
                + "Hakija osoittaa omaa rahoitusta näihin kohteisiin yhteensä 41700 euroa.\n"
                + "Lähettäjä: <hakijan nimi, joka on lähettänyt hakemuksen>\n"
                + "Liikennevirasto - esikatselu - hakemus on keskeneräinen\n"
                + "1 (1)\n";

        assertThat("Hakemuksen esikatselussa pitää näkyä rahasummat.", containsNormalized(actual, expected));

    }


    /* Tätä testiä ei voi toteuttaa ennenkuin Angular file upload komponentti tukee sitä
    @Test
    public void liitteidenLisaaminenHakemukselleLIVIJUKU_325() throws IOException {
        login(User.HARRI);

        //Avaa hakemus
        spanWithTextAndClass("Keskeneräinen", "hakemus-tila-keskenerainen").click();

        //WebElement liitelataus = findElementByXPath("//input[@type='text' and %s]", isVisible());
       driver().executeScript("var formi = document.createElement(\"form\");\n" +
                "var node = document.createElement(\"input\");\n" +
                "node.setAttribute('type', 'file');\n" +
                "formi.appendChild(node);\n" +
                "var element = document.getElementsByClassName(\"drop-box\")[0];\n" +
                "element.appendChild(formi);",button("Valitse tiedosto"));

        findElementByXPath("//input[@type='file']").sendKeys(getPathToTestPdf().toFile().getAbsolutePath());
        button("Valitse tiedosto").click();

 }
 */

    private boolean containsNormalized(String actual, String expected) {
        String a = actual.replaceAll("\\s+", " ");
        String b = expected.replaceAll("\\s+", " ");
        return a.contains(b);
    }

    private void tallennaHakemus() {
        button("Tallenna").click();
    }

    private Path getPathToTestFile(String filename) {
        try {
            return Paths.get(ClassLoader.getSystemResource(filename).toURI());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return null;
        }
    }

}
