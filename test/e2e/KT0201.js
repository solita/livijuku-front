describe('Selenium Test Case', function() {

  var path = require('path');

  var snapshot = function() {
    console.log('TODO: Kannan snapshot');
  };

  var restore = function() {
    console.log('TODO: Kannan restore');
  };

  var unhideFileInputs = function () {
    browser.executeScript(function () {
      $('input[type="file"]').removeClass('hidden-file-input');
    });
  };

  beforeEach(function() {
    // snapshot();
    // Lokitetaan selaimen konsolotuloste
    browser.manage().logs().get('browser').then(function(browserLog) {
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

  //afterAll( function() {
  //  restore();
  //});

  //var setup_data = function (d) {
  //  console.log("Data:");
  //  console.log(d);
  //
  //  return "OKOKOKOKOKOK";//$http.get(data);
  //};

  it('Käsittelijä lisää hakuohjeen hakukaudelle. Hakuohjeen lisääminen onnistuu.', function() {
    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    element(by.partialLinkText("Hakemuskaudet")).click();

    var fileToUpload = 'test.pdf';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    console.log(absolutePath); // lokitetaan toistaiseksi, kunnes nähdään onko ok Jenkinsissä
    //unhideFileInputs();
    browser.$('input[type="file"]').sendKeys(absolutePath);

    var infoBox=element(by.xpath('//div[@class="toast-message"]'));

    browser.wait(function() {
      return browser.isElementPresent(infoBox);
    }, 30000);

    expect(infoBox.getText()).toContain("onnistui.");

    element(by.xpath("//*[normalize-space(text())='Käynnistä hakemuskausi']")).click();

    expect(element(by.css('p.panel-title')).getText()).toContain('Avustushakemus');
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
});
