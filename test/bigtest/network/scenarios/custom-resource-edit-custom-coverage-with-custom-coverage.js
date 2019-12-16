export default async function customResourceEditCustomCoverageWithCustomCoverage(server) {
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

  const customCoverages = [
    await server.create('custom-coverage', {
      beginCoverage: '2018-12-16',
      endCoverage: '2018-12-19'
    })
  ];

  const resource = await server.create('resource', {
    package: pkg,
    title: titleObj,
    isSelected: true,
    id: 'testId',
  });

  await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
  await resource.save();
}
