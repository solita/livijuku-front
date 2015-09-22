package juku.yhteinen;

import static juku.TestBase.containsText;
import static juku.TestBase.findElementsByXPath;
import static juku.TestBase.hasClass;
import static juku.TestBase.isVisible;
import static juku.util.ViewBase.linkInPosition;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;

import java.util.List;

import org.openqa.selenium.WebElement;

import com.thoughtworks.selenium.SeleneseTestNgHelper;

import juku.TestBase;

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

    public static void tarkistaHakemuksenTila(TestBase.Hakemuslaji laji, TestBase.Hakemustila tila) {
        // TODO tarkista hakemuslaji myös (otsikosta).

        List<WebElement> hakemuksenTilaIndikaattorit =
                findElementsByXPath("//span[%s and %s and %s]",
                        containsText(tila.getName()),
                        hasClass(tila.getCssClass()),
                        isVisible());

        assertThat(String.format("Hakemussivulla hakemuksen tila (%s) pitäisi näkyä kerran.", tila.getName()),
                hakemuksenTilaIndikaattorit,
                hasSize(equalTo(1)));
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
