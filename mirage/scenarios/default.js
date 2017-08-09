export default function(server) {
  server.createList('vendor', 5, {
    packagesTotal: () => Math.floor(Math.random() * 10) + 1
  });
}
