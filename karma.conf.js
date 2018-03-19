module.exports = (config) => {
  let configuration = {
    reporters: ['mocha', 'BrowserStack'],

    browserDisconnectTimeout: 3e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 3e5,
    captureTimeout: 3e5,

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
    },

    browserStack: {
      username: 'folioproject1',
      project: 'ui-eholdings'
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-browserstack-launcher',
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-junit-reporter'
    ]
  };

  // Also run junit reporter on CircleCI
  if (process.env.CIRCLECI) {
    configuration.reporters.push('junit');
    configuration.junitReporter = {
      outputDir: 'artifacts/junit/Karma'
    };
  }

  // Turn on coverage reports if --coverage option set
  if (config.coverage) {
    configuration.coverageReporter = {
      dir: 'artifacts/coverage',
      subdir: '.',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', file: 'lcov.txt' }
      ],
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
    configuration.plugins.push('karma-coverage');
  }

  config.set(configuration);
};
