export default function unconfiguredBackendScenario(server) {
  server.get('/status', {
    data: {
      type: 'status',
      attributes: {
        'is-configuration-valid': false
      }
    }
  });

  server.get('/configuration', {
    data: {
      type: 'configuration',
      attributes: {
        'customer-id': '',
        'api-key': ''
      }
    }
  });
}
