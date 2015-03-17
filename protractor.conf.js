// See the options from:
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to the location of this config.
  specs: [
    'test/e2e/*.js'
  ],


  multiCapabilities: [{
    'browserName': 'firefox'
  }],


  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:9000',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 600000
  },

  onPrepare: function() {
    var reporters = require('jasmine-reporters');
    var junitReporter = new reporters.JUnitXmlReporter({
      savePath: 'target/xmloutput',
      consolidateAll: false
    });
    jasmine.getEnv().addReporter(junitReporter);
  },

  onComplete: function() { console.log('all done')}
};
