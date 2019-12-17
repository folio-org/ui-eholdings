export default async function providerSearch(server) {
  await server.createList('provider', 3, 'withPackagesAndTitles', {
    name: i => `Provider${i + 1}`,
    packagesSelected: 1,
    packagesTotal: 3
  });

  await server.create('provider', {
    name: 'Totally Awesome Co'
  });
}
