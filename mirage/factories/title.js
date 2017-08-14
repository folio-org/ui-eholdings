import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  titleName: () => faker.company.catchPhrase(),
  publisherName: () => faker.company.companyName()
});
