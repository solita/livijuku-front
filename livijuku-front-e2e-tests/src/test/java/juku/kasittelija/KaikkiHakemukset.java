package juku.kasittelija;

import org.openqa.selenium.WebElement;

import juku.TestBase;

/**
 * Created by petrisi on 22.9.15.
 */
public class KaikkiHakemukset {
    public static WebElement ensimmainenTilaindikaattori(TestBase.Hakemuslaji hakemuslaji, TestBase.Hakemustila tila) {
        // TODO Assertoi, että kyseisen hakemuslajin välilehti on avoinna
        // TODO Tässä oletetaan, että ainoa vireilläoleva hakemus on kyseisen hakijan (HSL).
        return TestBase.spanWithHakemustila(tila);
    }
}
