export default async function configurationError(server) {
  await server.put('/configuration', {
    errors: [{
      title: 'an error has occurred'
    }]
  }, 500);
}
