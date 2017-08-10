export default function(server) {
  server.createList('vendor', 5, {
    packagesTotal: () => Math.floor(Math.random() * 10) + 1
  });

  function createVendor(name, packages = []) {
    let vendor = server.create('vendor', {
      vendorName: name,
      packagesTotal: 0
    });
    packages.forEach((pkg)=> {
      server.create('package', { ...pkg, vendor });
    });

  }


  createVendor('Economist Intelligence Unit', [
    {
      packageName: 'Business Briefings',
      contentType: 'Aggregated Full Text',
      titleCount: 9
    },
    {
      packageName: 'Country Reports & Profiles (EIU)',
      contentType: 'Aggregated Full Text',
      titleCount: 393
    },
    {
      packageName: 'EIU CityData',
      contentType: 'Online Reference',
      titleCount: 1
    },
    {
      packageName: 'EIU Complete Country Coverage',
      contentType: 'Online Reference',
      titleCount: 1
    },
    {
      packageName: 'EIU: Country Reports Archive (DFG Nationallizenz)',
      contentType: 'Aggregated Full Text',
      titleCount: 193
    }
  ]);

  createVendor('Edinburgh University Press', [
    {
      packageName: 'Digimap Ordnance Survey',
      contentType: 'Online Reference',
      titleCount: 1
    },
    {
      packageName: 'Edinburch University Press',
      contentType: 'E-Journal',
      titleCount: 49
    },
    {
      packageName: 'Edinburgh University Press (NESLi2)',
      contentType: 'E-Journal',
      titleCount: 44
    },
    {
      packageName: 'Edinburgh University Press (SHEDL)',
      contentType: 'E-Journal',
      titleCount: 44
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (JISC)',
      contentType: 'E-Journal',
      titleCount: 48
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (SHEDL)',
      contentType: 'E-Journal',
      titleCount: 46
    }
  ]);


}
