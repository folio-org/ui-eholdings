export default function unconfiguredBackendScenario(server) {
  server.get('/status', {
    data: {
      id: 'status',
      type: 'statuses',
      attributes: {
        isConfigurationValid: false
      }
    }
  });

  server.get('/kb-credentials', {
    data: []
  });
}
