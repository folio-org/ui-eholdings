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

  server.get('/configuration', {
    data: {
      id: 'configuration',
      type: 'configuration',
      attributes: {
        customerId: '',
        apiKey: ''
      }
    }
  });
}
