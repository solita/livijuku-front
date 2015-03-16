'use strict';
describe('Selenium Test Case', function () {

  //************************************************************************************
  // HUOM! Selkeyden vuoksi, pidetään niin, että xpath-merkkijonot kirjoitetaan
  // yksinkertaisiin hipsuihin ja niiden sisällä olevat merkkijonot ovat tuplahipsuissa
  //************************************************************************************

  var path = require('path');

  var db_http_service = process.env.DB_HTTP_SERVICE || "http://juku:juku@localhost:50000";
  var debug = process.env.DEBUG || 0;

  // Protractor oletus timeout on 10000, joten tämän kannattaa olla pienempi
  var DEFAULT_TIMEOUT=9000;

  function hasClass(classname) {
    // http://stackoverflow.com/questions/8808921/selecting-a-css-class-with-xpath
    return 'contains(concat(" ", normalize-space(@class), " "), " ' + classname + ' ")';
  }
  function containsText(text) {
    return 'contains(normalize-space(text()),"' + text + '")';
  }

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
    }, DEFAULT_TIMEOUT);
  }

  function revertTo(restorePointName) {
    browser.wait(function () {
      return makeGet(db_http_service + '/juku/testing.revert_to?restorepoint=' + restorePointName);
    }, DEFAULT_TIMEOUT);
  }

  beforeAll(function() {
    createRestorePoint("beforeAll");
  });

  afterAll(function () {
    revertTo("beforeAll");
    // Jos DEBUG on päällä, Lokitetaan selaimen konsolituloste.
    if (debug) {
      browser.manage().logs().get('browser').then(function (browserLog) {
        console.log('browser console log: ' + require('util').inspect(browserLog));
      });
    }
  });

  function waitForInfoBox(partialText) {
    var infoBox = element(by.xpath('//div[@class="toast-message" and ' + containsText(partialText) + ']'));

    browser.wait(function () {
      return browser.isElementPresent(infoBox);
    }, DEFAULT_TIMEOUT);

    return infoBox;
  }

  it('Käsittelijä lisää hakuohjeen hakukaudelle.' +
  ' -> Hakuohjeen lisääminen onnistuu.', function () {

    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[' + hasClass("navbaruser") + ']/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    var fileToUpload = 'test.pdf';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    unhideFileInputs();
    browser.$('input[type="file"]').sendKeys(absolutePath);

    var infoBox = waitForInfoBox('Hakuohjeen: test.pdf lataus vuodelle:2016 onnistui.');

    expect(infoBox.getText()).toContain("Hakuohjeen: test.pdf lataus vuodelle:2016 onnistui.");

  });

  it('Käsittelijä avaa hakukauden.' +
  ' -> Hakukausi avautuu.', function () {

    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[' + hasClass("navbaruser") + ']/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    element(by.xpath('//button[' + containsText("Käynnistä hakemuskausi") + ']')).click();

    var infoBox = waitForInfoBox('Hakemuskausi: 2016 luonti onnistui.');

    expect(infoBox.getText()).toContain('Hakemuskausi: 2016 luonti onnistui.');

  });

  it('Käsittelijä muokkaa hakuaikoja (LIVIJUKU-167). ' +
     ' -> hakuaikojen tallennus onnistui', function () {

    browser.get("/katri.html");

    element(by.partialLinkText('Hakemuskaudet')).click();
    element(by.partialLinkText("Muokkaa hakuaikoja")).click();

    var input = element(by.xpath('//input[@ng-model="$parent.avustushakemusAlkupvm"]'));

    input.clear();
    input.sendKeys("01.09.2015");

    element(by.partialLinkText("Tallenna hakuajat")).click();

    var infoBox = waitForInfoBox("Hakuaikojen: tallennus vuodelle 2016 onnistui.");

    expect(infoBox.getText()).toContain('Hakuaikojen: tallennus vuodelle 2016 onnistui.');

  });

});
