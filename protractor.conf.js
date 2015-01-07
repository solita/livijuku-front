exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://livijuku.local.solita.fi:4444/wd/hub',

  // Spec patterns are relative to the location of this config.
  specs: [
    'test/e2e/*.js'
  ],


  multiCapabilities: [{
    'browserName': 'firefox'
  }],


  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://livijuku.local.solita.fi:9000',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 10000
  }
};
