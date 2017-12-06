const path = require('path');
const webpack = require('webpack');

// Start with the base stripes webpack config.
// we'll need to make some changes in order to get
// karma-webpack to load properly.
const webpackConfig = require('@folio/stripes-core/webpack.config.cli.dev');

// This is not a separate platform, so we need to stub out our own
// stripes config. Whenever code in the application, or in stripes
// itself does `import 'stripes-config'`, it will find our test
// config.
//
// Note that stripes has its own rules for handling the
// `stripes-config` package, so we have to remove its custom rule above.
webpackConfig.resolve.alias['stripes-config'] = path.resolve(__dirname, 'tests/stripes.config.js');

// The webpack config provided by stripes-core, contains the `stripes-config` module which uses
// itself as a loader. We turn this off by finding the rule and
// removing it from the webpack config, so that our own shim for the
// `stripes-config` module does not get overriden.
// see `@folio/stripes-config`
// see `@folio/stripes-core/webpack.config.base.js`
webpackConfig.module.rules = webpackConfig.module.rules.filter((rule) => {
  return !rule.use || !rule.use.some(use => use.loader === '@folio/stripes-config');
});

webpackConfig.plugins = [];

// make sure that the NODE_ENV is available in browser code.
webpackConfig.plugins.push(new webpack.EnvironmentPlugin({
  NODE_ENV: 'test'
}));

module.exports = (config) => {
  let configuration = {
    frameworks: ['mocha'],
    reporters: ['mocha', 'BrowserStack'],
    port: 9876,

    browsers: ['Chrome'],

    browserStack: {
      username: 'folioproject1',
      project: 'ui-eholdings'
    },

    // define browsers
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
    },

    files: [
      { pattern: 'tests/index.js', watched: false }
    ],

    preprocessors: {
      'tests/index.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    mochaReporter: {
      showDiff: true
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-browserstack-launcher',
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter'
    ]
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
