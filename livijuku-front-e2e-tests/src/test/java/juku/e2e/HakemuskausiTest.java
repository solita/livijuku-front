package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.testng.AssertJUnit.assertTrue;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi")).click();
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
  public void hakijaaInformoidaanHakemuksenTilasta() {
    login(User.HARRI);

    // Varmista, että kausi on avoinna TODO: Korjaa tämä.
    //    WebElement eiHakemuksia = findElementByXPath("//p[%s]", containsText("Ei hakemuksia, koska hakemuskautta ei ole vielä avattu."));
    //    assertThat(eiHakemuksia, is(notNullValue()));

    // Assertoi tila keskeneräinen ja avaa hakemus
    // TODO Assertoi hakijana myös hakemuksen tila ja bread crumbs.
    spanWithTextAndClass("Keskeneräinen", "label-warning").click();

    // Lähetä hakemus
    lahetaHakemus();

    // Assertoi hakijana tila vireillä (find failaa, jos ei löydä)
    spanWithTextAndClass("Vireillä", "label-danger");

    // Kirjaa sisään käsittelijä
    login(User.KATRI);
    // Ota hakemus käsittelyyn
    avaaHakemus("Vireillä", "label-danger");

    // Palauta hakemus täydennettäväksi
    button("Palauta täydennettäväksi").click();

    //TODO Assertoi käsittelijänä tila Täydennettävänä
    spanWithTextAndClass("Täydennettävänä", "label-info");
    // Kirjaa sisään hakija
    login(User.HARRI);
    // Assertoi tila täydennettävänä
    // Avaa hakemus
    spanWithTextAndClass("Täydennettävänä", "label-info").click();
    // Täydennä hakemus
    lahetaHakemus();

    // Assetoi hakijana tila Täydennetty.
    spanWithTextAndClass("Täydennetty", "label-danger");

    // Kirjaa sisään käsittelijä
    login(User.KATRI);
    // Tarkasta hakemus
    avaaHakemus("Täydennetty", "label-danger");
    button("Merkitse tarkastetuksi").click();
    okOlenVarma().click();
    // Assertoi käsittelijänä tila Tarkastettu
    spanWithTextAndClass("Tarkastettu", "label-success");

    // Kirjaa sisään hakija
    login(User.HARRI);
    // Assertoi hakijana tila tarkastettu
    spanWithTextAndClass("Tarkastettu", "label-success");

    // Kirjaa sisään käsittelijä
    login(User.KATRI);
    // Päätä hakemus
    spanWithTextAndClass("Tarkastettu", "label-success").click();
    buttonInPosition("Suunnittelu ja päätöksenteko", 1).click();
    buttonInPosition("Päätöksentekoon", 1).click();
    findElementByXPath("//textarea[1]").sendKeys("Päätöstekstiä");
    findElementByXPath("//input[@type='text']").sendKeys("Paavo Päättäjä");
    button("Tallenna ja hyväksy päätös").click();
    okOlenVarma().click();
    waitForAngularRequestsToFinish(driver());

    // Kirjaa sisään hakija
    login(User.HARRI);
    // Assertoi tila päätetty

  }

  private WebElement buttonInPosition(String text, int position) {
    return findElementByXPath("//button[%s and %s][%s]",
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
    WebElement olenLiittanyt = findElementByXPath("//span[%s and %s]", containsText("Olen liittänyt hakemukseen tarvittavat"), isVisible());
    olenLiittanyt.click();
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
