package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.BeforeTest;

import com.paulhammant.ngwebdriver.ByAngular;

public class TestBase {

  public static final String TEST_RESTORE_POINT = "bf_test";
  private static final String SUITE_RESTORE_POINT = "bf_suite";
  private RemoteWebDriver driver;
  ByAngular ng;

  public RemoteWebDriver driver() {
    if(driver == null) {
      driver = createDriver();
    }
    return driver;
  }

  private RemoteWebDriver createDriver() {
    RemoteWebDriver drv;
    if (System.getProperty("webdriver.chrome.driver()") != null) {
      drv = new ChromeDriver();
    } else {
      FirefoxProfile fp = new FirefoxProfile();
      // Poistettu käytöstä, kun aiheutti välillä kahden selaimen aukeamisen yhden sijaan
      //fp.setPreference("webdriver.load.strategy", "unstable"); // As of 2.19. from 2.9 - 2.18 use 'fast'
      drv = new FirefoxDriver(fp);
    }
    drv.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
    drv.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);
    return drv;
  }

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

  @BeforeSuite
  public void setupSuite() {
    createRestorePoint(SUITE_RESTORE_POINT);
    login(User.KATRI);
    ng = new ByAngular(driver());
    waitForAngularRequestsToFinish(driver());
  }

  @AfterSuite
  public void tearDownSuite() {
    driver().quit();
    revertTo(SUITE_RESTORE_POINT);
  }

  @BeforeTest
  public void setupTest() {
    createRestorePoint(TEST_RESTORE_POINT);
  }

  @AfterTest
  public void tear_down() {
    revertTo(TEST_RESTORE_POINT);
  }

  void createRestorePoint(String restorepoint) {
    try {
      httpGet(oracleServiceUrl() + "testing.create_restorepoint?restorepoint="
                + restorepoint);
      sleep(500);
    } catch (IOException | InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

  void httpGet(String url) throws IOException {
    CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpGet httpGet = new HttpGet(url);
    System.out.println("************************************");
    try (CloseableHttpResponse response = httpclient.execute(httpGet)) {
      HttpEntity entity = response.getEntity();
      EntityUtils.consume(entity);
      System.out.println(httpGet);
      System.out.println(response.getStatusLine());
      if (entity != null) {
        System.out.println("Response content length: " + entity.getContentLength());
      }
    } finally {
      System.out.println("************************************");
    }

  }

  private String oracleServiceUrl() {
    return System.getProperty("oraclews.url", "http://juku:juku@127.0.0.1:50000/juku/");
  }

  void login(User user) {
    driver().get(baseUrl());
    waitForAngularRequestsToFinish(driver());
    setUser(user);
    driver().get(baseUrl());
    waitForAngularRequestsToFinish(driver());
  }

  String hasClass(String classname) {
    // http://stackoverflow.com/questions/8808921/selecting-a-css-class-with-xpath
    return "contains(concat(' ', normalize-space(@class), ' '), ' " + classname + " ')";
  }

  String containsText(String text) {
    return "contains(normalize-space(text()),'" + text + "')";
  }

  String baseUrl() {
    return System.getProperty("baseurl", "http://localhost:9000");
  }

  private void setUser(User user) {
    driver().executeScript("document.cookie='oam-remote-user=" + user.getLogin() + "';"
                             + "document.cookie='oam-user-organization=" + user.getOrganization() + "';"
                             + "document.cookie='oam-groups=" + user.getGroup() + "';"
                             + "console.log('Cookies:', document.cookie);");
  }

  private void revertTo(String restorePoint) {
    try {
      httpGet(oracleServiceUrl() + "testing.revert_to?restorepoint=" + restorePoint);
      sleep(500);
    } catch (IOException | InterruptedException e) {
      throw new RuntimeException(e);
    }
  }


  public WebElement findElement(By by) {
    return driver().findElement(by);
  }

  public WebElement findElementByCssSelector(String css) {
    return driver().findElementByCssSelector(css);
  }

  public WebElement findElementByLinkText(String text) {
    return driver().findElementByLinkText(text);
  }

  public WebElement findElementByXPath(String xpath) {
    return driver().findElementByXPath(xpath);
  }

  public WebElement findElementByXPath(String xpath, Object... n) {
    return driver().findElementByXPath(String.format(xpath,n));
  }
}
