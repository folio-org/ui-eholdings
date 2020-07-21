import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  beginCoverage: () => faker.date.past().toISOString().substring(0, 10),
  endCoverage: () => faker.date.future().toISOString().substring(0, 10)
});
