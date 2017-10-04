export default function noBackendScenario(server) {
  let ns = server.namespace;
  server.namespace = '';
  server.get('/_/proxy/modules', []);
  server.namespace = ns;
}
