export default function getHeaders(state) {
  return {
    'X-Okapi-Tenant': state.okapi.tenant,
    'X-Okapi-Token': state.okapi.token,
    'Content-Type': 'application/json',
  };
}
