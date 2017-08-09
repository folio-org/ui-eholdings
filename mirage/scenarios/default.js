export default function(server) {
  let vendors = server.createList('vendor', 3);

  server.createList('package', 5, {
    vendor: vendors[0]
  });
}
