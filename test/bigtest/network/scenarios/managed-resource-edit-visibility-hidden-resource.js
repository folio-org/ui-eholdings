export default async function managedResourceEditVisibilityHiddenResource(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider'
  });

  const providerPackage = await server.create('package', 'withTitles', {
    provider: providerObj,
    name: 'Star Wars Custom Package',
    contentType: 'Online'
  });

  const titleObj = await server.create('title', {
    name: 'Hans Solo Director Cut',
    publicationType: 'Streaming Video',
    publisherName: 'Amazing Publisher'
  });

  await titleObj.save();

  await server.create('resource', 'isHidden', {
    package: providerPackage,
    isSelected: true,
    title: titleObj,
    id: 'test',
  });
}
