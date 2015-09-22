package kasittelija;

import static juku.e2e.TestBase.containsText;
import static juku.e2e.TestBase.findElementByXPath;
import static juku.e2e.TestBase.hasClass;

import org.openqa.selenium.WebElement;

import juku.e2e.TestBase;

/**
 * Created by petrisi on 22.9.15.
 */
public class Hakemuskaudet {
    public static WebElement tilaindikaattori(TestBase.Hakemuslaji hakemuslaji, String tila, String tilaClass) {
        return findElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "/div/div[2]//span[%s and %s]", containsText(tila), hasClass(tilaClass));
    }
}
