export default async function managedResourceEditVisibilityResourceNotSelected(server) {
  const providerObj = await server.create('provider', {
    name: 'Cool Provider'
  });

  const providerPackage = await server.create('package', 'withTitles', {
    provider: providerObj,
    name: 'Star Wars Custom Package',
    contentType: 'Online',
  });

  const titleObj = await server.create('title', {
    name: 'Hans Solo Director Cut',
    publicationType: 'Streaming Video',
    publisherName: 'Amazing Publisher'
  });

  await titleObj.save();

  await server.create('resource', {
    package: providerPackage,
    isSelected: false,
    title: titleObj,
    id: 'test',
  });
}
