export default function customerResourceError(server) {
  server.put('/customer-resources/:id', {
    errors: [{
      title: 'What have you done?!'
    }]
  }, 500);
}
