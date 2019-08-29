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

  serialize() {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {
        packagesSelected: this.packagesSelected,
        proxy:this.proxy,
        providerToken: this.providerToken,
      },
    };

    return { data };
  }
}

export default model({
  type: 'providers',
  path: '/eholdings/providers'
})(Provider);
