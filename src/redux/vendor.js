import model, { hasMany } from './model';

class Vendor {
  name = '';
  packagesSelected = 0;
  packagesTotal = 0;
  packages = hasMany();
}

export default model({
  type: 'vendors',
  path: '/eholdings/vendors'
})(Vendor);
