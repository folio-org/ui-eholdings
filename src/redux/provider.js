import model, { hasMany } from './model';

class Provider {
  name = '';
  packagesSelected = 0;
  packagesTotal = 0;
  packages = hasMany();
  proxy = {};
  providerToken = {};
  tags = {
    tagList: []
  };
}

export default model({
  type: 'providers',
  path: '/eholdings/providers'
})(Provider);
