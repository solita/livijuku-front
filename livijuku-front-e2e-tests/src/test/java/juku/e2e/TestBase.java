package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.testng.AssertJUnit.assertTrue;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.util.PDFTextStripper;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import com.paulhammant.ngwebdriver.AngularModelAccessor;
import com.paulhammant.ngwebdriver.ByAngular;

public class TestBase {

    public static final String TEST_RESTORE_POINT = "bf_test";
    private static final String SUITE_RESTORE_POINT = "bf_suite";
    private RemoteWebDriver driver;
    ByAngular ng;
    private PoolingHttpClientConnectionManager connectionManager;
    public static final int DEFAULT_IMPLICIT_WAIT = 10;

    protected WebElement button(String text) {
        waitForAngularRequestsToFinish(driver());
        return findElementByXPath("//button[%s and %s]",
                containsText(text),
                isVisible());
    }

    public RemoteWebDriver driver() {
        if (driver == null) {
            driver = createDriver();
            System.out.println(driver.getCapabilities());
        }
        return driver;
    }

    private RemoteWebDriver createDriver() {
        RemoteWebDriver drv;
        if (System.getProperty("chrome") != null) {
            drv = new ChromeDriver();
        } else {
            FirefoxProfile fp = new FirefoxProfile();
            // Poistettu käytöstä, kun aiheutti välillä kahden selaimen aukeamisen yhden sijaan
            //fp.setPreference("webdriver.load.strategy", "unstable"); // As of 2.19. from 2.9 - 2.18 use 'fast'
            drv = new FirefoxDriver(fp);
        }
        drv.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
        setImplicitTimeout(drv, DEFAULT_IMPLICIT_WAIT);
        return drv;
    }

    private void setImplicitTimeout(RemoteWebDriver drv, int DEFAULT_IMPLICIT_WAIT) {
        drv.manage().timeouts().implicitlyWait(DEFAULT_IMPLICIT_WAIT, TimeUnit.SECONDS);
    }

    String isVisible() {
        waitForAngularRequestsToFinish(driver());
        return "not(self::*[@disabled] or ancestor::*[@disabled]) and not(ancestor::*[contains(concat( ' ', @class, ' '), ' ng-hide ')])";
    }

    protected WebElement okOlenVarma() {
        waitForAngularRequestsToFinish(driver());
        return findElementByXPath("//button[%s]", containsText("Kyllä"));
    }

    protected WebElement spanWithTextAndClass(String tila, String statusClass) {
        waitForAngularRequestsToFinish(driver());
        return findElementByXPath("//span[%s and %s and %s]",
                containsText(tila),
                hasClass(statusClass),
                isVisible());
    }

    protected void postHakuohje(File fileToUpload) {
        WebElement fileInput = findElementByXPath("//input[@type='file']");
        driver().executeScript("angular.element(arguments[0]).css('visibility', 'visible').css('width','').css('height','');", fileInput);
        String hakuohje = fileToUpload.getAbsolutePath();
        fileInput.sendKeys(hakuohje);
    }

