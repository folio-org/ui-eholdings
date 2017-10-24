export default function defaultScenario(server) {
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
      contentType: 'AggregatedFullText',
      titleCount: 9
    },
    {
      packageName: 'Country Reports & Profiles (EIU)',
      contentType: 'AggregatedFullText',
      titleCount: 3
    },
    {
      packageName: 'EIU CityData',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      packageName: 'EIU Complete Country Coverage',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      packageName: 'EIU: Country Reports Archive (DFG Nationallizenz)',
      contentType: 'AggregatedFullText',
      titleCount: 2
    }
  ]);

  createVendor('Edinburgh University Press', [
    {
      packageName: 'Digimap Ordnance Survey',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      packageName: 'EdinburchUniversityPress',
      contentType: 'EJournal',
      titleCount: 2
    },
    {
      packageName: 'EdinburghUniversityPress (NESLi2)',
      contentType: 'EJournal',
      titleCount: 3
    },
    {
      packageName: 'Edinburgh University Press (SHEDL)',
      contentType: 'EJournal',
      titleCount: 2
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (JISC)',
      contentType: 'EJournal',
      titleCount: 6
    },
    {
      packageName: 'Edinburgh University Press Complete Collection (SHEDL)',
      contentType: 'EJournal',
      titleCount: 3
    }
  ]);

  server.createList('vendor', 5, 'withPackagesAndTitles', {
    get packagesTotal() { return Math.floor(Math.random() * 10) + 1; }
  });
}
