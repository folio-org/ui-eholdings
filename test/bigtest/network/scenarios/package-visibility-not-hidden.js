export default async function packageVisibilityNotHidden(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider',
    id: 'testId'
  });

  await server.create('package', {
    provider: providerObj,
    name: 'Cool Package',
    contentType: 'ebook',
    isSelected: true,
    id: 'testId',
  });
}
