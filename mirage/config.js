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

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
