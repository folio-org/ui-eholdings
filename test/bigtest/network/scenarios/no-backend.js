export default function noBackendScenario(server) {
  const ns = server.namespace;
  server.namespace = '';
  server.get('/_/proxy/modules', []);
  server.get('_/proxy/tenants/:id/modules', []);
  server.namespace = ns;
}
