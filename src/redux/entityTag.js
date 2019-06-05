import model from './model';

class EntityTag {
  value = '';
}

export default model({
  type: 'entityTags',
  path: '/eholdings/tags'
})(EntityTag);
