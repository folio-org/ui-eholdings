export default async function customResourceEditCustomCoverageWithCustomCoverage(server) {
  const pkg = await server.create('package', 'withProvider', {
    isCustom: true,
    id: 'testId',
  });
  await pkg.save();

  const titleObj = await server.create('title', {
    publicationType: 'Journal',
    isTitleCustom: true
  });

  const customCoveragesObj = [
    await server.create('custom-coverage', {
      beginCoverage: '2018-12-16',
      endCoverage: '2018-12-19'
    })
  ];

  await server.create('resource', {
    package: pkg,
    title: titleObj,
    isSelected: true,
    id: 'testId',
    customCoverages: customCoveragesObj.map(item => item.toJSON()),
  });
}
