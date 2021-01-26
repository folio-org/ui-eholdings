const babelJest = require('babel-jest');

const babelConf = require('./babel.config');

module.exports = babelJest.createTransformer(babelConf);
