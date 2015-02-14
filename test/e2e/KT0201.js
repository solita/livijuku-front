describe('Selenium Test Case', function() {

  var snapshot = function() {
    console.log('TODO: Kannan snapshot');
  };

  var restore = function() {
    console.log('TODO: Kannan restore');
  };

  //beforeAll(function() {
  //  snapshot();
  //});
  //
  //afterAll( function() {
  //  restore();
  //});

  beforeEach(function() {
    browser.get("http://localhost:9000/harri.html");
  });

  it('Käsittelijä avaa hakemuskauden. Hakemuskausi avautuu.', function() {
    snapshot();
    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');
    //browser.pause();
    element(by.partialLinkText("Hakemukset")).click();
    element(by.partialLinkText("Hakemuskauden hallinta")).click();
    element(by.partialLinkText("Käynnistä hakemuskausi")).click();
    expect(element(by.css('p.panel-title')).getText()).toContain('Avustushakemus');
  });

  it('Hakija avaa avustushakemuslomakkeen. Avustusakemuslomakkeella lukee: "PSA:n mukaisen liikenteen hankinta"', function() {
    var text;
    browser.get("/");
    element(by.partialLinkText("Omat hakemukset")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "PSA:n mukaisen liikenteen hankinta");
    restore();
  });
});
