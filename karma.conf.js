const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

module.exports = function(config) {
  let configuration = {
    frameworks: ['mocha'],
    reporters: ['mocha'],
    port: 9876,

    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      { pattern: 'tests/**/*-test.js', watched: false }
    ],

    preprocessors: {
      'tests/**/*-test.js': ['webpack']
    },

    webpack: Object.assign(webpackConfig, {
      plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'test'
        })
      ]
    }),

    webpackMiddleware: {
      stats: "errors-only"
    },

    mochaReporter: {
      showDiff: true
    },

    plugins: [
      'karma-chrome-launcher',
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
