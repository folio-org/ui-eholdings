export default function apiLimitExceededScenario(server) {
  server.get('/status', {
    errors: [{
      title: 'An error has occurred'
    }]
  }, 429);
}
