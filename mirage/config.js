import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from 'mirage-server';

export default function configure() {
  this.urlPrefix = okapi.url;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('/_/proxy/modules', [{
    id: 'mod-kb-ebsco',
    name: 'kb-ebsco'
  }]);

  this.get('/_/proxy/modules/mod-kb-ebsco', {
    id: 'mod-kb-ebsco',
    name: 'kb-ebsco',
    provides: [{
      id: 'eholdings',
      version: '0.1.0',
      handlers: [{
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        pathPattern: '/eholdings/*'
      }]
    }],
    permissionSets: []
  });

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

  // mod-notify
  this.get('/notify/_self', {
    notifications: [],
    totalRecords: 0
  });

  // e-holdings endpoints
  this.namespace = 'eholdings';

  // status
  this.get('/status', {
    data: {
      type: 'status',
      attributes: {
        isConfigurationValid: true
      }
    }
  });

  // configuration
  this.get('/configuration', {
    data: {
      type: 'configuration',
      attributes: {
        customerId: 'some-valid-customer-id',
        apiKey: 'some-valid-api-key'
      }
    }
  });

  this.put('/configuration', (_, request) => {
    let data = JSON.parse(request.requestBody);
    return data;
  });

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

  this.put('/vendors/:vendorId/packages/:packageId', ({ packages, customerResources }, request) => {
    let matchingPackage = packages.findBy({
      vendorId: request.params.vendorId,
      id: request.params.packageId
    });

    let matchingCustomerResources = customerResources.where({
      packageId: request.params.packageId
    });

    let { isSelected } = JSON.parse(request.requestBody);

    matchingCustomerResources.update('isSelected', isSelected).save();
    matchingPackage.update('isSelected', isSelected).save();
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
  this.get('/jsonapi/vendors', ({ vendors }, request) => {
    return vendors.all().filter((vendorModel) => {
      let query = request.queryParams.q.toLowerCase();
      return vendorModel.name.toLowerCase().includes(query);
    });
  });

  this.get('/jsonapi/vendors/:id', ({ vendors }, request) => {
    return vendors.find(request.params.id);
  });

  this.get('/vendors/:vendorId/packages', ({ packages }, request) => {
    return packages.where({ vendorId: request.params.vendorId });
  });

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
