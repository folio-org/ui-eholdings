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

  this.get('/notify', {
    notifications: [],
    totalRecords: 0
  });

  // e-holdings endpoints
  this.namespace = 'eholdings';

  // status
  this.get('/status', {
    data: {
      id: 'status',
      type: 'statuses',
      attributes: {
        isConfigurationValid: true
      }
    }
  });

  // configuration
  this.get('/configuration', {
    data: {
      id: 'configuration',
      type: 'configuration',
      attributes: {
        customerId: 'some-valid-customer-id',
        apiKey: 'some-valid-api-key'
      }
    }
  });

  this.put('/configuration', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  // Vendor resources
  this.get('/jsonapi/vendors', function ({ vendors }, request) { // eslint-disable-line func-names
    let json = this.serialize(vendors.all().filter((vendorModel) => {
      let query = request.queryParams.q.toLowerCase();
      return vendorModel.name.toLowerCase().includes(query);
    }));

    json.meta = { totalResults: json.data.length };
    return json;
  });

  this.get('/jsonapi/vendors/:id', ({ vendors }, request) => {
    return vendors.find(request.params.id);
  });

  // Package resources
  this.get('/jsonapi/packages', function ({ packages }, request) { // eslint-disable-line func-names
    let json = this.serialize(packages.all().filter((packageModel) => {
      const query = request.queryParams.q.toLowerCase();
      return packageModel.name.toLowerCase().includes(query);
    }));

    json.meta = { totalResults: json.data.length };
    return json;
  });

  this.get('/jsonapi/packages/:id', ({ packages }, request) => {
    return packages.findBy({
      id: request.params.id
    });
  });

  this.put('/jsonapi/packages/:id', ({ packages, customerResources }, request) => {
    let matchingPackage = packages.findBy({
      id: request.params.id
    });

    let matchingCustomerResources = customerResources.where({
      packageId: request.params.id
    });

    let body = JSON.parse(request.requestBody);
    let { isSelected } = body.data.attributes;

    let selectedCount = isSelected ? matchingCustomerResources.length : 0;

    matchingCustomerResources.update('isSelected', isSelected);
    matchingPackage.update('isSelected', isSelected);
    matchingPackage.update('selectedCount', selectedCount);
  });

  this.get('/jsonapi/packages/:packageId/customer-resources', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  // Title resources
  this.get('/jsonapi/titles', function ({ titles }, request) { // eslint-disable-line func-names
    let json = this.serialize(titles.all().filter((titleModel) => {
      const query = request.queryParams.q.toLowerCase();
      return titleModel.name.toLowerCase().includes(query);
    }));

    json.meta = { totalResults: json.data.length };
    return json;
  });

  this.get('/jsonapi/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  // Customer Resource resources
  this.get('/jsonapi/customer-resources', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  this.get('/jsonapi/customer-resources/:id', ({ customerResources }, request) => {
    return customerResources.findBy({ id: request.params.id });
  });

  this.put('/jsonapi/customer-resources/:id', ({ customerResources }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      id: request.params.id
    });

    let { isSelected } = JSON.parse(request.requestBody);
    matchingCustomerResource.update('isSelected', isSelected);
  });

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