    protected Path getPathToTestFile(String filename) {
        try {
            return Paths.get(ClassLoader.getSystemResource(filename).toURI());
        } catch (URISyntaxException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    protected void asetaAlkupaivat0101() {
        for (int i = 0; i<3; i++) {
            WebElement muokkaaAikoja = findElementByCssSelector("#test-muokkaa-hakuaikoja-" + i);
            muokkaaAikoja.click();

            WebElement alkupv = findElementByCssSelector("#test-alkupvm-datepicker-button-" + i);
            alkupv.click();

            WebElement vuosikuukausiValitsin =
                    findElementByCssSelector("#test-alkupvm-datepicker-" + i + " thead > tr:nth-child(1) > th:nth-child(2) button");
            vuosikuukausiValitsin.click();

            WebElement vuosiValitsin = findElementByCssSelector("#test-alkupvm-datepicker-" + i + " thead tr:first-child th:nth-child(2) button");
            vuosiValitsin.click();

            WebElement vuosi01 = findElementByCssSelector("#test-alkupvm-datepicker-" + i + " tbody tr:first-child td:first-child button");
            vuosi01.click();

            WebElement kuukausi01 = findElementByCssSelector("#test-alkupvm-datepicker-" + i + " tbody tr:first-child td:first-child button");
            kuukausi01.click();

            WebElement paiva01 = findElementByCssSelector("#test-alkupvm-datepicker-" + i + " tbody tr:first-child td:nth-child(5) button");
            paiva01.click();

            findElementByCssSelector("#test-alkupvm-tallenna-" + i).click();
            waitForAngularRequestsToFinish(driver());
        }
    }

    enum User {
        HARRI("juku_hakija", "juku_hakija", "helsingin ka"),
        KATRI("juku_kasittelija", "juku_kasittelija", "liikennevirasto"),
        PAIVI("juku_paatoksentekija", "juku_paatoksentekija", "liikennevirasto");

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

        connectionManager = new PoolingHttpClientConnectionManager();
        // Increase max total connection to 200
        connectionManager.setMaxTotal(200);
        // Increase default max connection per route to 20
        connectionManager.setDefaultMaxPerRoute(20);
        // Increase max connections for localhost:80 to 50
        HttpHost localhost = new HttpHost("locahost", 80);
        connectionManager.setMaxPerRoute(new HttpRoute(localhost), 50);

        avaaKausi();

    }

    private void avaaKausi() {
        login(User.KATRI);

        postHakuohje(getPathToTestFile("test.pdf").toFile());

        boolean kaynnistaNapinTilaEnnen =
                findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi")).isEnabled();
        assertTrue("Käynnistä hakemuskausi == enabled", kaynnistaNapinTilaEnnen);

        // Aseta avustus- ja maksatuskausien alkupäivä 1.1. kuluvaa vuotta
        asetaAlkupaivat0101();

        button("Käynnistä hakemuskausi").click();
        waitForAngularRequestsToFinish(driver());

        boolean kaynnistaNappiNakyy = true;
        for (int i = 0; i < 25; i++) {
            try {
                sleep(100);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            try {
                // Nopeutetaan hieman, kun tässä odotetaan, ettei käynnnistä nappia enää ole.
                // Implicit wait on oletuksena niin pitkä.
                setImplicitTimeout(driver(),2);
                button("Käynnistä hakemuskausi");
            } catch (NoSuchElementException e) {
                kaynnistaNappiNakyy = false;
                break;
            } finally {
                setImplicitTimeout(driver(),DEFAULT_IMPLICIT_WAIT);
            }
        }
        assertThat("Käynnistä hakemuskausi jäi näkyviin vaikka kausi avattiin.", !kaynnistaNappiNakyy);

        // Päivitetään testien restorepoint tähän, jotta kautta ei tarvitse avata muissa testeissä.
        createRestorePoint(TEST_RESTORE_POINT);
    }

    @AfterSuite
    public void tearDownSuite() {
        driver().quit();
        revertTo(SUITE_RESTORE_POINT);
    }

    @BeforeMethod
    public void setupTest() {
        createRestorePoint(TEST_RESTORE_POINT);
    }

    @AfterMethod
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

    String httpGetPdfText(String url, User user) throws IOException {
        // http://stackoverflow.com/a/26149627
        String result = null;

        CloseableHttpClient httpclient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .build();

        // PDF viewer pois URL:sta
        String uusiUrl = url.substring(0, 22) + url.substring(53);
        HttpGet httpGet = new HttpGet(uusiUrl);
        httpGet.addHeader("oam-remote-user", user.getLogin());
        httpGet.addHeader("oam-groups", user.getGroup());
        httpGet.addHeader("oam-user-organization", user.getOrganization());

        System.out.println("************************************");
        try (CloseableHttpResponse response = httpclient.execute(httpGet)) {
            HttpEntity entity = response.getEntity();
            try (InputStream pdfStream = entity.getContent()) {
                PDFParser testPDF = new PDFParser(pdfStream);
                testPDF.parse();
                try (PDDocument document = testPDF.getPDDocument()) {
                    result = new PDFTextStripper().getText(document);
                }
            }
            EntityUtils.consume(entity);
            System.out.println(httpGet);
            System.out.println(response.getStatusLine());
            System.out.println("Response content length: " + entity.getContentLength());
        } finally {
            System.out.println("************************************");
        }
        return result;
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

    public WebElement findElementByCssSelector(String css) {
        waitForAngularRequestsToFinish(driver());
        return driver().findElementByCssSelector(css);
    }

    public WebElement findElementByLinkText(String text) {
        waitForAngularRequestsToFinish(driver());
        return driver().findElementByLinkText(text);
    }

    public WebElement findElementByXPath(String xpath) {
        waitForAngularRequestsToFinish(driver());
        return driver().findElementByXPath(xpath);
    }

    public List<WebElement> findElementsByXPath(String xpath, Object... n) {
        waitForAngularRequestsToFinish(driver());
        return driver().findElementsByXPath(String.format(xpath, n));
    }

    public WebElement findElementByXPath(String xpath, Object... n) {
        waitForAngularRequestsToFinish(driver());
        return driver().findElementByXPath(String.format(xpath, n));
    }

    public String getScopeVariableValue(WebElement we, String variableName) {
        AngularModelAccessor modelAccessor = new AngularModelAccessor(driver());
        return modelAccessor.retrieveAsString(we, variableName);
    }
}
