export default async function providerSearchSorting(server) {
  await server.createList('provider', 3, 'withPackagesAndTitles', {
    name: i => `Provider${i + 1}`,
    packagesSelected: 1,
    packagesTotal: 3
  });
  await server.create('provider', {
    name: 'Totally Awesome Co'
  });
  await server.create('provider', {
    name: 'Health Associations'
  });
  await server.create('provider', {
    name: 'Analytics for everyone'
  });
  await server.create('provider', {
    name: 'Non Matching'
  });
  await server.create('provider', {
    name: 'My Health Analytics 2'
  });
  await server.create('provider', {
    name: 'My Health Analytics 10'
  });
}
