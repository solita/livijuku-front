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
        findElementByXPath("//input[@type='text']").sendKeys("Paavo Päättäjä");
        button("Tallenna ja hyväksy päätös").click();
        okOlenVarma().click();
        waitForAngularRequestsToFinish(driver());

        // Kirjaa sisään hakija
        login(User.HARRI);
        // Assertoi tila päätetty
        spanWithTextAndClass("Päätetty", "hakemus-tila-paatetty").click();

        // Tarkista päätös pdf
        String paatosHref = findElementByLinkText("Avaa päätös (PDF)").getAttribute("href");
        String pdfText = httpGetPdfText(paatosHref, User.HARRI);

        String expectedText = "Hakija: Helsingin seudun liikenne\n"
                + "Hakija hakee vuonna 2016 suurten kaupunkiseutujen joukkoliikenteen \n"
                + "valtionavustusta 0 euroa.";
        assertThat(String.format("Päätös PDF sisältää tekstin %s", expectedText),
                pdfText.contains(expectedText));
    }

    @Test
    public void hakijaSyottaaHakemukseenAlvillisetRahasummat() {
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

        for (int i = 0; i < rahakentat.size(); i += 2) {
            rahakentat.get(i).clear();
            rahakentat.get(i).sendKeys("1000,00");
            rahakentat.get(i + 1).clear();
            rahakentat.get(i + 1).sendKeys("3000,00");
        }
        tarkistaHakemuksenSummakentat();
        klikkaaCheckboxia("Haluan syöttää summat arvonlisäverollisina.");
        tarkistaHakemuksenSummakentat();

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

    private void klikkaaCheckboxia(String text) {
        WebElement checkboxi = findElementByXPath("//span[%s and %s]",
                containsText(text),
                isVisible());
        checkboxi.click();
    }

    private void tarkistaHakemuksenSummakentat() {
        //Tarkistetaan hakemuksen valisumma kentat
        List<WebElement> h4t = findElementsByXPath("//h4[@class='panel-title ng-binding']");

        assertThat(h4t.get(1).getText(), is(equalTo("3 000,00 € (sis. alv)")));
        assertThat(h4t.get(3).getText(), is(equalTo("4 000,00 € (sis. alv)")));
        assertThat(h4t.get(5).getText(), is(equalTo("5 000,00 € (sis. alv)")));

        // Tarkistetaan hakemuksen yhteensa kentta
        List<WebElement> h4s = findElementsByXPath("//h4[@class='ng-binding']");
        assertThat(h4s.get(1).getText(), is(equalTo("12 000,00 € (sis. alv)")));
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

    private void postHakuohje(int vuosi) throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();

        HttpPost httpPost = new HttpPost(baseUrl() + "/api/hakemuskausi/" + vuosi + "/hakuohje");
        httpPost.addHeader("oam-remote-user", User.KATRI.getLogin());
        httpPost.addHeader("oam-user-organization", User.KATRI.getOrganization());
        httpPost.addHeader("oam-groups", User.KATRI.getGroup());

        FileBody hakuohje = new FileBody(getPathToTestPdf().toFile());

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

    private Path getPathToTestPdf() {
        try {
            return Paths.get(ClassLoader.getSystemResource("test.pdf").toURI());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return null;
        }
    }

}
