import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from '@bigtest/mirage';
import { searchRouteFor, nestedResourceRouteFor, includesWords } from './helpers';

// typical mirage config export
export default function configure() {
  this.urlPrefix = okapi.url;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', [{
    id: 'mod-kb-ebsco',
    name: 'kb-ebsco',
    provides: [{
      id: 'eholdings',
      version: '0.0.0'
    }]
  }]);

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
    return new Response(201, {
      'X-Okapi-Token': `myOkapiToken:${Date.now()}`
    }, {
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
        rmapiBaseUrl: 'https://sandbox.ebsco.io',
        customerId: 'some-valid-customer-id',
        apiKey: 'some-valid-api-key'
      }
    }
  });

  this.put('/configuration', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  // Current root proxy
  this.get('/root-proxy', {
    data:
      {
        id: 'root-proxy',
        type: 'rootProxies',
        attributes: {
          id: 'root-proxy',
          proxyTypeId: 'bigTestJS'
        }
      }
  });

  // update root proxy
  this.put('/root-proxy', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  // Available root proxies
  this.get('/proxy-types', {
    data: [
      {
        id: '<n>',
        type: 'proxyTypes',
        attributes: {
          id: '<n>',
          name: 'None',
          urlMask: '',
        }
      },
      {
        id: 'bigTestJS',
        type: 'proxyTypes',
        attributes: {
          id: 'bigTestJS',
          name: 'bigTestJS',
          urlMask: 'https://github.com/bigtestjs',
        }
      },
      {
        id: 'microstates',
        type: 'proxyTypes',
        attributes: {
          id: 'microstates',
          name: 'microstates',
          urlMask: 'https://github.com/microstates',
        }
      }
    ]
  });

  // Provider resources
  this.get('/providers', searchRouteFor('providers', (provider, req) => {
    if (req.queryParams.q && provider.name) {
      return includesWords(provider.name, req.queryParams.q.toLowerCase());
    } else {
      return !!provider.name;
    }
  }));

  this.get('/providers/:id', ({ providers }, request) => {
    let provider = providers.find(request.params.id);

    if (provider && provider.packages.length > 25) {
      provider.packages = provider.packages.slice(0, 25);
    }

    return provider;
  });

  this.put('/providers/:id', ({ providers }, request) => {
    let matchingProvider = providers.find(request.params.id);
    let body = JSON.parse(request.requestBody);
    let {
      proxy,
      providerToken
    } = body.data.attributes;
    matchingProvider.update('proxy', proxy);
    matchingProvider.update('providerToken', providerToken);
    return matchingProvider;
  });

  // Package resources
  let packagesFilter = (pkg, req) => {
    let params = req.queryParams;
    let type = params['filter[type]'];
    let selected = params['filter[selected]'];
    let custom = params['filter[custom]'];
    let filtered = true;

    if (params.q && pkg.name) {
      filtered = includesWords(pkg.name, params.q.toLowerCase());
    }

    if (filtered && type && type !== 'all') {
      filtered = pkg.contentType.toLowerCase() === type;
    }

    if (filtered && selected) {
      filtered = pkg.isSelected.toString() === selected;
    }

    if (filtered && custom) {
      // packages don't always have `isCustom` defined
      filtered = pkg.isCustom ? custom === 'true' : custom === 'false';
    }

    return filtered;
  };

  this.get('/packages', searchRouteFor('packages', packagesFilter));
  this.get('/providers/:id/packages', nestedResourceRouteFor('provider', 'packages', packagesFilter));

  this.get('/packages/:id', ({ packages }, request) => {
    let pkg = packages.find(request.params.id);

    if (pkg && pkg.resources.length > 25) {
      pkg.resources = pkg.resources.slice(0, 25);
    }

    return pkg;
  });

  this.put('/packages/:id', ({ packages, resources }, request) => {
    let matchingPackage = packages.find(request.params.id);
    let matchingResources = resources.where({
      packageId: request.params.id
    });

    let body = JSON.parse(request.requestBody);
    let {
      isSelected,
      allowKbToAddTitles,
      customCoverage,
      visibilityData,
      name,
      contentType,
      proxy,
      packageToken
    } = body.data.attributes;

    let selectedCount = isSelected ? matchingResources.length : 0;

    matchingResources.update('isSelected', isSelected);
    matchingResources.update('visibilityData', visibilityData);
    matchingPackage.update('isSelected', isSelected);
    matchingPackage.update('customCoverage', customCoverage);
    matchingPackage.update('selectedCount', selectedCount);
    matchingPackage.update('visibilityData', visibilityData);
    matchingPackage.update('allowKbToAddTitles', allowKbToAddTitles);
    matchingPackage.update('name', name);
    matchingPackage.update('contentType', contentType);
    matchingPackage.update('proxy', proxy);
    matchingPackage.update('packageToken', packageToken);
    return matchingPackage;
  });

  this.post('/packages', ({ packages }, request) => {
    let body = JSON.parse(request.requestBody);
    let pkg = packages.create(body.data.attributes);

    let { customCoverages } = body.data.attributes;

    pkg.update('customCoverages', customCoverages);
    pkg.update('isSelected', true);
    pkg.update('isCustom', true);

    return pkg;
  });

  this.delete('/packages/:id', ({ packages, resources }, request) => {
    let matchingPackage = packages.find(request.params.id);
    let matchingResources = resources.where({
      packageId: request.params.id
    });

    matchingPackage.destroy();
    matchingResources.destroy();

    return {};
  });

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
      filtered = title.resources.models.some((resource) => {
        return resource.isSelected.toString() === selected;
      });
    }

    return filtered;
  }));

  this.get('/titles/:id', ({ titles }, request) => {
    return titles.find(request.params.id);
  });

  this.post('/titles', (schema, request) => {
    let body = JSON.parse(request.requestBody);
    let title = schema.titles.create(body.data.attributes);

    title.update('isSelected', true);
    title.update('isTitleCustom', true);

    for (let include of body.included) {
      if (include.type === 'resource') {
        let pkg = schema.packages.find(include.attributes.packageId);
        schema.resources.create({ package: pkg, title });
      }
    }

    return title;
  });

  // Resources
  this.get('/packages/:id/resources', nestedResourceRouteFor('package', 'resources', (resource, req) => {
    let title = resource.title;
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
      filtered = title.resources.models.some((filteredResource) => {
        return filteredResource.isSelected.toString() === selected;
      });
    }

    if (params.q && title.name) {
      filtered = includesWords(title.name, params.q.toLowerCase());
    }

    return filtered;
  }));

  this.get('/resources/:id', ({ resources }, request) => {
    let resource = resources.find(request.params.id);

    return resource;
  });

  this.put('/resources/:id', ({ resources }, request) => {
    let matchingResource = resources.find(request.params.id);
    let body = JSON.parse(request.requestBody);
    let {
      isSelected,
      visibilityData,
      contributors,
      customCoverages,
      customEmbargoPeriod,
      coverageStatement,
      publicationType,
      publisherName,
      name,
      url,
      description,
      isPeerReviewed,
      edition,
      identifiers,
      proxy
    } = body.data.attributes;

    matchingResource.update('isSelected', isSelected);
    matchingResource.update('visibilityData', visibilityData);
    matchingResource.update('customCoverages', customCoverages);
    matchingResource.update('customEmbargoPeriod', customEmbargoPeriod);
    matchingResource.update('coverageStatement', coverageStatement);
    matchingResource.title.update('contributors', contributors);
    matchingResource.title.update('isPeerReviewed', isPeerReviewed);
    matchingResource.title.update('edition', edition);
    matchingResource.title.update('description', description);
    matchingResource.title.update('name', name);
    matchingResource.update('url', url);
    matchingResource.title.update('publicationType', publicationType);
    matchingResource.title.update('publisherName', publisherName);
    matchingResource.title.update('edition', edition);
    matchingResource.title.update('identifiers', identifiers);
    matchingResource.update('proxy', proxy);

    return matchingResource;
  });

  this.post('/resources', ({ resources, packages }, request) => {
    let body = JSON.parse(request.requestBody);
    let { packageId, titleId, url } = body.data.attributes;
    let { providerId } = packages.find(packageId);

    let resource = resources.create({
      isSelected: true,
      providerId,
      packageId,
      titleId,
      url
    });

    return resource;
  });

  this.delete('/resources/:id', ({ resources }, request) => {
    let matchingResource = resources.find(request.params.id);

    matchingResource.destroy();

    return {};
  });

  // translation bundle passthrough
  this.pretender.get(`${__webpack_public_path__}translations/:rand.json`, this.pretender.passthrough); // eslint-disable-line

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
