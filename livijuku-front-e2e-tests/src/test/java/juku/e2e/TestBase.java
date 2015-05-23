package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
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
  protected RemoteWebDriver driver;
  protected ByAngular ng;

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
  }

  @AfterSuite
  public void tearDownSuite() {
    revertTo(SUITE_RESTORE_POINT);
  }

  @BeforeTest
  public void setupTest() {
    createRestorePoint(TEST_RESTORE_POINT);
    if (System.getProperty("webdriver.chrome.driver") != null) {
      driver = new ChromeDriver();
    } else {
      FirefoxProfile fp = new FirefoxProfile();
      fp.setPreference("webdriver.load.strategy", "unstable"); // As of 2.19. from 2.9 - 2.18 use 'fast'
      driver = new FirefoxDriver(fp);
    }
    driver.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
    driver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);
    login(driver, User.KATRI);
    ng = new ByAngular(driver);
    waitForAngularRequestsToFinish(driver);
  }

  @AfterTest
  public void tear_down() {
    driver.quit();
    revertTo(TEST_RESTORE_POINT);
  }

  protected void createRestorePoint(String restorepoint) {
    try {
      httpGet(oracleServiceUrl() + "/juku/testing.create_restorepoint?restorepoint="
                + restorepoint);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  protected void httpGet(String url) throws IOException {
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
    return System.getProperty("oraclews.url", "http://juku:juku@127.0.0.1:50000");
  }

  protected void login(RemoteWebDriver driver, User user) {
    driver.get(baseUrl());
    waitForAngularRequestsToFinish(driver);
    setUser(user);
    driver.get(baseUrl());
    waitForAngularRequestsToFinish(driver);
  }

  private String hasClass(String classname) {
    // http://stackoverflow.com/questions/8808921/selecting-a-css-class-with-xpath
    return "contains(concat(\" \", normalize-space(@class), \" \"), \" " + classname + " \")";
  }

  protected String containsText(String text) {
    return "contains(normalize-space(text()),'" + text + "')";
  }

  protected String baseUrl() {
    return System.getProperty("baseurl", "http://localhost:9000/");
  }

  private void setUser(User user) {
    driver.executeScript("document.cookie='oam-remote-user=" + user.getLogin() + "';"
                           + "document.cookie='oam-user-organization=" + user.getOrganization() + "';"
                           + "document.cookie='oam-groups=" + user.getGroup() + "';"
                           + "console.log('Cookies:', document.cookie);");
  }

  private void revertTo(String restorePoint) {
    try {
      httpGet(oracleServiceUrl() + "/juku/testing.revert_to?restorepoint=" + restorePoint);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

}
