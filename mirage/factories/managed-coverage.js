import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  beginCoverage: () => faker.date.past().toISOString().substring(0, 10),
  endCoverage: () => faker.date.future().toISOString().substring(0, 10)
});
