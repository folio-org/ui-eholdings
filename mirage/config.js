import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from '@bigtest/mirage';
import { searchRouteFor, nestedResourceRouteFor, includesWords } from './helpers';

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
      });
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
    let provider = providers.find(request.params.id);

    if (provider && provider.packages.length > 25) {
      provider.packages = provider.packages.slice(0, 25);
    }

    return provider;
  });

  this.get('/providers/:id/packages', nestedResourceRouteFor('provider', 'packages'));

  // Package resources
  this.get('/packages', searchRouteFor('packages', (pkg, req) => {
    let query = req.queryParams.q.toLowerCase();
    let params = req.queryParams;
    let type = params['filter[type]'];
    let selected = params['filter[selected]'];
    let filtered = pkg.name && includesWords(pkg.name, query);

    if (filtered && type && type !== 'all') {
      filtered = pkg.contentType.toLowerCase() === type;
    }

    if (filtered && selected) {
      filtered = pkg.isSelected.toString() === selected;
    }

    return filtered;
  }));

  this.get('/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  this.get('/packages/:id', ({ packages }, request) => {
    let pkg = packages.find(request.params.id);

    if (pkg && pkg.customerResources.length > 25) {
      pkg.customerResources = pkg.customerResources.slice(0, 25);
    }

    return pkg;
  });

  this.put('/packages/:id', ({ packages, customerResources }, request) => {
    let matchingPackage = packages.find(request.params.id);
    let matchingCustomerResources = customerResources.where({
      packageId: request.params.id
    });

    let body = JSON.parse(request.requestBody);
    let {
      isSelected,
      allowKbToAddTitles,
      customCoverage,
      visibilityData,
      name,
      contentType
    } = body.data.attributes;

    let selectedCount = isSelected ? matchingCustomerResources.length : 0;

    matchingCustomerResources.update('isSelected', isSelected);
    matchingCustomerResources.update('visibilityData', visibilityData);
    matchingPackage.update('isSelected', isSelected);
    matchingPackage.update('customCoverage', customCoverage);
    matchingPackage.update('selectedCount', selectedCount);
    matchingPackage.update('visibilityData', visibilityData);
    matchingPackage.update('allowKbToAddTitles', allowKbToAddTitles);
    matchingPackage.update('name', name);
    matchingPackage.update('contentType', contentType);

    return matchingPackage;
  });

  this.get('/packages/:id/customer-resources', nestedResourceRouteFor('package', 'customerResources'));

  // Title resources
  this.get('/titles', searchRouteFor('titles', (title, req) => {
    let params = req.queryParams;
    let type = params['filter[type]'];
    let selected = params['filter[selected]'];
    let name = params['filter[name]'];
    let isxn = params['filter[isxn]'];
    let subject = params['filter[subject]'];
    let publisher = params['filter[publisher]'];
    let filtered = true;

    if (name) {
      filtered = title.name && includesWords(title.name, name);
    } else if (isxn) {
      filtered = title.identifiers && title.identifiers.some(i => includesWords(i.id, isxn));
    } else if (subject) {
      filtered = title.subjects && title.subjects.some(s => includesWords(s.subject, subject));
    } else if (publisher) {
      filtered = title.publisherName && includesWords(title.publisherName, publisher);
    }

    if (filtered && type && type !== 'all') {
      filtered = title.publicationType.toLowerCase() === type;
    }

    if (filtered && selected) {
      filtered = title.customerResources.models.some((resource) => {
        return resource.isSelected.toString() === selected;
      });
    }

    return filtered;
  }));

  this.get('/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  // Customer Resource resources
  this.get('/customer-resources', ({ customerResources }, request) => {
    return customerResources.where({ packageId: request.params.packageId });
  });

  this.get('/customer-resources/:id', ({ customerResources }, request) => {
    return customerResources.find(request.params.id);
  });

  this.put('/customer-resources/:id', ({ customerResources }, request) => {
    let matchingCustomerResource = customerResources.find(request.params.id);

    let body = JSON.parse(request.requestBody);
    let {
      isSelected,
      visibilityData,
      customCoverages,
      customEmbargoPeriod,
      coverageStatement
    } = body.data.attributes;

    matchingCustomerResource.update('isSelected', isSelected);
    matchingCustomerResource.update('visibilityData', visibilityData);
    matchingCustomerResource.update('customCoverages', customCoverages);
    matchingCustomerResource.update('customEmbargoPeriod', customEmbargoPeriod);
    matchingCustomerResource.update('coverageStatement', coverageStatement);

    return matchingCustomerResource;
  });

  // translation bundle passthrough
  this.pretender.get(`${__webpack_public_path__}translations/:rand.json`, this.pretender.passthrough); // eslint-disable-line

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
