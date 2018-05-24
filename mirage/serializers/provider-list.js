import ProviderSerializer from './provider';

// commented attributes are ommitted from our real server
export default ProviderSerializer.extend({
  attrs: [
    'name',
    'packagesSelected',
    'packagesTotal',
    // 'proxy'
  ]
});
