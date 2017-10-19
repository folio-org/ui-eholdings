import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from 'mirage-server';

export default function () {
  // Okapi configs
  this.urlPrefix = okapi.url;
  this.get('/_/version', () => '0.0.0');
  this.get('/_/proxy/modules', []);
  this.get('/saml/check', {
    ssoEnabled: false
  });

  // mod-users
  this.get('/users', []);

  // mod-config
  this.get('/configurations/entries', {
    configs: []
  });

  // mod-users-bl
  this.post('/bl-users/login', () => {
    let okapiTokenHeader = () => {
      return { 'X-Okapi-Token': `myOkapiToken:${Date.now()}` };
    };

    return new Response(201,
      okapiTokenHeader(),
      {
        user: {
          username: 'testuser',
          personal: {
            lastName: 'User',
            firstName: 'Test',
            email: 'folio_admin@frontside.io',
          }
        },
        permissions: {
          permissions: []
        }
      }
    );
  });

  // e-holdings endpoints
  this.namespace = 'eholdings';

  // Package resources
  this.get('/packages', ({ packages }, request) => {
    return packages.all().filter((packageModel) => {
      const query = request.queryParams.search.toLowerCase();
      return packageModel.packageName.toLowerCase().includes(query);
    });
  });

  this.get('/vendors/:vendorId/packages/:packageId', ({ packages }, request) => {
    return packages.findBy({
      vendorId: request.params.vendorId,
      id: request.params.packageId
    });
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources }, request) => {
    return customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    });
  });

  this.put('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    });

    let { isSelected } = JSON.parse(request.requestBody);
    matchingCustomerResource.update('isSelected', isSelected).save();
  });

  // Title resources
  this.get('/titles', ({ titles }, request) => {
    return titles.all().filter((titleModel) => {
      const query = request.queryParams.search.toLowerCase();
      return titleModel.titleName.toLowerCase().includes(query);
    });
  });

  this.get('/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  // Vendor resources
  this.get('/vendors', ({ vendors }, request) => {
    return vendors.all().filter((vendorModel) => {
      let query = request.queryParams.search.toLowerCase();
      return vendorModel.vendorName.toLowerCase().includes(query);
    });
  });

  this.get('/vendors/:id', ({ vendors }, request) => {
    return vendors.find(request.params.id);
  });

  this.get('/vendors/:vendorId/packages', ({ packages }, request) => {
    return packages.where({ vendorId: request.params.vendorId });
  });

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
