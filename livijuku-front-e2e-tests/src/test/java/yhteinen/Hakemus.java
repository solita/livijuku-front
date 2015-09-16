package yhteinen;

import org.openqa.selenium.WebElement;

import juku.e2e.TestBase;
import util.ViewBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class Hakemus extends ViewBase {
    public static WebElement firstFileInput() {
        return TestBase.driver.findElementByXPath("//input[@type='file']");
    }

    public static WebElement tallennaHakemus() {
        return TestBase.button("Tallenna");
    }

    public static WebElement palaaOmiinHakemuksiin() {
        return linkInPosition("Palaa omiin hakemuksiin", 1);
    }

    public static WebElement suunnitteluJaPaatoksenteko() {
        return linkInPosition("Suunnittelu ja päätöksenteko", 1);
    }

}
