import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  beginCoverage: () => faker.date.past().toISOString().substring(0, 10),
  endCoverage: () => faker.date.future().toISOString().substring(0, 10)
});
