const webpack = require('webpack');

const environment = process.env.NODE_ENV;
let url;

if (environment === 'production') {
  url = 'https://okapi.frontside.io';
} else {
  url = 'https://okapi-sandbox.frontside.io';
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

// beforeBuild needs to return a "webpack override" function for the CLI
// It is currently passed the entire yargs argv object
function beforeBuild(options) {
  const mirageOption = options.mirage === true ? 'default' : options.mirage;
  return (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin({
      MIRAGE_SCENARIO: mirageOption || 'default'
    }));
    return mirage(config, mirageOption);
  };
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
  beforeBuild,
}

module.exports = {
  // Assign defaults to existing CLI options
  okapi: url,
  tenant: "fs",
  install: true,

  // Custom command extension
  plugins: {
    serve: servePlugin,
  },

  // Aliases 
  aliases: {
    '@folio/eholdings-demo': './demo',
  }
};
