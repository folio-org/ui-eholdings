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

  function createAccessTypes(accessTypes) {
    accessTypes.forEach((accessType) => {
      server.create('access-type', {
        id: accessType.id,
        ...accessType.attributes,
      });
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

  createAccessTypes([
    {
      id: '1',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 1',
        description: 'description 1',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '2',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 2',
        description: 'description 2',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784+0000',
          updatedDate: '2020-02-03T14:36:06.234+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '33333333-3333-3333-a333-333333333333',
          createdByUsername: 'john_doe',
          updatedByUsername: 'jane_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
      updater: {
        lastName: 'Doe',
        firstName: 'Jane',
      },
    },
    {
      id: '3',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 3',
        description: 'description 3',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '4',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 4',
        description: 'description 4',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '5',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 5',
        description: 'description 5',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '6',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 6',
        description: 'description 6',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '7',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 7',
        description: 'description 7',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '8',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 8',
        description: 'description 8',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '9',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 9',
        description: 'description 9',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '10',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 10',
        description: 'description 10',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '11',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 11',
        description: 'description 11',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '12',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 12',
        description: 'description 12',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '13',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 13',
        description: 'description 13',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
    {
      id: '14',
      type: 'accessTypes',
      attributes: {
        name: 'my custom type 14',
        description: 'description 14',
        metadata: {
          createdDate: '2020-02-03T13:23:56.784',
          updatedDate: '2020-02-03T13:23:56.784+0000',
          createdByUserId: '22222222-2222-2222-a222-222222222222',
          updatedByUserId: '22222222-2222-2222-a222-222222222222',
          createdByUsername: 'john_doe',
        },
      },
      creator: {
        lastName: 'Doe',
        firstName: 'John',
      },
    },
  ]);

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

  server.createList('note-type', 10);
  server.createList('note', 40);
}
