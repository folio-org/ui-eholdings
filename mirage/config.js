import Mirage from 'mirage-server';

export default function () {
  this.namespace = 'eholdings';

  this.get('/vendors', ({ vendors }, request) => {
    let filteredVendors = vendors.all().filter((vendorModel) => {
      let query = request.queryParams.search.toLowerCase();
      return vendorModel.vendorName.toLowerCase().includes(query);
    });

    return filteredVendors;
  });
}
