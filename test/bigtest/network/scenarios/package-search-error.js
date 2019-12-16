export default function packageSearchError(server) {
  server.get('/packages', {
    errors: [{
      title: 'There was an error'
    }]
  }, 500);
}
