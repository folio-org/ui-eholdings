export default async function titleSearchError(server) {
  await server.get('/titles', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
