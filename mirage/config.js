export default function () {
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
}
