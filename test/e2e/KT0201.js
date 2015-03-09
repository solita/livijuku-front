describe('Selenium Test Case', function() {

  var path = require('path');

  var db_http_service = process.env.DB_HTTP_SERVICE || "http://juku:juku@localhost:50000";

  var makeGet = function (d) {
    return require('http').get(d);
  };

  var unhideFileInputs = function () {
    browser.executeScript(function () {
      $('input[type="file"]').removeClass('hidden-file-input');
    });
  };

  beforeEach(function() {
    // Lokitetaan selaimen konsolotuloste
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

  it('Tehdään restorepoint "beforeAll", johon palautetaan kanta testien jälkeen', function() {
    browser.wait( function() {
      return makeGet(db_http_service + '/juku/testing.create_restorepoint?restorepoint=beforeAll');
    }, 30000);
  });

  function waitForInfoBox() {
    var infoBox = element(by.xpath('//div[@class="toast-message"]'));

    browser.wait(function () {
      return browser.isElementPresent(infoBox);
    }, 30000);
    return infoBox;
  }

  it('Käsittelijä lisää hakuohjeen hakukaudelle. Hakuohjeen lisääminen onnistuu.', function() {
    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    var fileToUpload = 'test.pdf';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    console.log(absolutePath); // lokitetaan toistaiseksi, kunnes nähdään onko ok Jenkinsissä
    unhideFileInputs();
    browser.$('input[type="file"]').sendKeys(absolutePath);

    var infoBox = waitForInfoBox();

    expect(infoBox.getText()).toContain("onnistui.");
  });

  it('Käsittelijä avaa hakukauden. Hakukausi avautuu.', function() {

    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    element(by.xpath('//button[normalize-space(text())="Käynnistä hakemuskausi"]')).click();

    var infoBox = waitForInfoBox();

    expect(infoBox.getText()).toContain('Hakemuskausi: 2016 luonti onnistui.');

  });

  //it('Hakija avaa avustushakemuslomakkeen. Avustusakemuslomakkeella lukee: "PSA:n mukaisen liikenteen hankinta"', function() {
  //  var text;
  //  browser.get("/harri.html");
  //  //browser.pause();
  //  element(by.partialLinkText("Omat hakemukset")).click();
  //  text = element(by.tagName('html')).getText();
  //  expect(text).toContain("" + "PSA:n mukaisen liikenteen hankinta");
  //  restore();
  //});

  it('Palautetaan kanta takaisin restorepointiin "beforeAll"', function() {
    browser.wait( function() {
      return makeGet(db_http_service + '/juku/testing.revert_to?restorepoint=beforeAll');
    }, 30000);
  });
});
