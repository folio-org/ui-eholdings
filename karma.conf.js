module.exports = (config) => {
  let configuration = {
    browserStack: {
      username: 'folioproject1',
      project: 'ui-eholdings'
    },

    browserDisconnectTimeout: 3e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 3e5,
    captureTimeout: 3e5,

    customLaunchers: {
      bs_safari_11: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'High Sierra',
        browser: 'safari',
        browser_version: '11.0'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '57.0',
        os: 'OS X',
        os_version: 'Sierra'
      },
      bs_ieEdge_windows: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '15.0',
        os: 'Windows',
        os_version: '10'
      },
      bs_ie11_windows: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '7'
      }
    }
  };

  // Add plugins not in Stripes CLI
  configuration.plugins = config.plugins;
  configuration.plugins.push('karma-firefox-launcher');
  configuration.plugins.push('karma-browserstack-launcher');

  // Set output directory for junit reporter
  if (config.junitReporter) {
    configuration.junitReporter = {
      outputDir: 'artifacts/junit/Karma'
    };
  }

  // Turn on coverage report thresholds
  if (configuration.coverageReporter) {
    configuration.coverageReporter.check.global = {
      statements: 95,
      branches: 85, // should be raised after getting this % up
      functions: 95,
      lines: 95
    };
  }

  config.set(configuration);
};
