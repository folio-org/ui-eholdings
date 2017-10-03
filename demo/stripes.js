#!/usr/bin/env node
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */

const commander = require('commander');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');
const StripesConfigPlugin = require('@folio/stripes-core/webpack/stripes-config-plugin');
const devConfig = require('@folio/stripes-core/webpack.config.cli.dev');

const stripesCorePath = path.dirname(require.resolve('@folio/stripes-core/index.html'));
const cwd = path.resolve();
const cwdModules = path.join(cwd, 'node_modules');
const coreModules = path.join(stripesCorePath, 'node_modules');

const packageJSON = require('@folio/stripes-core/package.json');

commander.version(packageJSON.version);

const cachePlugin = new HardSourceWebpackPlugin({
  cacheDirectory: path.join(cwd, 'webpackcache'),
  recordsPath: path.join(cwd, 'webpackcache/records.json'),
  configHash() {
    // Build a string value used by HardSource to determine which cache to
    // use if [confighash] is in cacheDirectory or if the cache should be
    // replaced if [confighash] does not appear in cacheDirectory.
    return require('node-object-hash')().hash(devConfig);
  }
});

// Display webpack output to the console
function processStats(err, stats) {
  if (err) {
    console.error(err);
  }
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
}

function mirage(config, enabled = false) {
  if (enabled) {
    console.info('Using Mirage Server');
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
  .option('--mirage', 'Use the mirage server to simulate the backend')
  .arguments('<config>')
  .description('Launch a webpack-dev-server')
  .action((stripesConfigFile, options) => {
    const express = require('express');
    const app = express();

    const config = Object.assign({}, devConfig);
    const stripesConfig = require(path.resolve(stripesConfigFile));
    config.plugins.push(new StripesConfigPlugin(stripesConfig));
    // Look for modules in node_modules, then the platform, then stripes-core
    config.resolve.modules = ['node_modules', cwdModules, coreModules];
    config.resolveLoader = { modules: ['node_modules', cwdModules, coreModules] };
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

    const compiler = webpack(mirage(svgloader(config), options.mirage));

    const port = options.port || process.env.STRIPES_PORT || 3000;
    const host = options.host || process.env.STRIPES_HOST || 'localhost';

    app.use(express.static(`${stripesCorePath}/public`));

    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    app.get('/favicon.ico', (req, res) => {
      res.sendFile(path.join(stripesCorePath, 'favicon.ico'));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(stripesCorePath, 'index.html'));
    });

    app.listen(port, host, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Listening at http://${host}:${port}`);
    });
  });

commander
  .command('build')
  .option('--publicPath [publicPath]', 'publicPath')
  .arguments('<config> <output>')
  .description('Build a tenant bundle')
  .action((stripesConfigFile, outputPath, options) => {
    const config = require('@folio/stripes-core/webpack.config.cli.prod');
    const stripesConfig = require(path.resolve(stripesConfigFile));
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
