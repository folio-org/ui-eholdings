import { get } from 'lodash';

export default function selectEntityTags(entityName, entityId, store) {
  return get(store, ['eholdings', 'data', entityName, 'records', entityId, 'attributes', 'tags', 'tagList'], []);
}
