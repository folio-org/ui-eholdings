export default function loadErrorBackendScenario(server) {
  server.get('/status', {
    errors: [{
      title: 'An error has occurred'
    }]
  }, 500);
}
