export default function unconfiguredBackendScenario(server) {
  server.get('/status', {
    data: {
      id: 'status',
      type: 'status',
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
