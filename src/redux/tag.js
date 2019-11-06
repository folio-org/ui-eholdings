import model from './model';

class Tag {
  id = '';
  label = '';
  description = '';

  serialize() {
    return {
      label: this.data.attributes.label,
      description: this.data.attributes.description,
    };
  }
}
export default model({
  type: 'tags',
  path: '/tags?limit=100000'

})(Tag);
