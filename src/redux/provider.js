import model, { hasMany } from './model';

class Provider {
  name = '';
  packagesSelected = 0;
  packagesTotal = 0;
  packages = hasMany();
}

export default model({
  type: 'providers',
  path: '/eholdings/providers'
})(Provider);
