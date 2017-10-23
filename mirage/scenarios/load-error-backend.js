export default function loadErrorBackendScenario(server) {
  server.get('/status', {
    error: 'An error has occurred'
  }, 500);
}
