const path = require('path');
const webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    reporters: ['progress'],
    port: 9876,

    browsers: ['Chrome'],

    files: [
      { pattern: 'tests/**/*-test.js', watched: false }
    ],

    preprocessors: {
      'tests/**/*-test.js': ['webpack']
    },

    webpack: Object.assign({}, webpackConfig, {
      // enzyme externals
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    }),

    webpackMiddleware: webpackConfig.devServer,

    mochaReporter: {
      showDiff: true
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-webpack'
    ]
  });
};
