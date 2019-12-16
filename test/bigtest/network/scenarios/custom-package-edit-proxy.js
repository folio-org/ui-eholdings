
export default function customPackageEditProxy(server) {
  const providerObj = server.create('provider', {
    name: 'Cool Provider',
    id:'testId'
  });

  server.create('package', 'withProxy', {
    provider: providerObj,
    name: 'Cool Package',
    contentType: 'E-Book',
    isCustom: true,
    id: 'testId',
  });
}
