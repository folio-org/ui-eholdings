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


  // slightly customized serializer that adds included resources to
  // new title record payloads
  serialize() {
    const data = { id: this.id, type: this.type };
    const { resources } = this.data.attributes;
    const payload = { data };

    data.attributes = {
      contributors: this.contributors,
      description: this.description,
      edition: this.edition,
      identifiers: this.identifiers,
      isPeerReviewed: this.isPeerReviewed,
      name: this.name,
      publicationType: this.publicationType,
      publisherName: this.publisherName,
    };

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
