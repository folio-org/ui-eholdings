import TitleSerializer from './title';

export default TitleSerializer.extend({
  attrs: [
    'name',
    'publisherName',
    'publicationType',
    'subjects',
    'identifiers',
    'isTitleCustom'
  ]
});
