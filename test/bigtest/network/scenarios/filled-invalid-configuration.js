export default async function filledInvalidConfiguration(server) {
  await server.put('/configuration', {
    errors: [{
      title: 'Invalid KB API credentials'
    }]
  }, 422);
}
