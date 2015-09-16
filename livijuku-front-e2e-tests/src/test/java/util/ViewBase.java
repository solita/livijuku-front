package util;

import org.openqa.selenium.WebElement;

import juku.e2e.TestBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class ViewBase {
    public static WebElement linkInPosition(String text, int position) {
        return TestBase.findElementByXPath("//*[(self::a or self::button) and %s and %s][%s]",
                TestBase.containsText(text),
                TestBase.isVisible(),
                position);
    }

}
