export default function unconfiguredBackendScenario(server) {
  server.get('/status', {
    data: {
      type: 'status',
      attributes: {
        isConfigurationValid: false
      }
    }
  });

  server.get('/configuration', {
    data: {
      type: 'configuration',
      attributes: {
        customerId: '',
        apiKey: ''
      }
    }
  });
}
