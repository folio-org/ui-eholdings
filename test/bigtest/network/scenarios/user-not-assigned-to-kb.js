export default function userNotAssignedToKbError(server) {
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
    data: [
      {
      'id': '1',
        'type': 'credentials',
        'attributes': {
          'name': '111111111',
          'apiKey': '',
          'url': '',
          'customerId': ''
        },
        'metadata': {
          'createdDate': '2020-03-17T15:22:04.098',
          'updatedDate': '2020-03-17T15:23:04.098+0000',
          'createdByUserId': '1f8f660e-7dc9-4f6f-828f-96284c68a250',
          'updatedByUserId': '6893f51f-b40c-479d-bd78-1704ab5b802b',
          'createdByUsername': 'john_doe',
          'updatedByUsername': 'jane_doe'
        }
      },
      {
        'id': '2',
        'type': 'credentials',
        'attributes': {
          'name': '2222222',
          'apiKey': 'XXXX',
          'url': 'YYYY',
          'customerId': 'ZZZZ'
        },
        'metadata': {
          'createdDate': '2020-03-17T15:22:04.098',
          'updatedDate': '2020-03-17T15:23:04.098+0000',
          'createdByUserId': '1f8f660e-7dc9-4f6f-828f-96284c68a250',
          'updatedByUserId': '6893f51f-b40c-479d-bd78-1704ab5b802b',
          'createdByUsername': 'john_doe',
          'updatedByUsername': 'jane_doe'
        }
      },
    ],
  });
};
