export default async function managedResourceEditVisibilityTitlesHidden(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider'
  });

  const providerPackage = await server.create('package', 'withTitles', {
    provider: providerObj,
    name: 'Star Wars Custom Package',
    contentType: 'Online',
    vidibilityData: {
      isSelected: true,
      reason: 'Hidden by EP',
    },
  });

  const titleObj = await server.create('title', {
    name: 'Hans Solo Director Cut',
    publicationType: 'Streaming Video',
    publisherName: 'Amazing Publisher'
  });

  await titleObj.save();

  await server.create('resource', 'isHidden', {
    package: providerPackage,
    title: titleObj,
    isSelected: true,
    id: 'test',
  });
}
