package juku;

import juku.TestBase;
import juku.WorkAround;
import juku.hakija.OmatHakemukset;
import juku.kasittelija.Hakemuskaudet;
import juku.kasittelija.KaikkiHakemukset;
import juku.kasittelija.Suunnittelu;
import juku.yhteinen.Hakemus;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

public class TunnuslukuTest extends TestBase {

    @Test
    public void hakijaSyottaaTunnusluvut() throws IOException, URISyntaxException {

        /************************************************************
         * Taustatiedot ja yleiset tunnusluvut
         */

        login(User.HARRI);

        findElementById("tunnusluvut").click();
        findElementById("tunnusluvut-syottaminen").click();
        if (!findElementByXPath("//select[@id='vuosi']/option[2]").isSelected()) {
            findElementByXPath("//select[@id='vuosi']/option[2]").click();
        }
        findElementById("taustatiedot-henkilosto").click();
        findElementById("taustatiedot-henkilosto").clear();
        findElementById("taustatiedot-henkilosto").sendKeys("1000");
        findElementById("taustatiedot-asiakaspalvelu").click();
        findElementById("taustatiedot-asiakaspalvelu").clear();
        findElementById("taustatiedot-asiakaspalvelu").sendKeys("10000");
        findElementById("taustatiedot-konsulttipalvelu").click();
        findElementById("taustatiedot-konsulttipalvelu").clear();
        findElementById("taustatiedot-konsulttipalvelu").sendKeys("20000");
        findElementById("taustatiedot-lipunmyyntipalkkiot").click();
        findElementById("taustatiedot-lipunmyyntipalkkiot").clear();
        findElementById("taustatiedot-lipunmyyntipalkkiot").sendKeys("30000");
        findElementById("taustatiedot-tietomaksujarjestelmat").click();
        findElementById("taustatiedot-tietomaksujarjestelmat").clear();
        findElementById("taustatiedot-tietomaksujarjestelmat").sendKeys("40000");
        findElementById("taustatiedot-muutpalvelut").click();
        findElementById("taustatiedot-muutpalvelut").clear();
        findElementById("taustatiedot-muutpalvelut").sendKeys("50000");
        findElementById("taustatiedot-kuntienlkm").click();
        findElementById("taustatiedot-kuntienlkm").clear();
        findElementById("taustatiedot-kuntienlkm").sendKeys("12345");
        findElementById("taustatiedot-vyohykkeidenlkm").click();
        findElementById("taustatiedot-vyohykkeidenlkm").clear();
        findElementById("taustatiedot-vyohykkeidenlkm").sendKeys("6");
        findElementById("taustatiedot-maapinta-ala").click();
        findElementById("taustatiedot-maapinta-ala").clear();
        findElementById("taustatiedot-maapinta-ala").sendKeys("100000");
        findElementById("taustatiedot-asukasmaara").click();
        findElementById("taustatiedot-asukasmaara").clear();
        findElementById("taustatiedot-asukasmaara").sendKeys("25000");
        findElementById("taustatiedot-tyopaikkamaara").click();
        findElementById("taustatiedot-tyopaikkamaara").clear();
        findElementById("taustatiedot-tyopaikkamaara").sendKeys("345");
        findElementById("taustatiedot-pendeloivienosuus").click();
        findElementById("taustatiedot-pendeloivienosuus").clear();
        findElementById("taustatiedot-pendeloivienosuus").sendKeys("12");
        findElementById("taustatiedot-henkiloautoliikenne").click();
        findElementById("taustatiedot-henkiloautoliikenne").clear();
        findElementById("taustatiedot-henkiloautoliikenne").sendKeys("4342346,32");
        findElementById("taustatiedot-autoistumisaste").click();
        findElementById("taustatiedot-autoistumisaste").clear();
        findElementById("taustatiedot-autoistumisaste").sendKeys("567");
        findElementById("taustatiedot-pysakkienlkm").click();
        findElementById("taustatiedot-pysakkienlkm").clear();
        findElementById("taustatiedot-pysakkienlkm").sendKeys("23");
        findElementById("taustatiedot-kertalippuvyohyke-1").click();
        findElementById("taustatiedot-kertalippuvyohyke-1").clear();
        findElementById("taustatiedot-kertalippuvyohyke-1").sendKeys("1");
        findElementById("taustatiedot-kertalippuvyohyke-2").click();
        findElementById("taustatiedot-kertalippuvyohyke-2").clear();
        findElementById("taustatiedot-kertalippuvyohyke-2").sendKeys("2");
        findElementById("taustatiedot-kertalippuvyohyke-3").click();
        findElementById("taustatiedot-kertalippuvyohyke-3").clear();
        findElementById("taustatiedot-kertalippuvyohyke-3").sendKeys("3");
        findElementById("taustatiedot-kertalippuvyohyke-4").click();
        findElementById("taustatiedot-kertalippuvyohyke-4").clear();
        findElementById("taustatiedot-kertalippuvyohyke-4").sendKeys("5");
        findElementById("taustatiedot-kertalippuvyohyke-5").click();
        findElementById("taustatiedot-kertalippuvyohyke-5").clear();
        findElementById("taustatiedot-kertalippuvyohyke-5").sendKeys("6");
        findElementById("taustatiedot-kertalippuvyohyke-6").click();
        findElementById("taustatiedot-kertalippuvyohyke-6").clear();
        findElementById("taustatiedot-kertalippuvyohyke-6").sendKeys("7");
        findElementById("taustatiedot-kausilippuvyohyke-1").click();
        findElementById("taustatiedot-kausilippuvyohyke-1").clear();
        findElementById("taustatiedot-kausilippuvyohyke-1").sendKeys("100");
        findElementById("taustatiedot-kausilippuvyohyke-2").click();
        findElementById("taustatiedot-kausilippuvyohyke-2").clear();
        findElementById("taustatiedot-kausilippuvyohyke-2").sendKeys("200");
        findElementById("taustatiedot-kausilippuvyohyke-3").click();
        findElementById("taustatiedot-kausilippuvyohyke-3").clear();
        findElementById("taustatiedot-kausilippuvyohyke-3").sendKeys("300");
        findElementById("taustatiedot-kausilippuvyohyke-4").click();
        findElementById("taustatiedot-kausilippuvyohyke-4").clear();
        findElementById("taustatiedot-kausilippuvyohyke-4").sendKeys("400");
        findElementById("taustatiedot-kausilippuvyohyke-5").click();
        findElementById("taustatiedot-kausilippuvyohyke-5").clear();
        findElementById("taustatiedot-kausilippuvyohyke-5").sendKeys("500");
        findElementById("taustatiedot-kausilippuvyohyke-6").click();
        findElementById("taustatiedot-kausilippuvyohyke-6").clear();
        findElementById("taustatiedot-kausilippuvyohyke-6").sendKeys("600");
        findElementById("taustatiedot-asiakastyytyvaisyys").click();
        findElementById("taustatiedot-asiakastyytyvaisyys").clear();
        findElementById("taustatiedot-asiakastyytyvaisyys").sendKeys("76");
        findElementById("lisatiedot").click();
        findElementById("lisatiedot").clear();
        findElementById("lisatiedot").sendKeys("Lisätietoa");
        findElementById("tallenna").click();
        findElementByXPath("//a[@id='BR']").click();
        findElementById("tallenna").click();
        findElementByXPath("//a[@id='KOS']").click();
        findElementById("tallenna").click();
        findElementByXPath("//a[@id='SA']").click();
        findElementById("tallenna").click();
        findElementByXPath("//a[@id='ME']").click();
        findElementById("tallenna").click();
        findElementByXPath("//a[@id='TTYT']").click();
    }
}
