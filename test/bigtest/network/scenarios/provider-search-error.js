export default async function providerSearchError(server) {
  await server.get('/providers', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
