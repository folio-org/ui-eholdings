import model from './model';
import { tagPaths } from '../constants/tagPaths';

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
  path: tagPaths.allTags,
})(Tag);
