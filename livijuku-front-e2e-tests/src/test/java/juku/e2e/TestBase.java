package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.protocol.HttpContext;
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
  private PoolingHttpClientConnectionManager connectionManager;

  protected WebElement button(String text) {
    return findElementByXPath("//button[%s and %s]",
                       containsText(text),
                       isVisible());
  }

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

  String isVisible() {
    return "not(self::*[@disabled] or ancestor::*[@disabled]) and not(ancestor::*[contains(concat( ' ', @class, ' '), ' ng-hide ')])";
  }

  protected WebElement okOlenVarma() {
    return findElementByXPath("//button[%s]", containsText("Kyllä"));
  }

  protected WebElement spanWithTextAndClass(String tila, String statusClass) {
    return findElementByXPath("//span[%s and %s and %s]",
                         containsText(tila),
                         hasClass(statusClass),
                         isVisible());
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

  HttpRequestRetryHandler myRetryHandler = new HttpRequestRetryHandler() {

    public boolean retryRequest(
      IOException exception,
      int executionCount,
      HttpContext context) {
      if (executionCount >= 5) {
        // Do not retry if over max retry count
        return false;
      }
      if (exception instanceof InterruptedIOException) {
        // Timeout
        return false;
      }
      if (exception instanceof UnknownHostException) {
        // Unknown host
        return false;
      }
      if (exception instanceof SSLException) {
        // SSL handshake exception
        return false;
      }
      HttpClientContext clientContext = HttpClientContext.adapt(context);
      HttpRequest request = clientContext.getRequest();
      return !(request instanceof HttpEntityEnclosingRequest); // return isIdempotent
    }
  };

  @BeforeSuite
  public void setupSuite() {
    createRestorePoint(SUITE_RESTORE_POINT);
    login(User.KATRI);
    ng = new ByAngular(driver());
    waitForAngularRequestsToFinish(driver());

    connectionManager = new PoolingHttpClientConnectionManager();
    // Increase max total connection to 200
    connectionManager.setMaxTotal(200);
    // Increase default max connection per route to 20
    connectionManager.setDefaultMaxPerRoute(20);
    // Increase max connections for localhost:80 to 50
    HttpHost localhost = new HttpHost("locahost", 80);
    connectionManager.setMaxPerRoute(new HttpRoute(localhost), 50);
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
    // http://stackoverflow.com/a/26149627

    CloseableHttpClient httpclient = HttpClients.custom()
      .setConnectionManager(connectionManager)
      .setRetryHandler(myRetryHandler)
      .build();

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
    return "contains(normalize-space(string()),'" + text + "')";
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
