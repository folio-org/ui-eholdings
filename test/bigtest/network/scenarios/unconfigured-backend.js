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
      type: 'configurations',
      attributes: {
        rmapiBaseUrl: '',
        customerId: '',
        apiKey: ''
      }
    }
  });
}
