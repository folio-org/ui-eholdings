import { Factory } from 'miragejs';

export default Factory.extend({
  id: (i) => i,
  subtype: () => 'Online',
  type: () => 'ISBN',
});
