package juku;

import org.openqa.selenium.WebElement;

/**
 * Created by petrisi on 17.9.15.
 */
public class WorkAround {
    public enum Delay {
        SHORT(200),
        MEDIUM(1000),
        LONG(15000);

        private static final int SCALE = 1;
        private final int delay;

        Delay(int delay) {
            this.delay = delay;
        }

        public int getMilliSeconds() {
            return delay * SCALE;
        }
    }

    public static void sleep(Delay delay) {
        try {
            Thread.sleep(delay.getMilliSeconds());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    // http://stackoverflow.com/questions/12035023/selenium-webdriver-cant-click-on-a-link-outside-the-page
    public static void scrollIntoView(WebElement element) {
        //driver.executeScript("arguments[0].scrollIntoView(true);", element);
        int elementPosition = element.getLocation().getY();
        String js = String.format("window.scroll(0, %s)", elementPosition - 55);
        TestBase.driver.executeScript(js);
    }

    // Chrome selaimessa Windowsissa nappulat jäävät joskus jonkin toisen elementin alle.
    // Siksi tässä scrollataan ensin.
    public static void click(WebElement element) {
        scrollIntoView(element);
        //WorkAround.sleep(WorkAround.Delay.SHORT);
        element.click();
    }

    public static void hideMainMenu() {
        String hideScript = "jQuery($x(\"//*[contains(@class, 'header')]\")[0]).hide()";
        TestBase.driver.executeScript(hideScript);
    }

    public static void showMainMenu() {
        String hideScript = "jQuery($x(\"//*[contains(@class, 'header')]\")[0]).show()";
        TestBase.driver.executeScript(hideScript);
    }
}
