import { Response } from '@bigtest/mirage';

export default function userNotAssignedToKbError(server) {
  server.get('/user-kb-credential', () => new Response(404));
};
