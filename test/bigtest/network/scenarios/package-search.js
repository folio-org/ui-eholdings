export default function packageSearch(server) {
  server.createList('package', 3, 'withProvider', 'withTitles', {
    name: i => `Package${i + 1}`,
    isSelected: i => !!i,
    titleCount: 3,
    selectedCount: i => i,
    contentType: i => (!i ? 'ebook' : 'ejournal')
  });

  server.create('package', 'withProvider', {
    name: 'SomethingElse'
  });
}
