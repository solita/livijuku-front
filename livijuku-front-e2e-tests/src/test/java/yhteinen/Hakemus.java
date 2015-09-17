package yhteinen;

import java.util.List;

import org.openqa.selenium.WebElement;

import com.thoughtworks.selenium.SeleneseTestNgHelper;

import juku.e2e.TestBase;
import util.ViewBase;

/**
 * Created by petrisi on 16.9.15.
 */
public class Hakemus extends ViewBase {
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

}
