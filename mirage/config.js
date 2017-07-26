import Mirage from 'mirage-server';

export default function () {
  this.namespace = 'eholdings';

  this.get('/vendors', ({ vendors }, request) => {
    let filteredVendors = vendors.all().filter((vendorModel) => {
      return vendorModel.vendorName.includes(request.queryParams.search);
    });

    return filteredVendors;
  });
}
