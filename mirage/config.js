import { okapi } from 'stripes-loader';

export default function () {
  // Okapi configs
  this.urlPrefix = okapi.url;
  this.get('/_/version', {});
  this.get('/_/proxy/modules', []);

  // e-holdings endpoints
  this.urlPrefix = '';
  this.namespace = 'eholdings';

  this.get('/vendors', ({ vendors }, request) => {
    let filteredVendors = vendors.all().filter((vendorModel) => {
      let query = request.queryParams.search.toLowerCase();
      return vendorModel.vendorName.toLowerCase().includes(query);
    });

    return filteredVendors;
  });

  this.get('/vendors/:id');

  this.get('/vendors/:vendorId/packages', ({ packages }, request) => {
    return packages.where( { vendorId: request.params.vendorId } );
  });

  this.get('/vendors/:vendorId/packages/:packageId', ({ packages }, request) => {
    return packages.findBy({
      vendorId: request.params.vendorId,
      id: request.params.packageId
    });
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles', ({ customerResources, titles }, request) => {
    let matchingCustomerResources = customerResources.where( { packageId: request.params.packageId } );
    let titleIds = matchingCustomerResources.models.map((customerResource) => customerResource.titleId);
    return titles.find(titleIds);
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources, titles }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    });
    return titles.find(matchingCustomerResource.titleId)
  });

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
