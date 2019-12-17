export default async function titleSearchSorting(server) {
  await server.create('title', {
    name: 'Football Digest',
    type: 'TLI',
    subject: 'football football'
  });
  await server.create('title', {
    name: 'Biz of Football',
    type: 'TLI',
    subject: 'football football'
  });
  await server.create('title', {
    name: 'Science and Medicine in Football',
    type: 'TLI',
    subject: 'football asd'
  });
  await server.create('title', {
    name: 'UNT Legends: a Century of Mean Green Football',
    type: 'TLI',
    subject: '123'
  });
  await server.create('title', {
    name: 'Analytics for everyone'
  });
  await server.create('title', {
    name: 'My Health Analytics'
  });
}
