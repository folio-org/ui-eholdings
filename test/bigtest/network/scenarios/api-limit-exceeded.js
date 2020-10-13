export default function apiLimitExceededScenario(server) {
  server.get('/status', () => {
    console.log('api limit exceeded');

    return {
      errors: [{
        title: 'API limit exceeded',
      }],
    };
  }, 429);
}
