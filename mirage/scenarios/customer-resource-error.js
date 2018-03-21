export default function customerResourceError(server) {
  server.put('/customer-resources/:id', {
    errors: [{
      title: 'What have you done?!'
    }]
  }, 500);

  server.put('/packages/:packageId', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
