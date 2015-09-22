package yhteinen;

import static juku.e2e.TestBase.findElementsByXPath;
import static juku.e2e.TestBase.isVisible;
import static util.ViewBase.linkInPosition;

import java.util.List;

import org.openqa.selenium.WebElement;

import com.thoughtworks.selenium.SeleneseTestNgHelper;

import juku.e2e.TestBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class Hakemus {
    public static WebElement uniqueFileInput() {
        List<WebElement> fileInputs = TestBase.driver.findElementsByXPath("//input[@type='file']");
        if (fileInputs.size()>1) {
            SeleneseTestNgHelper.fail("Sivulla on useita //input[@type='file'] elementtejä. Odotettiin täsmälleen yhtä.");
        }
        else if (fileInputs.size()==0) {
            SeleneseTestNgHelper.fail("Sivulla ei ole yhtään //input[@type='file'] elementtiä. Odotettiin täsmälleen yhtä.");
        }
        return fileInputs.get(0);
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

    public static List<WebElement> rahakentat() {
        return findElementsByXPath("//input[@type='text' and %s]", isVisible());
    }
}
