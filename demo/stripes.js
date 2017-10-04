#!/usr/bin/env node

const commander = require('commander');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');
const fs = require('fs');
const nodeObjectHash = require('node-object-hash');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const connectHistoryApiFallback = require('connect-history-api-fallback');

const StripesConfigPlugin = require('@folio/stripes-core/webpack/stripes-config-plugin');

const stripesCorePath = path.dirname(require.resolve('@folio/stripes-core/index.html'));
const cwd = path.resolve();
const cwdModules = path.join(cwd, 'node_modules');
const coreModules = path.join(stripesCorePath, 'node_modules');

const packageJSON = require('@folio/stripes-core/package.json');

commander.version(packageJSON.version);

const cachePlugin = new HardSourceWebpackPlugin({
  cacheDirectory: path.join(cwd, 'webpackcache'),
  recordsPath: path.join(cwd, 'webpackcache/records.json'),
  configHash(webpackConfig) {
    // Build a string value used by HardSource to determine which cache to
    // use if [confighash] is in cacheDirectory or if the cache should be
    // replaced if [confighash] does not appear in cacheDirectory.
    return nodeObjectHash().hash(webpackConfig);
  }
});

// Display webpack output to the console
function processStats(err, stats) {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  }
  console.log(stats.toString({ // eslint-disable-line no-console
    chunks: false,
    colors: true
  }));
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

function svgloader(config) {
  let module = config.module;
  return Object.assign({}, config, {
    module: Object.assign({}, module, {
      loaders: [
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          loader: 'svg-react-loader',
          query: {
            classIdPrefix: '[name]-[hash:8]__',
            filters: [
              (value) => { // eslint-disable-line no-unused-vars
                this.update(newvalue); // eslint-disable-line no-undef
              }
            ],
            propsMap: {
              fillRule: 'fill-rule',
              foo: 'bar'
            },
            xmlnsTest: /^xmlns.*$/
          }
        }
      ]
    })
  });
}

commander
  .command('dev')
  .option('--port [port]', 'Port')
  .option('--host [host]', 'Host')
  .option('--cache', 'Use HardSourceWebpackPlugin cache')
  .option('--devtool [devtool]', 'Use another value for devtool instead of "inline-source-map"')
  .option('--mirage [scenario]', 'Use the mirage server to simulate the backend', (scenario) => {
    let validScenario = scenario === true ? 'default' : scenario;

    if (!fs.existsSync(path.join(__dirname, '../mirage/scenarios', `${validScenario}.js`))) {
      console.warn(`Unable to find mirage scenario "${validScenario}"`); // eslint-disable-line no-console
      return 'default';
    } else {
      return validScenario;
    }
  })
  .arguments('<config>')
  .description('Launch a webpack-dev-server')
  .action((stripesConfigFile, options) => {
    const mirageOption = options.mirage === true ? 'default' : options.mirage;
    const app = express();
    const devConfig = require('@folio/stripes-core/webpack.config.cli.dev'); // eslint-disable-line
    const config = Object.assign({}, devConfig);
    const stripesConfig = require(path.resolve(stripesConfigFile)); // eslint-disable-line
    config.plugins.push(new StripesConfigPlugin(stripesConfig));
    // Look for modules in node_modules, then the platform, then stripes-core
    config.resolve.modules = ['node_modules', cwdModules, coreModules];
    config.resolveLoader = { modules: ['node_modules', cwdModules, coreModules] };
    config.plugins.push(new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      MIRAGE_SCENARIO: mirageOption || 'default'
    }));
    if (options.cache) config.plugins.push(cachePlugin);
    if (options.devtool) config.devtool = options.devtool;

    // Show eslint failures at runtime
    config.module.rules.push({
      test: /src\/.*\.js$/,
      loader: 'eslint-loader',
      options: {
        emitWarning: true
      }
    });

    const compiler = webpack(mirage(svgloader(config), mirageOption));

    const port = options.port || process.env.STRIPES_PORT || 3000;
    const host = options.host || process.env.STRIPES_HOST || 'localhost';

    app.use(express.static(`${stripesCorePath}/public`));

    // Process index rewrite before webpack-dev-middleware
    // to respond with webpack's dist copy of index.html
    app.use(connectHistoryApiFallback({}));

    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));

    app.use(webpackHotMiddleware(compiler));

    app.get('/favicon.ico', (req, res) => {
      res.sendFile(path.join(stripesCorePath, 'favicon.ico'));
    });

    app.listen(port, host, (err) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
        return;
      }

      console.log(`Listening at http://${host}:${port}`); // eslint-disable-line no-console
    });
  });

commander
  .command('build')
  .option('--publicPath [publicPath]', 'publicPath')
  .arguments('<config> <output>')
  .description('Build a tenant bundle')
  .action((stripesConfigFile, outputPath, options) => {
    const prodConfig = require('@folio/stripes-core/webpack.config.cli.prod'); // eslint-disable-line
    const config = Object.assign({}, prodConfig);
    const stripesConfig = require(path.resolve(stripesConfigFile)); // eslint-disable-line
    config.plugins.push(new StripesConfigPlugin(stripesConfig));
    config.resolve.modules = ['node_modules', cwdModules];
    config.resolveLoader = { modules: ['node_modules', cwdModules] };
    config.output.path = path.resolve(outputPath);
    if (options.publicPath) {
      config.output.publicPath = options.publicPath;
    }
    const compiler = webpack(mirage(svgloader(config)));
    compiler.run((err, stats) => {
      processStats(err, stats);
    });
  });

commander.parse(process.argv);

// output help if no command specified
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
