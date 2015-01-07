describe('Selenium Test Case', function() {

  beforeEach(function() {
    browser.driver.get("http://livijuku.local.solita.fi:9000/");
    browser.manage().addCookie('oam-remote-user', 'harri', '/', 'livijuku.local.solita.fi');
  });

  it('should execute test case without errors', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};
    browser.get("http://livijuku.local.solita.fi:9000/");
    element(by.css("div.panel-body.clickable")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "PSA:n mukaisen liikenteen hankinta");
  });
});
