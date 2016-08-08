package juku.hakija;

import org.openqa.selenium.WebElement;

import static juku.TestBase.*;

/**
 * Created by petrisi on 16.9.15.
 */
public class OmatHakemukset {

    public static WebElement hakemuksenTila(Hakemuslaji hakemuslaji, Hakemustila tila) {
        return findElementByXPath("//div[.//p[string()='" + hakemuslaji.getOtsikko() + "'] and contains(@class, 'col-md-3')]"
                + "//span[%s and %s]", containsText(tila.getName()), hasClass(tila.getCssClass()));
    }

}
