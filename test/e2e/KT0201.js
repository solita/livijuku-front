describe('Selenium Test Case', function() {

  beforeEach(function() {
    browser.driver.get("http://localhost:9000/harri.html");
  });

  it('should execute test case without errors', function() {
    var text, value, bool, source, url, title;
    var TestVars = {};
    browser.get("http://localhost:9000/");
    element(by.css("div.panel-body.clickable")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "PSA:n mukaisen liikenteen hankinta");
  });
});
