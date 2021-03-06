package juku.kasittelija;

import juku.TestBase;
import org.openqa.selenium.WebElement;

/**
 * Created by petrisi on 22.9.15.
 */
public class KaikkiHakemukset {
    public static WebElement ensimmainenTilaindikaattori(TestBase.Hakemuslaji hakemuslaji, TestBase.Hakemustila tila) {
        // TODO Assertoi, että kyseisen hakemuslajin välilehti on avoinna
        // TODO Tässä oletetaan, että ainoa vireilläoleva hakemus on kyseisen hakijan (HSL).
        return TestBase.spanWithHakemustila(tila);
    }

    public static WebElement suunnitteluJaPaatoksenteko(int index) {
        return TestBase.findElementsByLinkText("Suunnittelu ja päätöksenteko").get(index);
    }
}
