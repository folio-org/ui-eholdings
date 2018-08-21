import { Factory, faker } from '@bigtest/mirage';

let helpText = '<ul><li>Enter your Gale<sup></sup> site ID in the space provided below. The site ID may contain a combination of alpha/numeric characters, varying in length. <blockquote><p> Example: The site ID immediately follows /itweb/ in a URL. The site ID in the following URL is …………….</ul>';

export default Factory.extend({
  factName: () => faker.random.arrayElement([
    '[[mysiteid]]',
    '[[yoursited]]]',
    '[[testsiteid]]'
  ]),
  prompt: () => faker.random.arrayElement([
    '/test1/',
    '/test2/',
    '/test3/'
  ]),
  helpText: () => faker.random.arrayElement([
    '\u003cul\u003e\r\n    \u003cli\u003eEnter your Test\u003csup\u003e®\u003c/sup\u003e site ID in the space provided below. The site ID may contain a combination of alpha/numeric characters, varying in length. \u003cblockquote style=\\"margin-right: 0px;\\" dir=\\"ltr\\"\u003e\r\n    \u003cp\u003e Example: The site ID immediately follows /itweb/ in a URL. The site ID in the following URL is \u003ci\u003eaa11bb22\u003c/i\u003e. \u003c/p\u003e\r\n    \u003c/blockquote\u003e\u003c/li\u003e\r\n\u003c/ul\u003e\r\n\u003cblockquote style=\\"margin-right: 0px;\\"',
    helpText,
    'http://test.com/authentication'
  ]),
  value: () => faker.random.arrayElement([
    null,
    '123456',
    'abcdef'
  ]),
});
