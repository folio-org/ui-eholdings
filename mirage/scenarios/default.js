export default function (server) {
  function createVendor(name, packages = []) {
    let vendor = server.create('vendor', {
      vendorName: name,
      packagesTotal: 0
    });
    packages.forEach((pkg) => {
      server.create('package', 'withTitles', { ...pkg, vendor });
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
      titleCount: 3
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
      titleCount: 2
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
      titleCount: 2
    },
    {
      packageName: 'Edinburgh University Press (NESLi2)',
      contentType: 'E-Journal',
      titleCount: 3
    },
    {
      packageName: 'Edinburgh University Press (SHEDL)',
      contentType: 'E-Journal',
      titleCount: 2
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (JISC)',
      contentType: 'E-Journal',
      titleCount: 6
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (SHEDL)',
      contentType: 'E-Journal',
      titleCount: 3
    }
  ]);

  server.createList('vendor', 5, 'withPackagesAndTitles', {
    packagesTotal: () => Math.floor(Math.random() * 10) + 1
  });
}
