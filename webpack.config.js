const webpack = require('webpack');
const path = require('path');

let configuration = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: false,
    stats: 'errors-only'
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: true,
          emitWarning: true,
          failOnError: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

if (process.env.environment === 'production') {
  delete configuration.devServer;
  configuration.entry = './src/index.js';
  configuration.plugins = [];
}

module.exports = configuration;
