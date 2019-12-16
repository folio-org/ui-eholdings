export default async function customResourceEditCustomCoverageWithoutCustomCoverage(server) {
  const pkg = await server.create('package', 'withProvider', {
    isCustom: true,
    customCoverage: {
      beginCoverage: '2018-12-01',
      endCoverage: '2018-12-31'
    },
    id: 'testId',
  });
  await pkg.save();

  const titleObj = await server.create('title', {
    publicationType: 'Journal',
    isTitleCustom: true
  });

  const resource = await server.create('resource', {
    package: pkg,
    title: titleObj,
    isSelected: true,
    id: 'testId'
  });
  await resource.save();
}
