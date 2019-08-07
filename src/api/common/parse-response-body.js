/**
 * Sometimes the response from the server (or mirage) does not include a
 * body (null). This causes `response.json()` to error with something like
 * "unexpected end of input". This workaround uses `response.text()` and
 * when there are any errors parsing it using `JSON.parse`, the text is
 * returned instead.
 */
export default function (response) {
  return response.text().then((text) => {
    try { return JSON.parse(text); } catch (e) { return text; }
  });
}
