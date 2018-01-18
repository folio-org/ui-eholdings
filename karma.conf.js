module.exports = (config) => {
  let configuration = {
    reporters: ['mocha', 'BrowserStack'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      bs_safari_11: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'High Sierra',
        browser: 'safari',
        browser_version: '11.0'
      }
    }
  };

  // Turn on coverage reports if --coverage option set
  if (config.coverage) {
    configuration.coverageReporter = {
      type: 'text',
      includeAllSources: true,
      check: {
        global: { // thresholds under which karma will return failure
          statements: 95,
          branches: 85, // should be raised after getting this % up
          functions: 95,
          lines: 95
        }
      }
    };
    configuration.reporters.push('coverage');
  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
