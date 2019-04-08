module.exports = (config) => {
  const testIndex = './test/bigtest/index.js';
  const preprocessors = {};
  preprocessors[`${testIndex}`] = ['webpack'];

  const configuration = {
    files: [
      { pattern: testIndex, watched: false },
    ],

    preprocessors,

    browserStack: {
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
      }
    }
  };

  // Add plugins not in Stripes CLI
  configuration.plugins = config.plugins;
  configuration.plugins.push('karma-browserstack-launcher');

  // Turn on coverage report thresholds
  if (configuration.coverageIstanbulReporter) {
    configuration.coverageIstanbulReporter.thresholds.global = {
      statements: 95,
      branches: 85, // should be raised after getting this % up
      functions: 95,
      lines: 95
    };
  }

  // remove hmr plugin during testing
  config.webpack.plugins = config.webpack.plugins.filter(plugin => {
    return plugin.constructor.name !== 'HotModuleReplacementPlugin';
  });

  config.set(configuration);
};
