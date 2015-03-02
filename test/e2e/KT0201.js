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

  //beforeEach(function() {
  //  browser.get("http://localhost:9000/harri.html");
  //});

  //var setup_data = function (d) {
  //  console.log("Data:");
  //  console.log(d);
  //
  //  return "OKOKOKOKOKOK";//$http.get(data);
  //};

  it('Käsittelijä avaa uuden hakemuskauden. Hakemuskausi avautuu.', function() {
    snapshot();

    browser.get("/katri.html");
    var kayttajanNimi = element(by.xpath('//li[@class="navbaruser"]/p[1]'));
    expect(kayttajanNimi.getText()).toContain('Katri Käsittelijä');

    //browser.pause();

    //flow = protractor.promise.controlFlow();
    //
    //flow.await(setup_data({data: 'http://localhost:9000/harri.html'})).then( function(result) {
    //  console.log(result);
    //  console.log('There');
    //});

    element(by.partialLinkText("Hakemuskaudet")).click();

    // browser.executeAsyncScript(function(callback) {
    //   var $http;
    //   $http = angular.injector(["ng"]).get("$http");
    //   return $http({
    //     url: "http://localhost:9000/api/hakemuskausi/2015/hakuohje",
    //     method: "put",
    //     headers: {
    //       'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarycN6VhuUsTjUrg9BV',
    //       'oam-remote-user': 'katri',
    //       'oam-groups': '1',
    //
    //     },
    //     dataType: "json"
    //   }).success(function() {
    //     return callback([true]);
    //   }).error(function(data, status) {
    //     return callback([false, data, status]);
    //   });
    // }).then(function(data) {
    //   var response, success;
    //   success = data[0];
    //   response = data[1];
    //   if (success) {
    //     return console.log("Browser async finished without errors");
    //   } else {
    //     return console.log("Browser async finished with errors", response);
    //   }
    // });

    element(by.partialLinkText("Käynnistä hakemuskausi")).click();
    expect(element(by.css('p.panel-title')).getText()).toContain('Avustushakemus');
  });

  it('Hakija avaa avustushakemuslomakkeen. Avustusakemuslomakkeella lukee: "PSA:n mukaisen liikenteen hankinta"', function() {
    var text;
    browser.get("/harri.html");
    element(by.partialLinkText("Omat hakemukset")).click();
    text = element(by.tagName('html')).getText();
    expect(text).toContain("" + "PSA:n mukaisen liikenteen hankinta");
    restore();
  });
});
