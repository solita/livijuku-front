package juku.e2e;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
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
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class HakemuskausiTest extends TestBase {

  @Test
  public void hakuohje_kauden_avaus_ja_restorepoint_update() throws IOException,
    InterruptedException {

    postHakuohje(2016);

    login(driver, User.KATRI);

    boolean kaynnistaNapinTilaEnnen = driver.findElement(By.xpath(
      String.format("//button[%s]", containsText("Käynnistä hakemuskausi")))).isEnabled();
    assertTrue("Käynnistä hakemuskausi == enabled", kaynnistaNapinTilaEnnen);

    // Aseta avustuskauden alkupäivä 1.1.
    driver.findElementByLinkText("Muokkaa hakuaikoja").click();
    WebElement avustushakemuskaudenAlkupv = driver.findElementByCssSelector(
      ".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1) > span:nth-child(3) > button:nth-child(1)");
    avustushakemuskaudenAlkupv.click();
    WebElement vuosikuukausiValitsin = driver.findElementByCssSelector(".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > button");
    vuosikuukausiValitsin.click();
    WebElement kuukausi01 = driver.findElementByCssSelector(".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > button");
    kuukausi01.click();
    WebElement paiva01 = driver.findElementByCssSelector(
      ".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > button");
    paiva01.click();
    driver.findElementByLinkText("Tallenna hakuajat").click();

    driver.findElement(By.xpath(
      String.format("//button[%s]", containsText("Käynnistä hakemuskausi")))).click();

    // TODO assertoi, ettei käynnistä hakemuskausi nappulaa enää ole näytöllä

    // Päivitetään testien restorepoint tähän, jotta kautta ei tarvitse avata muissa testeissä.
    createRestorePoint(TEST_RESTORE_POINT);
  }

  @Test
  public void hakijaaInformoidaanHakemuksenTilasta() {
    login(driver, User.HARRI);
    WebElement we = driver.findElementByXPath(String.format("//*[%s]", containsText("Avustuskausi")));
    assertThat(we.getText(), containsString("Avustuskausi"));
    // Avaa hakemus
    we.click();
    // Assertoi tila keskeneräinen

    // Lähetä hakemus
    // Assertoi tila vireillä
    // Kirjaa sisään käsittelijä
    // Ota hakemus käsittelyyn
    // Kirjaa sisään hakija
    // Assertoi tila käsittelyssö
    // Kirjaa sisään käsittelijä
    // Palauta hakemus täydennettäväksi
    // Kirjaa sisään hakija
    // Assertoi tila täydennettävänä
    // Täydennä hakemus
    // Kirjaa sisään käsittelijä
    // Tarkasta hakemus
    // Kirjaa sisään hakija
    // Assertoi tila tarkastettu
    // Kirjaa sisään käsittelijä
    // Päätä hakemus
    // Kijraa sisään hakija
    // Assertoi tila päätetty
  }

  private void postHakuohje(int vuosi) throws IOException {
    CloseableHttpClient httpclient = HttpClients.createDefault();

    HttpPost httpPost = new HttpPost(baseUrl() + "api/hakemuskausi/" + vuosi + "/hakuohje");
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