const webpack = require('webpack');

const environment = process.env.NODE_ENV;
let url;

if (environment === 'sandbox') {
  url = 'https://okapi-sandbox.frontside.io';
} else {
  url = 'https://okapi.frontside.io';
}

function mirage(config, enabled = false) {
  if (enabled) {
    console.info('Using Mirage Server'); // eslint-disable-line no-console
    return Object.assign({}, config, {
      entry: ['./demo/boot-mirage'].concat(config.entry)
    });
  } else {
    return config;
  }
}

const buildPlugin = {
  beforeBuild: (options) => {
    return (config) => {
      // Shove babel-plugin-remove-jsx-attributes into babel plugins
      // Should be moved to stripes-core as soon as we feel comfortable with its effectiveness
      let babelLoaderConfigIndex = config.module.rules.findIndex((rule) => {
        return rule.loader === 'babel-loader';
      });

      // Remove all data-test or data-test- attributes
      config.module.rules[babelLoaderConfigIndex].options.plugins = [
        [require.resolve('babel-plugin-remove-jsx-attributes'), {
          patterns: ['^data-test.*$']
        }]
      ];

      return config;
    };
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

const testPlugin = {
  beforeBuild: (options) => {
    return (config) => {
      let babelLoaderConfigIndex = config.module.rules.findIndex((rule) => {
        return rule.loader === 'babel-loader';
      });

      if(!config.module.rules[babelLoaderConfigIndex].options.plugins) {
        config.module.rules[babelLoaderConfigIndex].options.plugins = [];
      }

      // Make decorators possible
      config.module.rules[babelLoaderConfigIndex].options.plugins.push(
        [require.resolve('babel-plugin-transform-decorators-legacy')]
      );

      return config;
    };
  },
}

module.exports = {
  // Assign defaults to existing CLI options
  okapi: url,
  tenant: "fs",
  install: true,

  // Custom command extension
  plugins: {
    build: buildPlugin,
    serve: servePlugin,
    test: testPlugin,
  },

  // Aliases
  aliases: {
    '@folio/eholdings-demo': './demo',
  }
};
