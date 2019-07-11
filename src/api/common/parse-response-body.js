export default function parseResponseBody(response) {
  return response.text().then((text) => {
    try { return JSON.parse(text); } catch (e) { return text; }
  });
}
