import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;
import static org.testng.AssertJUnit.assertTrue;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.paulhammant.ngwebdriver.ByAngular;

public class HakemuskausiTest {

  public static final String BEFORE_TEST_HAKEMUSKAUSI = "bftest";
  private FirefoxDriver driver;
  private ByAngular ng;

  enum User {
    HARRI("juku_hakija", "juku_hakija", "helsingin ka"),
    KATRI("juku_kasittelija", "juku_kasittelija", "liikennevirasto");
    private final String login;
    private final String group;
    private final String organization;

    User(String login, String group, String organization) {
      this.login = login;
      this.group = group;
      this.organization = organization;
    }

    public String getLogin() {
      return login;
    }

    public String getGroup() {
      return group;
    }

    public String getOrganization() {
      return organization;
    }
  }

  @BeforeTest
  public void setup() {
    createRestorePoint();
    driver = new FirefoxDriver();
    driver.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
    login(User.KATRI);
    ng = new ByAngular(driver);
    waitForAngularRequestsToFinish(driver);
  }

  private void createRestorePoint() {
    try {
      httpGet(oracleServiceUrl());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private void httpGet(String url) throws IOException {
    CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpGet httpGet = new HttpGet(url);
    System.out.println("HTTPGET: " + url);
    try (CloseableHttpResponse response = httpclient.execute(httpGet)) {
      HttpEntity entity = response.getEntity();
      EntityUtils.consume(entity);
      System.out.println(response.getStatusLine());
      if (entity != null) {
        System.out.println("Response content length: " + entity.getContentLength());
      }
    }

  }

  private String oracleServiceUrl() {
    return "http://juku:juku@127.0.0.1:50000/juku/testing.create_restorepoint?restorepoint="+BEFORE_TEST_HAKEMUSKAUSI;
  }

  private void login(User user) {
    driver.get(baseUrl());
    setUser(user);
    driver.get(baseUrl());
  }

  private String hasClass(String classname) {
    // http://stackoverflow.com/questions/8808921/selecting-a-css-class-with-xpath
    return "contains(concat(\" \", normalize-space(@class), \" \"), \" " + classname + " \")";
  }

  private String containsText(String text) {
    return "contains(normalize-space(text()),\"" + text + "\")";
  }

  private String baseUrl() {
    return "http://localhost:9000/";
  }

  private void setUser(User user) {
    driver.executeScript("document.cookie='oam-remote-user=" + user.getLogin() + "';"
                           + "document.cookie='oam-user-organization=" + user.getOrganization() + "';"
                           + "document.cookie='oam-groups=" + user.getGroup() + "';"
                           + "console.log('Cookies:', document.cookie);");
  }

  @AfterTest
  public void tear_down() {
    driver.quit();
    try {
      sleep(5000);
    } catch (InterruptedException e) {
      // No can do...
    }
    revertTo();
  }

  private void revertTo() {
    try {
      httpGet("http://juku:juku@127.0.0.1:50000/juku/testing.revert_to?restorepoint="+ BEFORE_TEST_HAKEMUSKAUSI);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Test
  public void kasittelijaLisaaHakuohjeenJaKaynnistaaHakemuskauden_KaynnistaHakemuskausiNappiMuuttuuDisabled() throws IOException,
    InterruptedException {

    int vuosi = 2016;

    // Lisätään hakuohjeen mockup upload formi ja inputit
    //    driver.executeScript("angular.element(document.querySelector('body')).append("
    //                           + "angular.element(\"<form action='api/hakemuskausi/" + vuosi + "/hakuohje' method=POST enctype=\"multipart/form-data\">"
    //                           + "<input type=file name=hakuohje /><input type=submit></form>\"));");

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

    try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
      System.out.println(response.getStatusLine());
      HttpEntity entity = response.getEntity();
      // do something useful with the response body
      // and ensure it is fully consumed
      EntityUtils.consume(entity);
    }

    login(User.KATRI);
    sleep(5500);
    boolean kaynnistaNapinTilaEnnen = driver.findElement(By.xpath(
      String.format("//button[%s]", containsText("Käynnistä hakemuskausi")))).isEnabled();
    assertTrue("Käynnistä hakemuskausi == enabled", kaynnistaNapinTilaEnnen);

    driver.findElement(By.xpath(
      String.format("//button[%s]", containsText("Käynnistä hakemuskausi")))).click();

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
