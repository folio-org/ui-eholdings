export default function serverPutErrors(server) {
  server.put('/customer-resources/:id', {
    errors: [{
      title: 'Server error, try again'
    }]
  }, 500);

  server.put('/packages/:packageId', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
