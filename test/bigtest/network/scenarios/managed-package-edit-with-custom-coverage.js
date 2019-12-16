export default async function managedPackageEditWithCustomCoverage(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider',
    id: 'managedPackageEditWithCustomCoverage',
  });

  await server.create('package', {
    provider: providerObj,
    name: 'Cool Package',
    contentType: 'E-Book',
    isSelected: true,
    id: 'managedPackageEditWithCustomCoverage',
    customCoverage: {
      beginCoverage: '1969-07-16',
      endCoverage: '1972-12-19'
    },
  });
}
