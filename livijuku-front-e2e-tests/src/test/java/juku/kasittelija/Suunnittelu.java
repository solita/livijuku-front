package juku.kasittelija;

import juku.util.ViewBase;
import org.openqa.selenium.WebElement;

import static juku.TestBase.driver;

/**
 * Created by petrisi on 16.9.15.
 */
public class Suunnittelu extends ViewBase {
    public static WebElement paatoksentekoon() {
        return linkInPosition("Päätöksentekoon", 1);
    }

    public static WebElement hslMyonnettavaAvustus() {
        return driver.findElementsByXPath("//input[@ng-model='hakemus.myonnettavaAvustus']").get(0);
    }
}
