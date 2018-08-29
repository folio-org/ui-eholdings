import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  factName: () => faker.random.arrayElement([
    '[[mysiteid]]',
    '[[yoursiteid]]]',
    '[[testsiteid]]'
  ]),
  prompt: () => faker.random.arrayElement([
    '/test1/',
    '/test2/',
    '/test3/'
  ]),
  helpText: () => faker.random.arrayElement([
    '<ul><li>Enter your Gale Token</li></ul>',
    '<a>http://test.com/authentication</a>',
    '<ul><li>Get Help Here</li></ul>'
  ]),
  value: () => faker.random.arrayElement([
    null,
    '123456',
    'abcdef'
  ]),
});
