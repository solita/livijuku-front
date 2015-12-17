package juku.kasittelija;

import org.openqa.selenium.WebElement;

import static juku.TestBase.*;

/**
 * Created by petrisi on 22.9.15.
 */
public class Hakemuskaudet {
    public static WebElement tilaindikaattori(Hakemuslaji hakemuslaji, Hakemustila tila) {
        return getElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "/div/div[2]//span[%s and %s and %s]", containsText(tila.getName()), hasClass(tila.getCssClass()), isVisible());
    }
}
