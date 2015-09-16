package kasittelija;

import org.openqa.selenium.WebElement;

import util.ViewBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class Suunnittelu extends ViewBase {
    public static WebElement paatoksentekoon() {
        return linkInPosition("Päätöksentekoon", 1);
    }
}
