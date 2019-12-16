export default async function customResourceEditCustomCoverageWithMultipleCustomCoverages(server) {
  const pkg = await server.create('package', 'withProvider', {
    customCoverage: {
      beginCoverage: '2018-12-01',
      endCoverage: '2018-12-31'
    },
    isCustom: true,
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
    id: 'testId',
  });

  const customCoverages = [
    await server.create('custom-coverage', {
      beginCoverage: '2018-12-17',
      endCoverage: '2018-12-20'
    }),
    await server.create('custom-coverage', {
      beginCoverage: '2018-12-01',
      endCoverage: '2018-12-15'
    }),
  ];

  await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
  await resource.save();
}
