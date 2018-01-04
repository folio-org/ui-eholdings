export default function noBackendScenario(server) {
  let ns = server.namespace;
  server.namespace = '';
  server.get('/_/proxy/modules', []);
  server.get('_/proxy/tenants/:id/modules', []);
  server.namespace = ns;
}
