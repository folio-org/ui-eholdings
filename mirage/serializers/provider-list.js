import ProviderSerializer from './provider';

export default ProviderSerializer.extend({
  attrs: [
    'name',
    'packagesSelected',
    'packagesTotal'
  ]
});
