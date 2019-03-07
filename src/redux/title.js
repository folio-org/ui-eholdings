import model, { hasMany } from './model';

class Title {
  name = '';
  isPeerReviewed = false;
  isSelected = false;
  isTitleCustom = false;
  publicationType = '';
  publisherName = '';
  edition = '';
  description = '';
  contributors = [];
  identifiers = [];
  subjects = [];
  resources = hasMany();
  tags = {
    tagList: [],
  };

  // slightly customized serializer that adds included resources to
  // new title record payloads
  serialize() {
    let data = { id: this.id, type: this.type };
    let { resources, ...attributes } = this.data.attributes;
    let payload = { data };
    const readOnlyAttributes = ['isTitleCustom', 'subjects'];

    data.attributes = Object.keys(attributes).reduce((attrs, attr) => {
      const isReadOnly = readOnlyAttributes.includes(attr);

      if (isReadOnly) return attrs;

      return Object.assign(attrs, { [attr]: this[attr] });
    }, {});

    // when serializing a new title we need to include any new resources
    const isTitleNew = !this.id;

    if (isTitleNew && resources) {
      payload.included = resources.map((resource) => ({
        type: 'resource',
        attributes: resource
      }));
    }
    return payload;
  }
}

export default model({
  type: 'titles',
  path: '/eholdings/titles'
})(Title);
