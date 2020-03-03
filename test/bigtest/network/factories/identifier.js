import { Factory } from '@bigtest/mirage';

export default Factory.extend({
  id: (i) => i,
  subtype: () => 'Online',
  type: () => 'ISBN',
});
