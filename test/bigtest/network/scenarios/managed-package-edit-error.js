export default async function managedPackageEditError(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider',
    id: 'testId',
  });

  await server.create('package', {
    provider: providerObj,
    name: 'Cool Package',
    contentType: 'E-Book',
    isSelected: true,
    id: 'testId',
  });

  await server.get('/packages/:id', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
