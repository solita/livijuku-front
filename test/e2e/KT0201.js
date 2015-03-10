'use strict';
describe('Selenium Test Case', function () {

  var path = require('path');

  var db_http_service = process.env.DB_HTTP_SERVICE || "http://juku:juku@localhost:50000";

  function makeGet(url) {
    return require('http').get(url);
  }

  function unhideFileInputs() {
    browser.executeScript(function () {
      $('input[type="file"]').removeClass('hidden-file-input');
    });
  }

  function createRestorePoint(restorePointName) {
    browser.wait(function () {
      return makeGet(db_http_service + '/juku/testing.create_restorepoint?restorepoint=' + restorePointName);
    }, 30000);
  }

  function revertTo(restorePointName) {
    browser.wait(function () {
      return makeGet(db_http_service + '/juku/testing.revert_to?restorepoint=' + restorePointName);
    }, 30000);
  }

  beforeAll(function() {
    createRestorePoint("beforeAll");
  });

  afterAll(function () {
    revertTo("beforeAll");
    // Jos DEBUG on päällä, Lokitetaan selaimen konsolituloste.
    if (process.env.DEBUG) {
      browser.manage().logs().get('browser').then(function (browserLog) {
        console.log('browser console log: ' + require('util').inspect(browserLog));
      });
    }
  });

  function waitForInfoBox(partialText) {
    var infoBox = element(by.xpath('//div[@class="toast-message" and contains(normalize-space(text()), "' + partialText + '")]'));

    browser.wait(function () {
      return browser.isElementPresent(infoBox);
    }, 30000);

    return infoBox;
  }

  it('Käsittelijä lisää hakuohjeen hakukaudelle. Hakuohjeen lisääminen onnistuu.', function () {
    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    var fileToUpload = 'test.pdf';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    unhideFileInputs();
    browser.$('input[type="file"]').sendKeys(absolutePath);

    var infoBox = waitForInfoBox('Hakuohjeen: test.pdf lataus vuodelle:2016 onnistui.');

    expect(infoBox.getText()).toContain("Hakuohjeen: test.pdf lataus vuodelle:2016 onnistui.");

  });

  it('Käsittelijä avaa hakukauden. Hakukausi avautuu.', function () {

    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    element(by.xpath('//button[normalize-space(text())="Käynnistä hakemuskausi"]')).click();

    var infoBox = waitForInfoBox('Hakemuskausi: 2016 luonti onnistui.');

    expect(infoBox.getText()).toContain('Hakemuskausi: 2016 luonti onnistui.');

  });

  it('Hakija avaa avustushakemuslomakkeen. Avustusakemuslomakkeella lukee: "PSA:n mukaisen liikenteen hankinta"', function () {
    browser.get("/harri.html");
    element(by.partialLinkText("Omat hakemukset")).click();
    //expect(element(by.xpath("//*[@class='panel-title' and normalize-space(text())='PSA:n mukaisen liikenteen hankinta']"))).toBeDefined();
  });

});
