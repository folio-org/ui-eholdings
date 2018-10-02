const webpack = require('webpack');

const environment = process.env.NODE_ENV;

function mirage(config, enabled = false) {
  if (enabled) {
    console.info('Using Mirage Server'); // eslint-disable-line no-console
    return Object.assign({}, config, {
      entry: ['./test/bigtest/network/boot'].concat(config.entry)
    });
  } else {
    return config;
  }
}

const servePlugin = {
  // Standard yargs options object
  options: {
    'mirage [scenario]': {
      describe: 'Enable Mirage Server and specify a scenario',
      type: 'string',
      group: 'Mirage Server',
    },
  },
  // Stripes CLI hook into "webpackOverrides"
  beforeBuild: (options) => {
    const mirageOption = options.mirage === true ? 'default' : options.mirage;
    return (config) => {
      config.plugins.push(new webpack.EnvironmentPlugin({
        MIRAGE_SCENARIO: mirageOption || 'default'
      }));
      return mirage(config, mirageOption);
    };
  },
}

module.exports = {
  // Assign defaults to existing CLI options
  hasAllPerms: true,
  logCategories: '',

  // Custom command extension
  plugins: {
    serve: servePlugin
  }
};
