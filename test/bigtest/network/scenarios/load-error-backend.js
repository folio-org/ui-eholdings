export default async function loadErrorBackendScenario(server) {
  await server.get('/status', {
    errors: [{
      title: 'An error has occurred'
    }]
  }, 500);
}
