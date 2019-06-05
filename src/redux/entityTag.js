import model from './model';

class Tag {
  value = '';
}

export default model({
  type: 'tags',
  path: '/eholdings/tags'
})(Tag);
