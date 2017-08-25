import { okapi } from 'stripes-loader';
import { Response } from 'mirage-server';

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

  // fetch polyfill needs this header set so it can reliably set `response.url`
  const getHeaders = (req) => ({ 'X-Request-URL': req.url });

  // Package resources
  this.get('/packages', ({ packages }, request) => {
    const filteredPackages = packages.all().filter((packageModel) => {
      const query = request.queryParams.search.toLowerCase();
      return packageModel.packageName.toLowerCase().includes(query);
    });

    return new Response(200, getHeaders(request), filteredPackages);
  });

  this.get('/vendors/:vendorId/packages/:packageId', ({ packages }, request) => {
    const vendorPackage = packages.findBy({
      vendorId: request.params.vendorId,
      id: request.params.packageId
    });

    return new Response(200, getHeaders(request), vendorPackage);
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles', ({ customerResources }, request) => {
    return new Response(200, getHeaders(request), customerResources.where({ packageId: request.params.packageId }));
  });

  this.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources }, request) => {
    return new Response(200, getHeaders(request), customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    }));
  });

  this.put('/vendors/:vendorId/packages/:packageId/titles/:titleId', ({ customerResources, titles }, request) => {
    let matchingCustomerResource = customerResources.findBy({
      packageId: request.params.packageId,
      titleId: request.params.titleId
    });

    let { isSelected } = JSON.parse(request.requestBody);
    matchingCustomerResource.update('isSelected', isSelected).save();

    return new Response(200, getHeaders(request), '');
  });

  // Title resources
  this.get('/titles', ({ titles }, request) => {
    const filteredTitles = titles.all().filter((titleModel) => {
      const query = request.queryParams.search.toLowerCase();
      return titleModel.titleName.toLowerCase().includes(query);
    });

    return new Response(200, getHeaders(request), filteredTitles);
  });

  this.get('/titles/:id', ({ titles }, request) => {
    const title = titles.find(request.params.id);
    return new Response(200, getHeaders(request), title);
  });

  // Vendor resources
  this.get('/vendors', ({ vendors }, request) => {
    const filteredVendors = vendors.all().filter((vendorModel) => {
      const query = request.queryParams.search.toLowerCase();
      return vendorModel.vendorName.toLowerCase().includes(query);
    });

    return new Response(200, getHeaders(request), filteredVendors);
  });

  this.get('/vendors/:id', ({ vendors }, request) => {
    const vendor = vendors.find(request.params.id);
    return new Response(200, getHeaders(request), vendor);
  });

  this.get('/vendors/:vendorId/packages', ({ packages }, request) => {
    const vendorPackages =  packages.where( { vendorId: request.params.vendorId } );
    return new Response(200, getHeaders(request), vendorPackages);
  });


  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
