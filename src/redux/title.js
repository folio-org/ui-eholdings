import model, { hasMany } from './model';

class Title {
  name = '';
  edition = '';
  publisherName = '';
  publicationType = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  resources = hasMany();
  isTitleCustom = false;
  isPeerReviewed = false;
  description = '';
  tags = {
    tagList: [],
  };


  // slightly customized serializer that adds included resources to
  // new title record payloads
  serialize() {
    let data = { id: this.id, type: this.type };
    let { resources, ...attributes } = this.data.attributes;
    let payload = { data };

    data.attributes = Object.keys(attributes).reduce((attrs, attr) => {
      return Object.assign(attrs, { [attr]: this[attr] });
    }, {});

    // when serizing a new title we need to include any new resources
    if (!this.id && resources) {
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
