package juku.hakija;

import static juku.TestBase.Hakemuslaji;
import static juku.TestBase.Hakemustila;
import static juku.TestBase.containsText;
import static juku.TestBase.findElementByXPath;
import static juku.TestBase.hasClass;

import org.openqa.selenium.WebElement;

/**
 * Created by petrisi on 16.9.15.
 */
public class OmatHakemukset {

    public static WebElement hakemuksenTila(Hakemuslaji hakemuslaji, Hakemustila tila) {
        return findElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "//span[%s and %s]", containsText(tila.getName()), hasClass(tila.getCssClass()));
    }

}
