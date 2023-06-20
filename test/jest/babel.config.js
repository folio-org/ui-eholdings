module.exports = {
  'presets': [
    '@babel/preset-env',
    [
      '@babel/preset-react', {
        'runtime': 'automatic',
      },
    ],
  ],
  'plugins': [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    // when building a platform directly, i.e. outside a workspace,
    // babel complains loudly and repeatedly that when these modules are enabled:
    // * @babel/plugin-proposal-class-properties,
    // * @babel/plugin-proposal-private-methods and
    // * @babel/plugin-proposal-private-property-in-object
    // the "loose" option must be the same for all three.
    // but @babel/preset-env sets it to false for ...private-methods.
    // overriding it here silences the complaint. STRWEB-12
    ['@babel/plugin-transform-class-properties', { 'loose': true }],
    ['@babel/plugin-transform-private-methods', { 'loose': true }],
    ['@babel/plugin-transform-private-property-in-object', { 'loose': true }],
    '@babel/plugin-transform-runtime',
  ],
};
