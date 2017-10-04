import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved

export default function () {
  // Okapi configs
  this.urlPrefix = okapi.url;
  this.get('/_/version', () => '0.0.0');
  this.get('/_/proxy/modules', []);
  this.get('/saml/check', {
    ssoEnabled: false
  });

  // e-holdings endpoints
  this.namespace = 'eholdings';

  // Package resources
  this.get('/packages', ({ packages }, request) => packages.all().filter((packageModel) => {
    const query = request.queryParams.search.toLowerCase();
    return packageModel.packageName.toLowerCase().includes(query);
  }));

  this.get('/vendors/:vendorId/packages/:packageId', ({ packages }, request) => packages.findBy({
    vendorId: request.params.vendorId,
    id: request.params.packageId
  }));

  this.get('/vendors/:vendorId/packages/:packageId/titles', ({ customerResources }, request) => customerResources.where({ packageId: request.params.packageId }));

  this.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources }, request) => customerResources.findBy({
    packageId: request.params.packageId,
    titleId: request.params.titleId
  }));

  this.put('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    });

    let { isSelected } = JSON.parse(request.requestBody);
    matchingCustomerResource.update('isSelected', isSelected).save();
  });

  // Title resources
  this.get('/titles', ({ titles }, request) => titles.all().filter((titleModel) => {
    const query = request.queryParams.search.toLowerCase();
    return titleModel.titleName.toLowerCase().includes(query);
  }));

  this.get('/titles/:id', ({ titles }, request) => titles.find(request.params.id));

  // Vendor resources
  this.get('/vendors', ({ vendors }, request) => vendors.all().filter((vendorModel) => {
    let query = request.queryParams.search.toLowerCase();
    return vendorModel.vendorName.toLowerCase().includes(query);
  }));

  this.get('/vendors/:id', ({ vendors }, request) => vendors.find(request.params.id));

  this.get('/vendors/:vendorId/packages', ({ packages }, request) => packages.where({ vendorId: request.params.vendorId }));

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
