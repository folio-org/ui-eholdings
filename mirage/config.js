import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from 'mirage-server';

/**
 * Helper for creating a search route for a resource type.
 * Currently includes pagination and searching by name.
 * @param {String} resourceType - resource type's model name
 * @returns {Function} route handler for a search route of this
 * resource type
 */
function searchRouteFor(resourceType) {
  return function (schema, req) { // eslint-disable-line func-names
    let query = req.queryParams.q.toLowerCase();
    let page = Math.max(parseInt(req.queryParams.page || 1, 10), 1);
    let count = parseInt(req.queryParams.count || 25, 10);
    let offset = (page - 1) * count;

    let collection = schema[resourceType];
    let json = this.serialize(collection.all().filter((model) => {
      return model.name && model.name.toLowerCase().includes(query);
    }));

    json.meta = { totalResults: json.data.length };
    json.data = json.data.slice(offset, offset + count);
    return json;
  };
}

// typical mirage config export
export default function configure() {
  this.urlPrefix = okapi.url;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('/_/proxy/modules', [{
    id: 'mod-kb-ebsco',
    name: 'kb-ebsco'
  }]);

  this.get('_/proxy/tenants/:id/modules', [{
    id: 'mod-kb-ebsco'
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
      type: 'configurations',
      attributes: {
        customerId: 'some-valid-customer-id',
        apiKey: 'some-valid-api-key'
      }
    }
  });

  this.put('/configuration', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  // Provider resources
  this.get('/providers', searchRouteFor('providers'));

  this.get('/providers/:id', ({ providers }, request) => {
    return providers.find(request.params.id);
  });

  // Package resources
  this.get('/packages', searchRouteFor('packages'));

  this.get('/packages/:id', ({ packages }, request) => {
    return packages.findBy({
      id: request.params.id
    });
  });

  this.put('/packages/:id', ({ packages, customerResources }, request) => {
    let matchingPackage = packages.findBy({
      id: request.params.id
    });

    let matchingCustomerResources = customerResources.where({
      packageId: request.params.id
    });

    let body = JSON.parse(request.requestBody);
    let { isSelected } = body.data.attributes;

    let { visibilityData } = body.data.attributes;

    let selectedCount = isSelected ? matchingCustomerResources.length : 0;

    matchingCustomerResources.update('isSelected', isSelected);
    matchingCustomerResources.update('visibilityData', visibilityData);
    matchingPackage.update('isSelected', isSelected);
    matchingPackage.update('selectedCount', selectedCount);
    matchingPackage.update('visibilityData', visibilityData);

    return matchingPackage;
  });

  this.get('/packages/:packageId/customer-resources', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  // Title resources
  this.get('/titles', searchRouteFor('titles'));

  this.get('/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  // Customer Resource resources
  this.get('/customer-resources', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  this.get('/customer-resources/:id', ({ customerResources }, request) => {
    return customerResources.findBy({ id: request.params.id });
  });

  this.put('/customer-resources/:id', ({ customerResources }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      id: request.params.id
    });

    let body = JSON.parse(request.requestBody);
    let { isSelected } = body.data.attributes;
    let { visibilityData } = body.data.attributes;

    matchingCustomerResource.update('isSelected', isSelected);
    matchingCustomerResource.update('visibilityData', visibilityData);

    return matchingCustomerResource;
  });

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
