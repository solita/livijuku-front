package juku.kasittelija;

import static juku.TestBase.Hakemuslaji;
import static juku.TestBase.Hakemustila;
import static juku.TestBase.containsText;
import static juku.TestBase.findElementByXPath;
import static juku.TestBase.hasClass;

import org.openqa.selenium.WebElement;

/**
 * Created by petrisi on 22.9.15.
 */
public class Hakemuskaudet {
    public static WebElement tilaindikaattori(Hakemuslaji hakemuslaji, Hakemustila tila) {
        return findElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "/div/div[2]//span[%s and %s]", containsText(tila.getName()), hasClass(tila.getCssClass()));
    }
}
