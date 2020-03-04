import TitleSerializer from './title';

// commented attributes are ommitted from our real server
export default TitleSerializer.extend({
  attrs: [
    'name',
    // 'edition',
    'publisherName',
    'publicationType',
    'subjects',
    'contributors',
    'identifiers',
    'isTitleCustom',
    // 'isPeerReviewed',
    // 'description'
  ]
});
