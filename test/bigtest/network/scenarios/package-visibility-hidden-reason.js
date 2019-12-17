export default async function packageVisibilityHiddenReason(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider',
    id: 'testId'
  });

  await server.create('package', 'isHidden', {
    provider: providerObj,
    name: 'Cool Package',
    contentType: 'E-Book',
    isSelected: true,
    id: 'testId',
  });

}