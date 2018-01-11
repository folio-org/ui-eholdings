// Start with the base stripes webpack config.
// we'll need to make some changes in order to get
// babel-plugin-istanbul to load properly.
const webpackConfig = require('@folio/stripes-core/webpack.config.cli.dev');

module.exports = (config) => {
  let configuration = {
    reporters: ['mocha', 'BrowserStack'],

    client: {
      args: ['--coverage', config.coverage]
    },

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
    configuration.plugins.push('karma-coverage');
    configuration.reporters.push('coverage');

    // Brittle way of injecting babel-plugin-istanbul into the webpack config.
    // Should probably be moved to stripes-core when it has more test infrastructure.
    let babelLoaderConfigIndex = webpackConfig.module.rules.findIndex((rule) => {
      return rule.loader === 'babel-loader';
    });
    webpackConfig.module.rules[babelLoaderConfigIndex].options.plugins = [
      require.resolve('babel-plugin-istanbul')
    ];
  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  configuration.webpack = webpackConfig;
  config.set(configuration);
};
