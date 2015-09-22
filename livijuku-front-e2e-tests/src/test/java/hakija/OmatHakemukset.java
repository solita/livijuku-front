package hakija;

import org.openqa.selenium.WebElement;

import juku.e2e.TestBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class OmatHakemukset {

    public static WebElement hakemuksenTila(TestBase.Hakemuslaji hakemuslaji, String tila, String statusClass) {
        return TestBase.findElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "//span[%s and %s]", TestBase.containsText(tila), TestBase.hasClass(statusClass));
    }

}
