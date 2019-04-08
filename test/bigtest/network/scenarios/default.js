/* istanbul ignore file */
export default function defaultScenario(server) {
  function createProvider(name, packages = []) {
    const provider = server.create('provider', {
      packagesTotal: packages.length,
      name
    });

    packages.forEach((pkg) => {
      server.create('package', 'withTitles', { ...pkg, provider });
    });
  }

  const customProvider = server.create('provider', {
    name: 'Atlanta A&T Library',
    packagesSelected: 1,
    packagesTotal: 1
  });

  const customPackage = server.create('package', {
    provider: customProvider,
    name: 'Atlanta A&T Drumming Books',
    contentType: 'AggregatedFullText',
    isSelected: true,
    isCustom: true,
    selectedCount: 1,
    titleCount: 1
  });

  const customTitle = server.create('title', {
    name: 'Single, Double, and Triple Paradiddles',
    isTitleCustom: true,
    isPeerReviewed: false,
    isSelected: true,
    description: '',
    edition: ''
  });

  server.create('resource', {
    package: customPackage,
    title: customTitle
  });

  createProvider('Economist Intelligence Unit', [
    {
      name: 'Business Briefings',
      contentType: 'AggregatedFullText',
      titleCount: 9
    },
    {
      name: 'Country Reports & Profiles (EIU)',
      contentType: 'AggregatedFullText',
      titleCount: 3
    },
    {
      name: 'EIU CityData',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      name: 'EIU Complete Country Coverage',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      name: 'EIU: Country Reports Archive (DFG Nationallizenz)',
      contentType: 'AggregatedFullText',
      titleCount: 2
    }
  ]);

  createProvider('Edinburgh University Press', [
    {
      name: 'Digimap Ordnance Survey',
      contentType: 'OnlineReference',
      titleCount: 1
    },
    {
      name: 'EdinburchUniversityPress',
      contentType: 'EJournal',
      titleCount: 2
    },
    {
      name: 'EdinburghUniversityPress (NESLi2)',
      contentType: 'EJournal',
      titleCount: 3
    },
    {
      name: 'Edinburgh University Press (SHEDL)',
      contentType: 'EJournal',
      titleCount: 2
    },
    {
      name: 'Edinburgh University Press Complete Collection (JISC)',
      contentType: 'EJournal',
      titleCount: 6
    },
    {
      name: 'Edinburgh University Press Complete Collection (SHEDL)',
      contentType: 'EJournal',
      titleCount: 3
    }
  ]);

  server.createList('provider', 5, 'withPackagesAndTitles', {
    get packagesTotal() { return Math.floor(Math.random() * 10) + 1; }
  });
}
